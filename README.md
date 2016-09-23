# matrixLock

## github地址：https://github.com/tuxingsheng/matrixLock.git
## 在线地址：https://tuxingsheng.github.io/matrixLock/

###配置参数说明
```javascript
this.defaults = {
    el: '#lock',
    style: {
         // 圆的半径
         r: 24,
         // canvas的宽度
         w: 320,
         // canvas的高度
         h: 320,
         // 圆与圆之间的间隔X
         offsetX: 30,
         // 圆与圆之间的间隔Y
         offsetY: 30,
         // 连接线的粗细
         lineWidth: 10,
         // 填充颜色
         fill: '#fff',
         // 圆圈的颜色
         color: '#627eed'
    },
    callback: function (data) {
        // 返回数组类型的选中列表，如：[0,5,8,7]
        console.log(data);
    }
};