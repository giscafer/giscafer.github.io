title: angular实现IM聊天图片发送
date: 2017-05-07 11:49:39
categories:
- 技术
- Angular
tags:
- Angular
- im

---

IM聊天图片发送有两种方式

- 截图粘贴到信息框后点击发送
- 选择本地图片发送

图片剪切粘贴，使用QQ或者其他平台的截图功能，截图后粘贴`Ctrl+V`，这个过程需要获取粘贴板上的图片数据，并在页面中展示，也就是将图片数据创建一个img元素，就可以显示出来了。

<!--more-->

## 从粘贴面板中获取图片数据

```javascript

    /**
     * 黏贴发送图片
     * @param e
     */
    pasteData(e) {
        e.preventDefault();
        let clipboardData = e.clipboardData;
        if (clipboardData) { //如果支持这个
            let items = clipboardData.items; //获取黏贴里的对象
            if (!items) {
                return;
            }
            let item;
            let types = clipboardData.types || [];
            for (let i = 0, len = types.length; i< len; i++) {
                if (types[i] === 'Files') {
                    item = items[i];
                    break;
                }
            }
            if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
                imgReader(item);
            }
        }
        function imgReader(obj) {
          let $messageBox=$('#message-boxID');
            let file = obj.getAsFile(),
                reader = new FileReader();
            // 读取文件
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                let img = new Image();
                img.src = e.target['result'];
                img.className = 'chatImg';

                $messageBox.append(img);
                setTimeout(() => {
                    $messageBox.scrollTop($messageBox[0].scrollHeight);
                }, 0)
            };
        }
    }

```

## 本地图片选择


```html
 <input id="upImg"  name="fileTrans" type="file" (change)="onFileSelect($event)"/>

```


```javascript

    /**
     * 选择图片
     * @param event
     */
    files:any[]=[];
    onFileSelect(event) {
        this.files=[];
        let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
        let file;
        for (let i = 0; i < files.length; i++) {
            file = files[i];
            if (this.isImage(file)) {
                file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[i])));
                this.files.push(files[i]);
            }
        }
        let fileUrl = file.objectURL.changingThisBreaksApplicationSecurity;
        let img = new Image();
        img.src = fileUrl;
        img.className = 'chatImg';

        $('#message-boxID').append(img);
    }

```


## 图片上传服务器

前端angular上传图片到服务器，必然是ajax请求的方式，将图片数据转成二进制流传给后端了。

```javascript

  url:string="http://localhost:8080/upload";
  progress:number=0;//进度
  
  uploadPic(formData):Promise<any> {
        let xhr = new XMLHttpRequest(),
        
       
        //封装xhr请求
        return new Pormise(resolve,reject){
            xhr.upload.addEventListener('progress', (e: ProgressEvent) => {
            if(e.lengthComputable) {
              this.progress = Math.round((e.loaded * 100) / e.total);
            }
            }, false);

            xhr.onreadystatechange = () => {
                if(xhr.readyState == 4) {
                    this.progress = 0;
                    
                    if(xhr.status >= 200 && xhr.status < 300)
                        resolve({xhr: xhr, files: this.files});
                    else
                        reject({xhr: xhr, files: this.files});
                }
            };
            
            xhr.open('POST', this.url, true);
            //jwt后端验证，设置请求头部信息，解决跨域
            xhr.setRequestHeader("Authorization", "Basic " + localStorage.getItem('jwt'));
            
            xhr.send(formData);
        }
    }


```

将以上方法写到一个`upload-file.servie.ts`中。然后其他地方就可以使用`uploadFileService.uploadPic()`方法调用了。

这里后端代码忽略，后端Java或者nodejs都很简单，接收文件二进制流保存，或者是上传到百度云与阿里云。

## 信息发送按钮处理

发送信息处理，需要处理好文本信息和图片信息两种。

```javascript

/**
 * dataURL to blob, ref to https://gist.github.com/fupslot/5015897
 * @param dataURI
 * @returns {Blob}
 */
function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
}

/**
     * 发送消息
     * @param taskValue
     */
    sendMessage() {
        let dateTime = this.dateFromat.FormatDate(new Date());
        let value = $('#message-boxID').html();
        let isImg = value.includes('<img');
        //如果是图片信息
        if (isImg) {
            let formData = new FormData();
            let dataURL="";
            let src=$(value)[0].src;
            //图片截图粘贴
            if(src.includes('data:images')){
                dataURL=src;
                let blob = dataURItoBlob(dataURL);
                formData.append('file', blob);
            
            //图片本地选择
            }else if(src.includes('blob:http')){
                 //files是图片选择时保存的图片文件对象，见onFileSelect方法
                for(let i = 0; i < this.files.length; i++) {
                    formData.append('file', this.files[i], this.files[i].name);
                }
            }
            //调用上传图片方法
            this.uploadFileService.uploadPic(formData).then(result=>{
                //上传成功，do something
                console.log(result);
                
            }).catch(err=>{
                console.log('图片上传失败'+err);
            })
        }else{
            //非图片信息，文本发送
            //this.submitMessage(value);
        }

    }

```

<完>