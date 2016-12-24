title: 代码理解React组件生命周期过程
date: 2016-12-15 00:30:30
categories:
- 技术
- React
tags:
- React组件
- React组件生命周期

---

## 生命周期

React Component整个生命周期分为三大块：**初始化——存在期（更新）——销毁清理**

### 首次实例化 调用方法

- getDefaultProps()
- getInitialState()
- componentWillMount()
- render()
- componentDidMount()()

*ES6写法中则为*

- constructor()
- componentWillMount()
- render()
- componentDidMount()


 
### 存在期 调用方法

** `props` 或 `state`状态改变**

- componentWillReceiveProps()
- shouldComponentUpdate()
- componentWillUpdate()
- render()
- componentDidUpdate()

### 销毁清理 调用方法

- componentWillUnmount()

<!--more-->

## 代码演示

创建一个`LifeCycleComponent.js`组件

```javascript
    'use strict'
import React from 'react';
import Nav from '../nav/Nav';

class LifeCycleComponent extends React.Component{
    constructor(props){
        super(props);
        fpLog('初始化调用:constructor()');
    }
    //在完成首次渲染之前调用，此时仍可以修改组件的state
    componentWillMount(){
        fpLog('完成渲前调用:componentWillMount()')
    }
    render(){
        fpLog('渲染时调用:render()');
        return(
            <div>
                <Nav/>
                <p>{this.props.text}</p>
                <a href="https://facebook.github.io/react/docs/react-component.html" target="_blank">Component Specs and Lifecycle</a>
            </div>
        )
    }
    shouldComponentUpdate(nextProps, nextState){
        //该方法用来做一下性能优化，默认是返回true，返回false则阻止render()调用，跳过后续的生命周期方法
        //在首次渲染期间或者调用了forceUpdate方法后，该方法不会被调用
        fpLog('当渲染新的props或state调用:shouldComponentUpdate()');
        fpLog2('<span style="color:blue">原始props.text='+this.props.text+'</span>');
        fpLog2('<span style="color:red">改变后的props.text='+nextProps.text+'</span>');

        if(this.props.info!==nextProps.text){
            return true
        }
    }
    componentWillUpdate(){
         //该方法中不允许更新props或state，也就是更新也是无效的
        fpLog('接收到新的props或者state后，进行渲染之前调用:componentWillUpdate()');
    }
    componentDidUpdate(){
        fpLog('完成渲染新的props或者state后调用，此时可以访问到新的DOM元素:componentDidUpdate()');
    }
    //真实DOM渲染后调用
    componentDidMount(){
        fpLog('真实DOM渲染后调用:componentDidMount()')
    }
    componentWillReceiveProps(nextProps){
        fpLog('组件接收到新的props时调用:componentWillReceiveProps()---'+nextProps.text)
    }
    componentWillUnmount(){
        fpLog('组件销毁前调用：componentWillUnmount()')
    }
}
LifeCycleComponent.dispalyName='LifeCycleComponentDemo';
export default LifeCycleComponent;

```

**父组件入口文件`Main.js`**，改组件主要用来动态改变`state`值后，观察`LifeCycleComponent`组件的生命周期方法的调用情况

```javascript

import LifeCycleApp from './LifeCycle';
import React from 'react';


class LifeCycleMainComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            info: 'The React Component Lifecycle'
        }
    }
    render() {
        return (
            <LifeCycleApp text={this.state.info} />
        );
    }
    componentDidMount() {
        //定时更新state的值
        setTimeout(() => {
            this.setState({
                info: 'React组件生命周期'
            })
        }, 2000)
        setTimeout(() => {
            this.setState({
                info: '再次改变state值'
            })
        }, 5000)
    }
    componentWillUnmount() {

    }
}

LifeCycleMainComponent.defaultProps = {
};

export default LifeCycleMainComponent;


```

最后输出日志为：

```
- 初始化调用:constructor()
- 完成渲前调用:componentWillMount()
- 渲染时调用:render()
- 真实DOM渲染后调用:componentDidMount()
- 组件接收到新的props时调用:componentWillReceiveProps()---React组件生命周期
- 当渲染新的props或state调用:shouldComponentUpdate()
>>> 原始props.text=The React Component Lifecycle
>>> 改变后的props.text=React组件生命周期
- 接收到新的props或者state后，进行渲染之前调用:componentWillUpdate()
- 渲染时调用:render()
- 完成渲染新的props或者state后调用，此时可以访问到新的DOM元素:componentDidUpdate()
- 组件接收到新的props时调用:componentWillReceiveProps()---再次改变state值
- 当渲染新的props或state调用:shouldComponentUpdate()
原始props.text=React组件生命周期
改变后的props.text=再次改变state值
- 接收到新的props或者state后，进行渲染之前调用:componentWillUpdate()
- 渲染时调用:render()
- 完成渲染新的props或者state后调用，此时可以访问到新的DOM元素:componentDidUpdate()



```

结果截图：

![React Component lifeCycle](https://raw.githubusercontent.com/giscafer/react-demo-list/master/src/images/lifecycle.png)


## 源码

https://github.com/giscafer/react-demo-list

[参考链接]

* [React.Component](https://facebook.github.io/react/docs/react-component.html)