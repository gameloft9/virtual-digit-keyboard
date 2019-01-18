/**
 * 虚拟数字键盘插件,需要搭配自己研发的input插件使用！
 * 手机端点击300ms延迟问题，请搭配fastclick库来解决，这里就不单独解决了。
 * 配置参数如下：
 * {
     id:"",
     width:"",
     height:"",
     integerLimit:"", // 整数部分长度限制
     fractionLimit:"",// 小数部分长度限制
     zIndex:"",
     fontSize:"",
     backgroundColor:"",
     tableId:"",
     mobile:"" // 是否手机端(针对Hover的CSS效果实现不同)
   }
 * @author gameloft9 2018-11-28
 * blog:https://blog.csdn.net/gameloft9
 * */
;(function (exports) {
    var KeyBoard = function (input, options) {
        var _option = { //配置
            id: "",
            width: "",
            height: "", //键盘高度，单位px
            integerLimit: "",
            fractionLimit: "",
            zIndex: "",
            fontSize: "",
            backgroundColor: "",
            tableId: "",
            mobile: "",//是否手机端
            callBack:""
        };
        var _confirmBtnDisabled = false; // 是否禁用确认按钮
        var self = this; // 保存下this指
        self.input = input; //将Input对象挂载到keyboard下，方便访问

        // 设置参数
        (function setOptions(options) {
            _option.id = options && options.id || 'csdn_gameloft9_leiyao_div_id';
            _option.fractionLimit = options && options.fractionLimit || 2; // 限制小数位数
            _option.integerLimit = options && options.integerLimit || 8; // 限制小数位数
            _option.zIndex = options && options.zIndex || 1000;
            _option.width = options && options.width || '100%';
            _option.height = options && options.height || 210;
            _option.fontSize = options && options.fontSize || '20px';
            _option.backgroundColor = options && options.backgroundColor || '#fff';
            _option.tableId = 'csdn_gameloft9_leiyao_'+(options && options.tableId || 'table_id'); // 加个前缀，方便后面做媒体查询
            _option.mobile = options && options.mobile;
            _option.callBack = options && options.callBack || (function(){});

            self.el = document.createElement('div');
            self.el.id = _option.id;
            self.el.style.position = 'fixed';
            self.el.style.left = 0;
            self.el.style.right = 0;
            self.el.style.bottom = 0;
            self.el.style.zIndex = _option.zIndex;
            self.el.style.width = _option.width;
            //self.el.style.height = (_option.height) + 'px'; // 这里不用设置，直接高度设置到table即可。
            self.el.style.backgroundColor = _option.backgroundColor;

            self.callBack = _option.callBack;
        })(options);

        /**
         * 是否是数字，仅作简单检查
         * @param str
         * @returns {boolean}
         */
        function isNumber(str){
            var pattern = /^\d+$|^\d+\.\d+$/;
            return pattern.test(str);
        }

        /**
         * 是否是确认支付按钮(包括点击td，及其包裹的div)
         * @param element dom元素
         * */
        function isConfirmBtn(element) {
            return (element.tagName.toLocaleLowerCase() === 'td' && element.classList.contains('confirm_container')) ||
                (element.tagName.toLocaleLowerCase() === 'div' && element.classList.contains('confirm_vertical'));
        }

        /**
         * 是否是回退按钮
         * @param element dom元素
         * */
        function isBackBtn(element) {
            return (element.tagName.toLocaleLowerCase() === 'div' && element.classList.contains("img_cancel"));
        }

        /**
         * 是否是小数点
         * @param element dom元素
         * */
        function isDotBtn(element) {
            var value = element.textContent || element.innerText; // 获取值
            return (element.tagName.toLocaleLowerCase() === 'td' && value === ".");
        }

        // 开始悬停效果
        function startHover(e) {
            var ev = e || window.event;
            var clickEl = ev.element || ev.target;

            // 确认按钮要特殊点，是td包裹div
            if (clickEl.tagName.toLocaleLowerCase() === 'div' &&
                clickEl.classList.contains('confirm_vertical')) { // 如果是点击确认div，则处理其父td的hover效果
                if(!_confirmBtnDisabled){ // 启用时，才处理hover效果
                    var confirmContainer = document.querySelector('#' + _option.tableId + ' .confirm_container');
                    confirmContainer.style.backgroundColor = "#2db4FF";
                }

                return;
            }

            clickEl.classList.remove("stop_hover");
            clickEl.classList.add("start_hover");
        }

        // 停止悬停效果
        function stopHover(e) {
            var ev = e || window.event;
            var clickEl = ev.element || ev.target;

            // 确认按钮要特殊点，是td包裹div
            if (clickEl.tagName.toLocaleLowerCase() === 'div' &&
                clickEl.classList.contains('confirm_vertical')) { // 如果是点击确认div，则实际上要处理其父td的hover效果
                if(!_confirmBtnDisabled){ // 启用时，才处理hover效果
                    var confirmContainer = document.querySelector('#' + _option.tableId + ' .confirm_container');
                    confirmContainer.style.backgroundColor = "#2DBBFD";
                }

                return;
            }

            clickEl.classList.remove("start_hover");
            clickEl.classList.add("stop_hover");
        }

        // 事件处理
        function addEvent(e) {
			  if (_option.mobile) {
				  stopHover(e); // 处理悬停
			  }         

            var ev = e || window.event;
            var clickEl = ev.element || ev.target;
            var value = clickEl.textContent || clickEl.innerText; // 获取值

            if (isConfirmBtn(clickEl)) {// 确认按钮
                input.value(input.value().replace(/\.$/g, ""));

                // 回调函数
                if (!_confirmBtnDisabled) {
                    self.callBack(input.value());
                }
            } else if (isBackBtn(clickEl)) { // 回退
                var num = input.value();

                if (num) {
                    var newNum = num.substr(0, num.length - 1);
                    input.value(newNum)
                }
            } else if (clickEl.tagName.toLocaleLowerCase() === 'td') { // 数字键和.
                if (self.input) {
                    if (isDotBtn(clickEl) && _option.fractionLimit <= 0) {// 小数位数限制0或者负数则不允许键入.
                        input.value(input.value());
                    } else {
                        var str = clearNoNum(input.value() + value); //先控制格式
                        input.value(str)
                    }
                }
            }

            // 处理支付按钮激活，必须是数字而且不等于0
            if(isNumber(input.value()) && parseFloat(input.value()) !== 0){
                self.setConfirmBtnEnable();
            }else{
                self.setConfirmBtnDisable();
            }
        }

        //控制输入框中的格式
        function clearNoNum(str) {
            str = str.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
            str = str.replace(/^\./g, "0."); //验证第一个字符是数字而不是.
            str = str.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的.
            str = str.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");

            if (str.indexOf(".") < 0 && str !== "") {//如果没有小数点则：
                str = parseFloat(str); //1-首位不能为类似于 01、02的金额
                str = str.toString().substr(0, _option.integerLimit); // 2-整数长度不能超过多少位
            }

            if (str.indexOf(".") >= 0) {//判断是否有小数点
                if (str.split(".")[1].length > _option.fractionLimit) {//控制只能输入小数点后2位
                    str = str.substr(0, str.length - 1);
                }
            }

            return str;
        }

        // 初始化虚拟键盘dom
        (function createElement() {
            var body = document.getElementsByTagName('body')[0];
            if (document.getElementById(_option.id)) { // 如果有键盘，则先删掉
                body.removeChild(document.getElementById(_option.id));
            }

            //样式
            var cssStr = '<style type="text/css">';
            cssStr += '.start_hover{background-color:#dddddd;}';
            cssStr += '.stop_hover{background-color:#FFF;}';
            cssStr += '#' + _option.tableId + '{text-align:center;width:100%;line-height:50px;border-top:1px solid #CECDCE;background-color:#FFF;height:' + _option.height + 'px' + ';}';
            cssStr += '#' + _option.tableId + ' td{width:25%;border:1px solid #ddd;border-right:0;border-top:0;font-size:'+ _option.fontSize + ';}';
            if (!_option.mobile) { // PC端可以直接使用hover处理悬停变色
                cssStr += '#' + _option.tableId + ' td:hover{background-color:#1FB9FF;color:#FFF;}';
            }
			cssStr += '#' + _option.tableId + ' .confirm_container{background-color:#B9D9F8}';
            cssStr += '#' + _option.tableId + ' .confirm_vertical{margin:0 auto;width:40px;line-height:24px;font-size:20px;}';
            cssStr +=  '#' + _option.tableId + ' .img_cancel{width: 100%;height: 100%; background-position: 50% 50%;background-size: 30px 20px;background-repeat: no-repeat;margin: auto;background-image:url("data:image/png;base64,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");}';
            cssStr += '@media only screen and (max-device-height:568px){ #'+ _option.tableId +'{height: 150px !important;font-size: 16px !important;line-height: 18px !important;}}'; // 针对小屏手机做适配
            cssStr += '</style>';

            //数字键盘
            var tableStr = '<table id=' + _option.tableId + '  border="0" cellspacing="0" cellpadding="0">';
            tableStr += '<tr><td>1</td><td>2</td><td>3</td><td><div class="img_cancel"></div></td></tr>';
            tableStr += '<tr><td>4</td><td>5</td><td>6</td><td class="confirm_container" rowspan="3"><div class="confirm_vertical">确认支付</div></td></tr>';
            tableStr += '<tr><td>7</td><td>8</td><td>9</td></tr>';
            tableStr += '<tr><td colspan="2">0</td><td>.</td></tr>';
            tableStr += '</table>';
            self.el.innerHTML = cssStr + tableStr;

            // 绑定点击事件
            if (_option.mobile) {
                self.el.ontouchstart = startHover;
                self.el.ontouchend = addEvent; // 处理悬停
            } else {
                self.el.onclick = addEvent;
            }

            body.appendChild(self.el);
        })();

        //添加方法
        /**起用确认按钮*/
        self.setConfirmBtnEnable = function () {
            var confirmContainer = document.querySelector('#' + _option.tableId + ' .confirm_container');
            confirmContainer.style.backgroundColor = "#2DBBFD";
            _confirmBtnDisabled = false; /**#2DBBFD  #007FFF*/
        };

        /**禁用确认按钮*/
        self.setConfirmBtnDisable = function () {
            var confirmContainer = document.querySelector('#' + _option.tableId + ' .confirm_container');
            confirmContainer.style.backgroundColor = "#B9D9F8";
            _confirmBtnDisabled = true;
        };

        /**设置回调*/
        self.setCallBack = function (callBack) {
            self.callBack = callBack;
        };

        // 关闭键盘
        self.close = function(){
            self.el.style.display = 'none';
        };

        // 打开键盘
        self.open = function(){
            self.el.style.display = 'block';
        };

        // 获取设置
        self.option = function(option){
           return _option;
        };

    };

    exports.KeyBoard = KeyBoard;

})(window);