/**
 * 虚拟input插件，带光标！
 * 请搭配自己研发的keyboard插件使用。
 * @author gameloft9 2018-11-28
 * */
;(function(exports){
    var Input = function(container_id, options){
        var _option = { //配置
            width: "",
            height: "", // input 高度
            cursorHeight:"", // 光标高度
            lineHeight:"", //行高，最好与fontSize一样
            fontSize: "",
            backgroundColor: ""
        };

        this.el = document.createElement('div');
        var self = this; // 保存this指针
        self.readOnly = false; // 只读

        var intervalId; // icon闪动函数id，后面设置只读时用


        // 设置光标定时任务,500ms闪动
        function setCursorFlash() {
            var isShowCursor = true;
            intervalId = setInterval(function() {
                isShowCursor = !isShowCursor;
                if (isShowCursor) {
                   showIcon();
                } else {
                    hideIcon();
                }
            }, 500);
        }

        // 隐藏光标
        function hideIcon() {
            var cursor = document.getElementsByClassName('input_cursor')[0];

            cursor.className = 'input_cursor hidden';
        }

        // 显示光标
        function showIcon() {
            var cursor = document.getElementsByClassName('input_cursor')[0];

            cursor.className = 'input_cursor';
        }

        // 移除光标
        function removeIcon(){
            var cursor = document.getElementsByClassName('input_cursor')[0];

            cursor.className = 'input_cursor display_none';
        }

        // 设置参数
        (function setOptions(options){
            _option.width = options && options.width || '100%';
            _option.height = options && options.height || '40px';
            _option.lineHeight = options && options.lineHeight || '40px';
            _option.fontSize = options && options.fontSize || '28px';
            _option.cursorHeight = options && options.cursorHeight || '28px';
            _option.backgroundColor = options && options.backgroundColor || '#fff';

            self.el.style.fontSize = _option.fontSize;
            self.el.style.backgroundColor = _option.backgroundColor;
        })();

        // 创建虚拟Input
        (function createElement() {
            //样式
            var cssStr = '<style type="text/css">';
            cssStr += '#'+container_id+' .input_area{display: -webkit-box;display: -moz-box;display: -ms-flexbox;display: -webkit-flex;display:flex;justify-content:flex-end;align-items:center;width:100%;outline:none;height:' +_option.height+';width:' + _option.width + ';line-height:'+ _option.lineHeight +';}';
            cssStr += '#'+container_id+' .input_rmb{}';
            cssStr += '#'+container_id+' .input_value{}';
            cssStr += '#'+container_id+' .input_cursor{width:2px;background-color: #1D8FEE;margin: 0 1px 0 1px;height:' + _option.cursorHeight +';line-height:'+ _option.lineHeight +';}';
            cssStr += '#'+container_id+' .hidden{visibility:hidden;}';
            cssStr += '#'+container_id+' .display_none{display:none;}';
            cssStr += '</style>';

            //virtual input dom
            var inputStr = '<div class="input_container">';
            inputStr += '<div class="input_area">';
            inputStr += '<span class="input_rmb">￥</span>';
            inputStr += '<span class="input_value"></span>';
            inputStr += '<span class="input_cursor"></span>';
            inputStr += '</div>';
            inputStr += '</div>';

            self.el.innerHTML = cssStr + inputStr;
            var container = document.getElementById(container_id);

            container.appendChild(self.el);

            //设置光标定时任务,500ms闪动
            setCursorFlash();
        })();

        // 添加方法
        /**获取或设置值*/
        self.value = function (value) {
            var input = document.querySelector('#' + container_id +' .input_container div .input_value');
            if(typeof(value) === 'undefined'){
                return input.innerText;
            }

            if(!self.readOnly){
                input.innerText = value;
            }
        };

        /**禁用or启用只读效果*/
        self.setReadOnly = function (readOnly) {
            self.readOnly = !!readOnly;

            if(self.readOnly){
                clearInterval(intervalId);
                removeIcon();
            }else{
                setCursorFlash();
            }
        }
    };

    exports.Input = Input;

})(window);