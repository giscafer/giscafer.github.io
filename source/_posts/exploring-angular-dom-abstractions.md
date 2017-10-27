title: 使用 ViewContainerRef 探索Angular DOM操作
date: 2017-10-21 11:40:44
categories:
- 技术
- Angular

tags:
- ViewContainerRef

---

Source From:
[Exploring Angular DOM manipulation techniques using ViewContainerRef](https://blog.angularindepth.com/exploring-angular-dom-abstractions-80b3ebcfc02)

_翻译：giscafer
说明：根据个人理解翻译，不完全词词对应。_


每当我读到关于使用Angular DOM的操作时，我总是会看到其中的一个或几个类: `ElementRef`, `TemplateRef`, `ViewContainerRef`等。遗憾的是，尽管Angular文档或相关文章当中提到这三者的一些内容，但我还没有发现关于这三者如何协作的完整的理想模型和示例的描述。本文旨在描述这种模型。

如果你学习过`angular.js`的话，你就会知道在`angular.js`中很容易去操作DOM。Angular注入DOM `element` 到 `link` 函数中，你可以查询组件模板内的任何节点，添加或删除子节点，修改样式等等。然而，这种方法有一个主要缺点——它被紧紧绑定到一个浏览器平台上（意思是脱离浏览器就不能玩了）。

新的 Angular 版本运行在不同的平台上——在浏览器上，在移动平台上，或者在 web worker 中。因此，需要在平台特定API 和框架接口之间进行抽象级别的抽象。从 Angular 来看，这些抽象的形式有以下的参考类型: `ElementRef`,  `TemplateRef`,  `ViewRef`,  `ComponentRef`  和  `ViewContainerRef`。在本文中，我们将详细介绍每个引用类型，并展示如何使用它们来操作DOM。

<!-- more -->

## @ViewChild

在探索DOM抽象之前，让我们了解一下如何在组件/指令类( component/directive class)中访问这些抽象。Angular 提供了一个称为DOM查询的机制。它以 `@ViewChild` 和 `@ViewChildren`  装饰器的形式出现。它们的行为相同，只有前者返回一个引用，而后者返回多个引用作为 [QueryList](https://angular.io/api/core/QueryList) 对象。在本文中的例子中，我将主要使用 `ViewChild` 装饰器，而不会在它之前使用@符号。

通常，这些装饰器与[模板引用变量](https://angular.io/guide/template-syntax#!#ref-vars)一起工作。**模板引用变量(template reference variable)** 仅仅是模板中的DOM元素的命名引用。您可以将其视为与 `html` 元素的id属性类似的东西。使用模板引用标记DOM元素，然后使用 `ViewChild` 装饰器 在类中查询它。这里有一个基本的例子:

```ts
@Component({
    selector: 'sample',
    template: `
        <span #tref>I am span</span>
    `
})
export class SampleComponent implements AfterViewInit {
    @ViewChild("tref", {read: ElementRef}) tref: ElementRef;

    ngAfterViewInit(): void {
        // outputs `I am span`
        console.log(this.tref.nativeElement.textContent);
    }
}
```

ViewChild decorator 的基本语法如下:

```ts
@ViewChild([reference from template], {read: [reference type]});
```

在这个示例中，您可以看到，我将 `tref` 指定为 `html` 中的模板引用名称，并接收与此元素关联的
 `ElementRef` 。第二个参数 `read` 并不总是必需的，因为 Angular 可以通过DOM元素的类型推断引用类型。例如，如果它是一个简单的 `html` 元素，比如 `span`，Angular 返回 `ElementRef`。如果它是一个 `template` 模板，它将返回 `TemplateRef` 。一些引用，如 `ViewContainerRef` 不能被推断，并且必须在
 `read` 参数中被声明。其他的，如 `ViewRef` 不能从 DOM 接收返回，必须手动构造。

好了，现在我们知道了如何查询引用，让我们开始探索它们。

## ElementRef

这是最基本的抽象概念。如果您观察[它的类结构](https://github.com/angular/angular/blob/4.4.4/packages/core/src/linker/element_ref.ts#L1-L48)，您将看到它只包含与之关联的原生元素（native element）。它对于访问原生DOM元素非常有用，正如我们在这里看到的:

```ts
// outputs `I am span`
console.log(this.tref.nativeElement.textContent);
```
然而，这种用法却被 Angular 团队 所劝阻。它不仅会带来[安全风险](https://angular.io/api/core/ElementRef)，而且还会在应用程序和呈现层之间产生紧密耦合，使得在多个平台上运行应用程序变得困难。我认为，它不是访问 `nativeElement` 来打破抽象，而是使用特定的DOM API，比如 `textContent` 。但是，稍后您将看到，在 Angular 上实现的DOM操作思想模型几乎不需要这样一个较低级别的访问。

`ElementRef` 可以通过使用 ViewChild decorator作为任何 DOM元素被返回 。但是由于所有组件都驻留在一个自定义DOM元素中，并且所有的指令都被应用于DOM元素，组件和指令类可以通过DI机制（依赖注入机制）获得与它们的宿主元素（host element）相关联的元素的实例:

```ts

@Component({
    selector: 'sample',
    ...
export class SampleComponent{
    constructor(private hostElement: ElementRef) {
        //outputs <sample>...</sample>
        console.log(this.hostElement.nativeElement.outerHTML);
    }

```
因此，虽然组件可以通过DI访问它的宿主元素，但 ViewChild decorator 通常会在其视图(模板)（view (template)）中获得对DOM元素的引用。指令的副作用——他们没有任何视图模板（views），他们通常直接与他们所依附的元素一起工作。

## TemplateRef

对于大多数web开发人员来说，模板的概念应该是熟悉的。模板是一组DOM元素，在应用程序的视图中可以重用。在HTML5标准引入模板标签[template](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)之前，大多数模板都是在一个带有一些 `type` 属性变化的脚本标记的浏览器中完成的:

```ts
<script id="tpl" type="text/template">
  <span>I am span in template</span>
</script>
```
这种方法当然有许多缺点，比如语义和手动去创建DOM模型的必要性。使用模板标签 `template ` 浏览器解析 `html` 并创建 `DOM` 树，但不会渲染它。然后可以通过 `content` 属性访问它:

```ts
<script>
    let tpl = document.querySelector('#tpl');
    let container = document.querySelector('.insert-after-me');
    insertAfter(container, tpl.content);
</script>
<div class="insert-after-me"></div>
<template id="tpl">
    <span>I am span in template</span>
</template>
```
Angular 拥抱HTML5的这种方法并实现 `TemplateRef` 类以变更好的操作使用模板。下面是如何使用它:

```ts
@Component({
    selector: 'sample',
    template: `
        <ng-template #tpl>
            <span>I am span in template</span>
        </ng-template>
    `
})
export class SampleComponent implements AfterViewInit {
    @ViewChild("tpl") tpl: TemplateRef<any>;

    ngAfterViewInit() {
        let elementRef = this.tpl.elementRef;
        // outputs `template bindings={}`
        console.log(elementRef.nativeElement.textContent);
    }
}
```

框架从DOM中删除模板元素，并在其位置插入注释。这就是呈现时的样子:

```html
<sample>
    <!--template bindings={}-->
</sample>
```

通过它本身， `TemplateRef` 类是一个简单的类。它在 `elementRef ` 属性中引用它的宿主元素，并有一个`createEmbeddedView` 方法。但是，这个方法非常有用，因为它允许我们创建一个视图并返回一个引用作为 `ViewRef`。

## ViewRef

`ViewRef` 表示一个Angular 视图。在 Angular 框架中，视图（View）是应用程序UI的基本构件。它是构成和毁灭在一起的最小元素组合。Angular 鼓励开发人员将UI看作是视图的组成，而不是独立的html标记树。

Angular 支持两种视图:

- Embedded Views which are linked to a Template （连接到模板的嵌入视图）
- Host Views which are linked to a Component (连接到组件的宿主视图)

### Creating embedded view （创建嵌入视图）

模板仅包含视图的蓝图。可以使用前面提到的 `createEmbeddedView ` 方法从模板中实例化一个视图:

```ts
ngAfterViewInit() {
    let view = this.tpl.createEmbeddedView(null);
}
```
### Creating host view（创建宿主视图）

当组件被动态实例化时，会创建宿主视图。使用 `ComponentFactoryResolver` 可以动态地创建一个组件:

```ts
constructor(private injector: Injector,
            private r: ComponentFactoryResolver) {
    let factory = this.r.resolveComponentFactory(ColorComponent);
    let componentRef = factory.create(injector);
    let view = componentRef.hostView;
}
```
在 Angular 中，每个组件都被绑定到一个注入器（injector）的特定实例，因此我们在创建组件时传递当前的注入器实例。另外，不要忘记必须将动态实例化的组件添加到模块或托管组件的 `EntryComponents`
 中。

因此，我们已经看到了如何创建嵌入式视图和宿主视图。一旦创建了视图，就可以使用 `ViewContainer `
 将其插入到DOM中。下一节将探讨其功能。

## ViewContainerRef

表示一个容器，其中可以附加一个或多个视图。

这里要提到的第一件事是，任何DOM元素都可以用作视图容器。有趣的是，Angular 在元素内部没有插入视图，而是在元素绑定到 `ViewContainer` 之后附加它们。这类似于 `router-outlet` 插入组件。

通常，一个好的候选对象可以标记一个 `ViewContainer` 应该被创建的位置，它是 `ng-container` 元素。它是作为一个注释呈现的，因此它不会向DOM引入冗余的html元素。下面是一个 `ViewContainer` 的示例：

```ts
@Component({
    selector: 'sample',
    template: `
        <span>I am first span</span>
        <ng-container #vc></ng-container>
        <span>I am last span</span>
    `
})
export class SampleComponent implements AfterViewInit {
    @ViewChild("vc", {read: ViewContainerRef}) vc: ViewContainerRef;

    ngAfterViewInit(): void {
        // outputs `template bindings={}`
        console.log(this.vc.element.nativeElement.textContent);
    }
}
```

正如其他DOM抽象一样， `ViewContainer` 被绑定到通过 `element` 属性访问的特定DOM元素。在这个例子中，它绑定到 `ng-container` 元素作为注释，因此输出是 `template bindings={}` 。

### Manipulating views （操作视图）

`ViewContainer` 为操作视图提供了一个方便的API:

```ts
class ViewContainerRef {
    ...
    clear() : void
    insert(viewRef: ViewRef, index?: number) : ViewRef
    get(index: number) : ViewRef
    indexOf(viewRef: ViewRef) : number
    detach(index?: number) : ViewRef
    move(viewRef: ViewRef, currentIndex: number) : ViewRef
}
```
我们前面已经看到了如何从模板和组件手动创建两种视图。一旦我们有了视图，我们就可以使用insert方法将它 `insert` 到DOM中。因此，这里有一个示例，从模板创建一个嵌入式视图，并将其插入由 `ng - container` 元素标记的特定位置 :

```ts
@Component({
    selector: 'sample',
    template: `
        <span>I am first span</span>
        <ng-container #vc></ng-container>
        <span>I am last span</span>
        <template #tpl>
            <span>I am span in template</span>
        </template>
    `
})
export class SampleComponent implements AfterViewInit {
    @ViewChild("vc", {read: ViewContainerRef}) vc: ViewContainerRef;
    @ViewChild("tpl") tpl: TemplateRef<any>;

    ngAfterViewInit() {
        let view = this.tpl.createEmbeddedView(null);
        this.vc.insert(view);
    }
}
```
有了这个实现，生成的html就像这样:
```html
<sample>
    <span>I am first span</span>
    <!--template bindings={}-->
    <span>I am span in template</span>

    <span>I am last span</span>
    <!--template bindings={}-->
</sample>
```

为了从DOM中删除一个视图，我们可以使用 `detach`方法。所有其他方法都是自解释性的，可用于获取索引视图的引用，将视图移到另一个位置，或者从容器中删除所有视图。

### Creating Views (创建视图)

`ViewContainer` 还提供了自动创建视图的API:

```ts
class ViewContainerRef {
    element: ElementRef
    length: number

    createComponent(componentFactory...): ComponentRef<C>
    createEmbeddedView(templateRef...): EmbeddedViewRef<C>
    ...
}
```
这些都是我们在上面手工完成的简单方便的包装。它们从模板或组件创建视图，并将其插入指定的位置。

## ngTemplateOutlet 和 ngComponentOutlet

虽然知道底层机制是如何工作的总是很好，但通常都希望有某种快捷方式。此快捷方式以两种指令形式出现: `ngTemplateOutlet` 和 `ngComponentOutlet` 。在撰写本文时，两者都是实验性的，`ngComponentOutlet` 将在版本4中可用（angular4+已可以随意使用）。但如果你已经读过上面所有的内容，就很容易理解它们的作用。

### ngTemplateOutlet

它将DOM元素标记为 `ViewContainer` ，并在其中插入一个由模板创建的嵌入视图，而不需要在组件类中显式地这样做。这意味着上面的例子中我们创建了一个视图并将其插入`#vc` DOM元素，可以这样重写:

```ts
@Component({
    selector: 'sample',
    template: `
        <span>I am first span</span>
        <ng-container [ngTemplateOutlet]="tpl"></ng-container>
        <span>I am last span</span>
        <template #tpl>
            <span>I am span in template</span>
        </template>
    `
})
export class SampleComponent {}
```
您可以看到，我们在组件类中不使用任何实例化代码的视图。非常方便。

### ngComponentOutlet

该指令类似于 `ngTemplateOutlet`，其不同之处在于它创建了一个宿主视图(实例化一个组件)，而不是一个嵌入式视图。你可以这样使用:
```html
<ng-container *ngComponentOutlet="ColorComponent"></ng-container>
```

## 总结

现在，所有这些信息似乎都很容易消化，但实际上它是相当连贯的，并在通过视图操作DOM的过程中形成了一个清晰的理想模型。您可以通过使用 `ViewChild` 查询和模板变量引用来获得 Angular DOM 抽象的引用。围绕DOM元素的最简单的包装是 `ElementRef` 。对于模板，您有 `TemplateRef`，它允许您创建一个嵌入式视图。 可以通过使用 `ComponentFactoryResolver`创建的  `componentRef` 访问宿主视图。视图可以使用 `ViewContainerRef` 进行操作。有两种指令使手动过程变为自动化：`ngTemplateOutlet ` ——操作嵌入视图 和 `ngComponentOutlet `—— 创建宿主视图（动态组件）。


<完>