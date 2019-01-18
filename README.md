# 虚拟数字键盘 #

----------
## 背景 ##
移动端的浏览器中，input元素的自动聚焦并弹起系统键盘很难做到统一，一是IOS系统下的浏览器，非真实的用户交互，是无法弹起系统键盘的，通过js模拟也不行。二是某些浏览器下，input的输入光标会没有，使得用户体验不佳。
## 目标 ##
1、进入页面时就自动聚焦到input上，并弹出数字键盘。

2、input输入带光标

3、一些额外的校验逻辑

4、提供通用的配置入口
## 实现方案 ##
1、虚拟的数字键盘

2、虚拟的input

## 使用方式 ##
1、提供input容器

`<div id='input_container'></div>`

2、使用示例

`/**`  
`* 确认按钮点击回调函数`  
`*/`  
`function callBack(value){`  
`console.log('value='+value);`  
`}` 
  
`var option = {`  
       ` "integerLimit":6,`  // 整数部分长度  
        `"fractionLimit":2,` // 小数部分长度   
        `"fontSize":'24px',`  
        `"mobile":false,`  // 是否移动端  
        `"callBack":callBack`  
    `};`

`inputPlugin = new Input("input_container");`  
`keyboardPlugin =  new KeyBoard(inputPlugin,option);`

3、效果图
![](https://i.imgur.com/BTUuuWC.jpg)
