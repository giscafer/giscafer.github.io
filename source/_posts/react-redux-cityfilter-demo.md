title: React 与 Redux 实践 —— 城市筛选面板
date: 2017-1-20 18:51:20
categories:
- 技术
- React
tags:
- React
- redux
- react-redux
---


Redux 是 JavaScript `状态容器`，提供`可预测化`的状态管理。Redux的出现，可以让你构建一致化的应用，运行与不同的环境。

要点

- 应用中所有的 state 都以一个对象树的形式存储在一个单一的 store 中；
- 唯一改变 store 的办法是触发 action，一个描述发生什么的对象；
- 为了描述 action 如何改变 state 树，你需要编写 reducers；  
- 为了UI组件 components 状态无关，你需要编写 containers 来负责管理数据和业务逻辑。


所以，关于组件部分，明智的做法是在最外层上使用 Redux ，然后通过 `Props` 方式传值给内部子组件，使得components UI组件仅仅是`pure render`（纯展示）

<!--more-->

**containers 与 components 区别对比**

|          | containers（容器组件）  | components（UI组件）  |
| ------------- |:-------------:|:-----:|
| **Location**    | 最顶层，路由处理 | 中间和子组件 |
| **与Redux联系**  | 是    |  否 |
| **读取数据** | 从 Redux 获取 state    |   从 props 获取数据 |
| **修改数据** | 从 Redux 派发 action    |   从 props 调用回调函数 |


## 例子

通过一个城市筛选面板来理解 React + Redux 的使用

![](/static/img/react-redux-cityfilter-demo.gif)

示例demo：http://giscafer.com/react-demo-list/#/citypanel

源码：https://github.com/giscafer/react-demo-list


**编写 React 应用的时候，会有一个大致的开发步骤**：

* 构建应用状态树 state 结构
* 编写 action （描述已发生事件的普通对象，所有修改 state 的操作都必须通过触发action）
* 编写 reducers （描述 action 如何改变 state tree）
* 编写 UI组件 components （纯组件，无状态，所有参数通过Props传，可复用性）
* 编写 容器组件 containers （用来负责管理数据和业务逻辑，react-redux 链接components）
* 通过 createStore 创建store，通过 Provider 包装根组件


## Action 创建常量和函数

定好`state tree`后，编写actions

`actions.jsx`

```JavaScript


/**
 * citypanel actions
 */
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';


export function setVisibilityFilter(filter) {
    return { type: SET_VISIBILITY_FILTER, filter }
}

```

## Reducers

当应用很大时，可以将它拆成多个小的 reducers，分别独立地操作 state tree 的不同部分，因为 reducer 只是函数，你可以控制它们被调用的顺序，传入附加数据，甚至编写可复用的 reducer 来处理一些通用任务，如分页器


`reducer 和 action 是好基友`

`./reducers/cityList.jsx` 

```JavaScript


import { SET_VISIBILITY_FILTER } from '../../actions/citypanel/actions';
import { cityData } from './cityData.js';
const initialState = cityData.filter(item => item['citynum'])
console.log(initialState)
export default function cityList(state = initialState, action) {

    switch (action.type) {
        case SET_VISIBILITY_FILTER:
            return cityFilter(action.filter)
        default:
            return state
    }

}
function cityFilter(filter) {
    return cityData.map((item) => {
        if (filter === '特大' || !filter) {
            if (item['citynum']) {
                return item;
            }
        } else if (item['pinyin'][0].toLocaleUpperCase() === filter && !item['citynum']) {
            return item;
        } else {
            console.log(filter)
        }
    })
}


```


`./reducers/index.jsx` 组合所有reducers （多个的时候用）

```JavaScript


import { combineReducers } from 'redux'
import cityList from './cityList'

//使用redux的combineReducers方法将所有reducer打包起来
const rootReducer = combineReducers({
    cityList
})

export default rootReducer

```


## UI组件components

宗旨就是`pure function`

`./components/cityList.jsx`

```JavaScript

import React from 'react';
export default ({cityList = []}) => {
    return (
        <ul className='city-list'>
            {
                cityList.map((city,index) => {
                    if(city){
                        return <li className='left textCenter' key={index} data-name={city.name}>{city.name}</li>
                    }
                })
            }
        </ul>
    );
}

```


`./components/letterFilter.jsx`

```JavaScript

import React from 'react';

export default ({onFilterChange}) => {
    // let letterArr = new Array(26);
    // for (var i = 0; i < 26; i++) {
    //     letterArr[i]=String.fromCharCode((65 + i));
    // }
    // console.log(letterArr)
    let letterArr=['特大','A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    return (
        <ul className='city-index'>
            {
                letterArr.map((letter,i) => {
                    return <li className='left textCenter on_mouseover' key={i} onClick={()=>{ onFilterChange(letter) }}>{letter}</li>
                })
            }
        </ul>
    );
}

```


外层组件组合letterFilter与cityList子组件，`./components/index.jsx`

//此处的函数参数cityList与setVisibilityFilter是由容器组件传输

```JavaScript

import React from 'react';
import LetterFilter from './letterFilter';
import CityList from './cityList';
import '../../styles/citypanel/index.less';
import Nav from '../nav/Nav';

export default ({cityList = [], setVisibilityFilter}) => {
    return (
        <div className='city-panel'>
             <Nav />
            <CityList cityList={cityList} />
            <LetterFilter onFilterChange={setVisibilityFilter} />
        </div>
    )
}

```


## 容器组件containers

主要是通过`react-redux`中间件提供的`connect`方法来链接`containers`与`components`，而`connect` 方法提供了两个方法 `mapStateToProps` 与 `mapDispatchToProps`，它们定义了 UI 组件的业务逻辑。前者负责输入逻辑。
`mapStateToProps`将 state 映射到 UI 组件的参数（Props），`mapDispatchToProps`负责输出逻辑，即将用户对 UI 组件的操作映射成 Action，也可以通过`bindActionCreators`方法将`action`的所有方法绑定到props上。

`./containers/App.jsx`

```JavaScript


import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import cityPanelIndex from '../../components/citypanel/index'
import * as ctiyActions from '../../actions/citypanel/actions'

//将state.cityList绑定到props的cityList
function mapStateToProps(state){
    return {
        cityList:state.cityList
    }
}

//将action的所有方法绑定到props上
function mapDispatchToProps(dispatch){
    return bindActionCreators(ctiyActions,dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(cityPanelIndex)


```


## 注册store

将 state 和 action 交给 redux 来管理

`./stores/createStore.jsx`

```JavaScript

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from '../reducers/citypanel'
//applyMiddleware来自redux可以包装 store 的 dispatch
//thunk作用是使action创建函数可以返回一个function代替一个action对象
const createStoreWithMiddleware = applyMiddleware(
  thunk
)(createStore)
export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(reducer, initialState)
  //热替换选项
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers/citypanel', () => {
      const nextReducer = require('../reducers/citypanel')
      store.replaceReducer(nextReducer)
    })
  }
  return store
}

```


## App主文件入口

最终Provider包装主组件（containers）

`Main.jsx`

```JavaScript

/**
 * citypanel主入口
 */
import React from 'react'
import { Provider } from 'react-redux'
import App from '../../containers/citypanel/App'
import configureStore from '../../stores/configureStore'
const store = configureStore()
export default () => {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    )
}

```


一个react + redux 应用完成了

演示：http://giscafer.com/react-demo-list/#/citypanel

源码：https://github.com/giscafer/react-demo-list



（完）

---

*参考链接*

- http://www.jianshu.com/p/a83a99f68b5d
- https://lewis617.github.io/2016/01/19/r2-counter/
- http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_three_react-redux.html

