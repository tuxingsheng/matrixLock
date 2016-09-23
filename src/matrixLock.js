'use strict';

(function () {

    var util = {
        /*
         * @name extend
         * @type function
         * @explain 复制对象
         * */
        extend: function (to, from) {
            var keys = Object.keys(from);
            var i = keys.length;
            while (i--) {
                if (typeof from[keys[i]] == 'object') {
                    util.extend(to[keys[i]], from[keys[i]])
                } else {
                    to[keys[i]] = from[keys[i]];
                }

            }
            return to;
        }
    };

    function MatrixLock(options) {

        options = options || {};

        /*
         * 默认配置
         * */
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
            callback: function () {

            }
        };

        this.defaults = util.extend(this.defaults, options);

        this.PointLocationArr = [];

        this.init();
    }

    MatrixLock.prototype.init = function () {
        var s = this.defaults.style;
        this.lock = typeof this.defaults.el == 'string' ? document.querySelector(this.defaults.el) : this.defaults.el;
        this.lock.width = s.w;
        this.lock.height = s.h;
        this.lockCxt = this.lock.getContext('2d');
        this.clear();
    };

    MatrixLock.prototype.clear = function () {
        var s = this.defaults.style;
        var X = (s.w - 2 * s.offsetX - s.r * 2 * 3) / 2;
        var Y = (s.h - 2 * s.offsetY - s.r * 2 * 3) / 2;
        this.PointLocationArr = this.caculateNinePointLotion(X, Y);
        this.lockCxt.clearRect(0, 0, s.w, s.h);
        this.initEvent(this.lock, this.lockCxt);
        this.draw(this.lockCxt, this.PointLocationArr, [], null);
    };

    MatrixLock.prototype.initEvent = function (canvasContainer, cxt) {
        var linePoint = [], self = this, s = this.defaults.style;
        canvasContainer.addEventListener('touchstart', function (e) {
            self.isPointSelect(e.touches[0], linePoint);
        }, false);
        canvasContainer.addEventListener('touchmove', function (e) {
            e.preventDefault();
            var touches = e.touches[0];
            self.isPointSelect(touches, linePoint);
            cxt.clearRect(0, 0, s.w, s.h);
            self.draw(cxt, self.PointLocationArr, linePoint, {X: touches.pageX, Y: touches.pageY});
        }, false);
        canvasContainer.addEventListener('touchend', function (e) {
            cxt.clearRect(0, 0, s.w, s.h);
            self.draw(cxt, self.PointLocationArr, linePoint, null);
            self.defaults.callback.call(self, linePoint);
            linePoint = [];
        }, false);
    };

    MatrixLock.prototype.isPointSelect = function (touches, linePoint) {
        var s = this.defaults.style;
        for (var i = 0; i < this.PointLocationArr.length; i++) {
            var currentPoint = this.PointLocationArr[i];
            var diffX = Math.abs(currentPoint.X - touches.pageX);
            var diffY = Math.abs(currentPoint.Y - touches.pageY);
            var dir = Math.pow((diffX * diffX + diffY * diffY), 0.5);
            if (dir < s.r) {
                if (linePoint.indexOf(i) < 0) {
                    linePoint.push(i);
                }
                break;
            }
        }
    };

    MatrixLock.prototype.caculateNinePointLotion = function (diffX, diffY) {
        var Re = [];
        for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 3; col++) {
                var Point = {
                    X: (this.defaults.style.offsetX + col * diffX + ( col * 2 + 1) * this.defaults.style.r),
                    Y: (this.defaults.style.offsetY + row * diffY + (row * 2 + 1) * this.defaults.style.r)
                };
                Re.push(Point);
            }
        }
        return Re;
    };

    MatrixLock.prototype.draw = function (cxt, _PointLocationArr, _LinePointArr, touchPoint) {
        var s = this.defaults.style;
        if (_LinePointArr.length > 0) {
            cxt.beginPath();
            for (var i = 0; i < _LinePointArr.length; i++) {
                var pointIndex = _LinePointArr[i];
                cxt.lineTo(_PointLocationArr[pointIndex].X, _PointLocationArr[pointIndex].Y);
            }
            cxt.lineWidth = s.lineWidth;
            cxt.strokeStyle = s.color;
            cxt.stroke();
            cxt.closePath();
            if (touchPoint != null) {
                var lastPointIndex = _LinePointArr[_LinePointArr.length - 1];
                var lastPoint = _PointLocationArr[lastPointIndex];
                cxt.beginPath();
                cxt.moveTo(lastPoint.X, lastPoint.Y);
                cxt.lineTo(touchPoint.X, touchPoint.Y);
                cxt.stroke();
                cxt.closePath();
            }
        }
        for (var k = 0; k < _PointLocationArr.length; k++) {
            var Point = _PointLocationArr[k];
            cxt.fillStyle = s.color;
            cxt.beginPath();
            cxt.arc(Point.X, Point.Y, s.r, 0, Math.PI * 2, true);
            cxt.closePath();
            cxt.fill();
            cxt.fillStyle = s.fill;
            cxt.beginPath();
            cxt.arc(Point.X, Point.Y, s.r - 3, 0, Math.PI * 2, true);
            cxt.closePath();
            cxt.fill();
            if (_LinePointArr.indexOf(k) >= 0) {
                cxt.fillStyle = s.color;
                cxt.beginPath();
                cxt.arc(Point.X, Point.Y, s.r - 16, 0, Math.PI * 2, true);
                cxt.closePath();
                cxt.fill();
            }

        }
    };

    if (typeof exports === 'object') module.exports = MatrixLock;
    else if (typeof define === 'function' && define.amd) define([], function () {
        return MatrixLock;
    });
    else window.MatrixLock = MatrixLock;
})();

