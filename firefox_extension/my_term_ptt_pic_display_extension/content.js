// 程式碼開始~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~!!
function run_3wa_term_ptt_cc() {
    if (location.href.indexOf("https://term.ptt.cc/") == -1 && location.href.indexOf("https://www.ptt.cc/") == -1) {

        return; //只有在 term.ptt.cc 或 www.ptt.cc 才有效
    }
    if (window['isRun_3wa_term_ptt_cc'] != null) {
        return;
    }
    //只能在 term.ptt.cc 的網站運行
    window['isRun_3wa_term_ptt_cc'] = "YES...loaded";
    var previewRace = typeof window['myTermPttPreviewRace'] === "function"
        ? window['myTermPttPreviewRace']()
        : null;
    function strpos(haystack, needle, offset) { var i = (haystack + '').indexOf(needle, (offset || 0)); return i === -1 ? false : i; }
    function substr(str, start, len) { var i = 0, allBMP = true, es = 0, el = 0, se = 0, ret = ''; str += ''; var end = str.length; this.php_js = this.php_js || {}; this.php_js.ini = this.php_js.ini || {}; switch ((this.php_js.ini['unicode.semantics'] && this.php_js.ini['unicode.semantics'].local_value.toLowerCase())) { case 'on': for (i = 0; i < str.length; i++) { if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i + 1))) { allBMP = false; break; } } if (!allBMP) { if (start < 0) { for (i = end - 1, es = (start += end); i >= es; i--) { if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i - 1))) { start--; es--; } } } else { var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g; while ((surrogatePairs.exec(str)) != null) { var li = surrogatePairs.lastIndex; if (li - 2 < start) { start++; } else { break; } } } if (start >= end || start < 0) { return false; } if (len < 0) { for (i = end - 1, el = (end += len); i >= el; i--) { if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i - 1))) { end--; el--; } } if (start > end) { return false; } return str.slice(start, end); } else { se = start + len; for (i = start; i < se; i++) { ret += str.charAt(i); if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i + 1))) { se++; } } return ret; } break; } case 'off': default: if (start < 0) { start += end; } end = typeof len === 'undefined' ? end : (len < 0 ? len + end : len + start); return start >= str.length || start < 0 || start > end ? !1 : str.slice(start, end); } return undefined; }
    function strlen(string) { var str = string + ''; var i = 0, chr = '', lgth = 0; if (!this.php_js || !this.php_js.ini || !this.php_js.ini['unicode.semantics'] || this.php_js.ini['unicode.semantics'].local_value.toLowerCase() !== 'on') { return string.length; } var getWholeChar = function (str, i) { var code = str.charCodeAt(i); var next = '', prev = ''; if (0xD800 <= code && code <= 0xDBFF) { if (str.length <= (i + 1)) { throw 'High surrogate without following low surrogate'; } next = str.charCodeAt(i + 1); if (0xDC00 > next || next > 0xDFFF) { throw 'High surrogate without following low surrogate'; } return str.charAt(i) + str.charAt(i + 1); } else if (0xDC00 <= code && code <= 0xDFFF) { if (i === 0) { throw 'Low surrogate without preceding high surrogate'; } prev = str.charCodeAt(i - 1); if (0xD800 > prev || prev > 0xDBFF) { throw 'Low surrogate without preceding high surrogate'; } return false; } return str.charAt(i); }; for (i = 0, lgth = 0; i < str.length; i++) { if ((chr = getWholeChar(str, i)) === false) { continue; } lgth++; } return lgth; }
    var appClass = {
        //debug_mode: true, //怪怪的，先不要
        appVersion: "0.3.6",
        icon: {
            "loading": chrome.runtime.getURL("assets/loading.gif"),
            "3wa_logo": chrome.runtime.getURL("assets/3wa_logo.png"),
            "x_close": chrome.runtime.getURL("assets/x_close.png"),
            "settings": chrome.runtime.getURL("assets/settings.png"),
            "link64": chrome.runtime.getURL("assets/link64.png")
        },
        method: {
            "toEmbedURL": function (youtubeUrl) {
                const url = new window.URL(youtubeUrl);
                let videoId = '';

                // 處理 https://www.youtube.com/watch?v=... 形式
                if (url.hostname.includes('youtube.com') && url.pathname === '/watch') {
                    videoId = url.searchParams.get('v');
                }

                // 處理 https://youtu.be/... 形式
                else if (url.hostname === 'youtu.be') {
                    videoId = url.pathname.slice(1);
                }

                if (!videoId) return null;

                // 可選：處理開始時間（例如 t=60s → start=60）
                const startTime = url.searchParams.get('t');
                const startParam = startTime ? `?start=${this.parseTime(startTime)}` : '';

                return `https://www.youtube.com/embed/${videoId}${startParam}`;
            },
            // 可選：處理時間格式 1m20s 或 90s
            "parseTime": function (t) {
                if (!isNaN(t)) return parseInt(t); // 僅數字
                const match = t.match(/(?:(\d+)m)?(?:(\d+)s)?/);
                if (!match) return 0;
                const minutes = parseInt(match[1]) || 0;
                const seconds = parseInt(match[2]) || 0;
                return minutes * 60 + seconds;
            },
            "app_getSettings": function () {
                var k = this.getMemory("my_term_ptt_pic_display_extension");
                if (k == null) {
                    return window['my_3wa_func'].items.settings;
                }
                var s = JSON.parse(k);
                for (var k in s) {
                    if (typeof (s[k]) == "object") {
                        window['my_3wa_func'].items.settings[k] = $.extend({}, true, s[k]);
                    }
                    else if (typeof (s[k]) == "string") {
                        window['my_3wa_func'].items.settings[k] = s[k];
                    }
                    else {
                        // array
                        window['my_3wa_func'].items.settings[k] = $.extend([], true, s[k]);
                    }
                }
                return window['my_3wa_func'].items.settings;
            },
            "app_setSettings": function () {
                // 將設定存入記憶體
                this.setMemory("my_term_ptt_pic_display_extension", JSON.stringify(window['my_3wa_func'].items.settings));
            },
            "app_init_settings_UI": function () {
                // 初始化設定介面
                clearInterval(window['my_3wa_func'].interval['my_term_ptt_pic_display_extension_settings']);
                $("div[reqc='my_term_ptt_pic_display_extension_settings']").remove();
                $("img[reqc='imgSettings']").remove();
                $("body").append(`
                <img src="${window['my_3wa_func'].icon["settings"]}" class="imgSettingClass" reqc="imgSettings" title="功能設定" alt="功能設定">
                <div reqc="my_term_ptt_pic_display_extension_settings" class="divSettingController _hide">
                    <img src="${window['my_3wa_func'].icon["x_close"]}" class="imgCloseClass" reqc="imgXClose" title="關閉" alt="關閉">
                    <h3 class="settings_title">
                        <img src="${window['my_3wa_func'].icon["3wa_logo"]}" class="imgLogoClass">PTT 圖片顯示擴充功能
                    </h3>
                    <div reqc="divtabs">
                        <ul>
                            <li><a href="#div_setting_1">term.ptt.cc 設定</a></li>
                            <li><a href="#div_setting_2" req_preclick="YES">www.ptt.cc 設定</a></li>
                            <li><a href="#div_setting_last">注意事項</a></li>
                        </ul>
                        <div id="div_setting_1">
                            <!--term.ptt.cc 設定-->
                            暫無設定需求
                            <table class="thetable" style="display:none;">
                                <tr>
                                    <td field="f1">
                                        <input type="checkbox" req_field="term_ptt_cc_pic_delay_hide" class="chkInput">
                                    </td>
                                    <td field="f2">
                                        延遲隱藏圖片(方便右鍵另存圖片)
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div id="div_setting_2">
                            <!--www.ptt.cc 設定-->
                            <table class="thetable">
                                <tr>
                                    <td field="f1">
                                        <input type="checkbox" req_field="www_ptt_cc_pic_force_display" class="chkInput">
                                    </td>
                                    <td field="f2">
                                        直接插入圖片至網址前端，無需點擊圖片連結
                                    </td>
                                </tr>
                                <tr style="display:none;">
                                    <td field="f1">
                                        <input type="checkbox" req_field="www_ptt_cc_pic_delay_hide" class="chkInput">
                                    </td>
                                    <td field="f2">
                                        延遲隱藏圖片(方便右鍵另存圖片)
                                    </td>                                
                                </tr>
                            </table>
                        </div>
                        <div id="div_setting_last">                            
                            作者：羽山 ( <a target="_blank" href="https://3wa.tw">https://3wa.tw</a> )<br>
                            <br>
                            版本：${window['my_3wa_func']['appVersion']}<br>                            
                            <br>
                            暫時也不知道要注意什麼，先這樣吧！<br>
                        </div>
                    </div>

                    <style nonce="gg">
                        .imgSettingClass{
                            position:fixed;
                            right:10px;
                            top:10px;
                            z-index:99;
                            margin:50px;
                            background:none;
                            cursor:pointer;
                        }
                        .divSettingController{
                            background-color: rgba(0,0,0.95);                            
                            position: absolute;
                            width: 400px;
                            height: auto;
                            color: #fff;
                        }
                        .divSettingController h3{
                            text-align: center;
                        }
                        ._hide{
                            display: none;
                        }
                        .divSettingController .imgLogoClass{
                            width: 36px;
                            height: 36px;
                            border: 0px;
                            background: none;
                        }
                        .divSettingController .chkInput{
                            width:35px;
                            height:35px;
                        }
                        .divSettingController .thetable td{
                            padding:5px;
                            font-size:18px;
                            color: #fff;
                        }
                        .divSettingController .thetable td[field='f1']{
                            width:35px;
                            text-align: center;
                        }
                        .divSettingController .thetable td[field='f2']{
                            text-align: left;
                        }
                        .divSettingController .imgCloseClass{                            
                            position: absolute;
                            cursor: pointer;
                            right: 0px;
                            top: 0px;
                            width: 36px;
                            height: 36px;
                            border: 0px;
                            background: none;
                        }
                    </style>
                </div>
                `);

                        // 載入預設值
                        $("input[req_field='www_ptt_cc_pic_force_display']").prop("checked", window['my_3wa_func'].items.settings['www_ptt_cc_pic_force_display'] == "YES" ? true : false);
                        $("input[req_field='term_ptt_cc_pic_delay_hide']").prop("checked", window['my_3wa_func'].items.settings['term_ptt_cc_pic_delay_hide'] == "YES" ? true : false);
                        $("input[req_field='www_ptt_cc_pic_delay_hide']").prop("checked", window['my_3wa_func'].items.settings['www_ptt_cc_pic_delay_hide'] == "YES" ? true : false);
                        // 當勾選時，儲存設定
                        $("input[req_field='www_ptt_cc_pic_force_display']").off().on("change", function () {
                            if ($(this).is(":checked")) {
                                $("span[reqc='spantheimg']").remove();
                                $("a").removeAttr('my_3wa_term_ptt_cc_ischeckimg');                                                                
                                window['my_3wa_func'].items.settings['www_ptt_cc_pic_force_display'] = "YES";
                            } else {
                                window['my_3wa_func'].items.settings['www_ptt_cc_pic_force_display'] = "NO";
                                $("span[reqc='spantheimg']").remove();
                                $("img[loading='lazy']").remove();
                            }
                            // 儲存設定
                            window['my_3wa_func'].method.app_setSettings();
                        });
                        $("input[req_field='term_ptt_cc_pic_delay_hide']").off().on("change", function () {
                            if ($(this).is(":checked")) {
                                window['my_3wa_func'].items.settings['term_ptt_cc_pic_delay_hide'] = "YES";
                            }
                            else{
                                window['my_3wa_func'].items.settings['term_ptt_cc_pic_delay_hide'] = "NO";
                            }
                        });
                        $("input[req_field='www_ptt_cc_pic_delay_hide']").off().on("change", function () {
                            if ($(this).is(":checked")) {
                                window['my_3wa_func'].items.settings['www_ptt_cc_pic_delay_hide'] = "YES";
                            }
                            else{
                                window['my_3wa_func'].items.settings['www_ptt_cc_pic_delay_hide'] = "NO";
                            }
                        });

                        window['my_3wa_func'].method.mytabs($("div[reqc='divtabs']"),{
                            head_li_focus_css: {
                                'background-color': '#77ff77',
                                'font-weight': 'bold'
                            },
                            head_li_css: {
                                'background-color': '#eeeeee',
                                'font-weight': 'normal'
                            },
                            head_a_css: {
                             color: '#000'
                            },
                            content_css: {
                                /*color:'red'*/
                                /*border:'0px' */
                            },
                            show: "#div_setting_2"
                        });                        
                        
                        // 置中、置上、上移                        
                        $("div[reqc='my_term_ptt_pic_display_extension_settings']").css({
                            'position': 'fixed',
                            'background-color': 'rgba(0,0,0.95)',
                            'border': '1px solid rgba(0,244,255)',
                            'border-radius': '10px',
                            'padding': '15px',
                            'right': '2%',
                            'top': '10%',
                            'z-index': 999
                        });
                        // 按到 x
                        $("img[reqc='imgXClose']").off().on("click", function () {
                            $("div[reqc='my_term_ptt_pic_display_extension_settings']").fadeOut();
                        });

                        // 設定按鈕自行隱藏，滑鼠移過去又顯示
                        $("img[reqc='imgSettings']").off().on("click", function () {
                            $("div[reqc='my_term_ptt_pic_display_extension_settings']").removeClass("_hide").fadeIn();
                        });
                        $("img[reqc='imgSettings']").on("mouseenter mouseleave", function () {
                            clearTimeout(window['my_3wa_func'].interval['my_term_ptt_pic_display_extension_settings_timeout']);
                            $("img[reqc='imgSettings']").stop().animate({
                                'opacity':1
                            },300);
                        });
                        // 滑鼠離開設定按鈕後，2秒後隱藏
                        $("img[reqc='imgSettings']").on("mouseleave", function () {
                            window['my_3wa_func'].interval['my_term_ptt_pic_display_extension_settings_timeout'] = setTimeout(function(){
                                $("img[reqc='imgSettings']").stop().animate({
                                    'opacity':0.01
                                },800);
                            }, 2000);              
                        });
                        
                        window['my_3wa_func'].interval['my_term_ptt_pic_display_extension_settings_timeout'] = setTimeout(function(){
                            $("img[reqc='imgSettings']").stop().animate({
                                'opacity':0.01
                            },800);
                        }, 2000);                        

            },
            "strpos": function (haystack, needle, offset) { var i = (haystack + '').indexOf(needle, (offset || 0)); return i === -1 ? false : i; },
            "substr": function (str, start, len) { var i = 0, allBMP = true, es = 0, el = 0, se = 0, ret = ''; str += ''; var end = str.length; this.php_js = this.php_js || {}; this.php_js.ini = this.php_js.ini || {}; switch ((this.php_js.ini['unicode.semantics'] && this.php_js.ini['unicode.semantics'].local_value.toLowerCase())) { case 'on': for (i = 0; i < str.length; i++) { if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i + 1))) { allBMP = false; break; } } if (!allBMP) { if (start < 0) { for (i = end - 1, es = (start += end); i >= es; i--) { if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i - 1))) { start--; es--; } } } else { var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g; while ((surrogatePairs.exec(str)) != null) { var li = surrogatePairs.lastIndex; if (li - 2 < start) { start++; } else { break; } } } if (start >= end || start < 0) { return false; } if (len < 0) { for (i = end - 1, el = (end += len); i >= el; i--) { if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i - 1))) { end--; el--; } } if (start > end) { return false; } return str.slice(start, end); } else { se = start + len; for (i = start; i < se; i++) { ret += str.charAt(i); if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i + 1))) { se++; } } return ret; } break; } case 'off': default: if (start < 0) { start += end; } end = typeof len === 'undefined' ? end : (len < 0 ? len + end : len + start); return start >= str.length || start < 0 || start > end ? !1 : str.slice(start, end); } return undefined; },
            "strlen": function (string) {
                var str = string + ''; var i = 0, chr = '', lgth = 0; if (!this.php_js || !this.php_js.ini || !this.php_js.ini['unicode.semantics'] || this.php_js.ini['unicode.semantics'].local_value.toLowerCase() !== 'on') { return string.length; } var getWholeChar = function (str, i) { var code = str.charCodeAt(i); var next = '', prev = ''; if (0xD800 <= code && code <= 0xDBFF) { if (str.length <= (i + 1)) { throw 'High surrogate without following low surrogate'; } next = str.charCodeAt(i + 1); if (0xDC00 > next || next > 0xDFFF) { throw 'High surrogate without following low surrogate'; } return str.charAt(i) + str.charAt(i + 1); } else if (0xDC00 <= code && code <= 0xDFFF) { if (i === 0) { throw 'Low surrogate without preceding high surrogate'; } prev = str.charCodeAt(i - 1); if (0xD800 > prev || prev > 0xDBFF) { throw 'Low surrogate without preceding high surrogate'; } return false; } return str.charAt(i); }; for (i = 0, lgth = 0; i < str.length; i++) { if ((chr = getWholeChar(str, i)) === false) { continue; } lgth++; } return lgth;
            },
            "arduino_map": function (x, in_min, in_max, out_min, out_max) {
                //x = 輸入值
                //in 如 0~255
                //out 如 0~1024
                return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
            },
            "get_between": function ($data, $s_begin, $s_end) {
                /*
                  $a = "abcdefg";
                  echo get_between($a, "cde", "g");
                  // get "f"
                */
                $s = $data;
                $start = this.strpos($s, $s_begin);
                $new_s = this.substr($s, $start + this.strlen($s_begin));
                $end = this.strpos($new_s, $s_end);
                return this.substr($s, $start + this.strlen($s_begin), $end);
            },
            "trim": function (data) {
                if (typeof (data) == "string") {
                    return data.replace(/(^\s*)|(\s*$)/g, "");
                }
                else {
                    return data;
                }
            },
            "getWindowSize": function () {
                var myWidth = 0, myHeight = 0;
                if (typeof (window.innerWidth) == 'number') {
                    //Non-IE
                    myWidth = window.innerWidth;
                    myHeight = window.innerHeight;
                } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
                    //IE 6+ in 'standards compliant mode'
                    myWidth = document.documentElement.clientWidth;
                    myHeight = document.documentElement.clientHeight;
                } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
                    //IE 4 compatible
                    myWidth = document.body.clientWidth;
                    myHeight = document.body.clientHeight;
                }
                var a = new Object();
                a['width'] = myWidth;
                a['height'] = myHeight;
                return a;
            }, //取畫面大小            
            "smallComment": function (message, seconds, is_need_motion, cssOptions) {
                //畫面的1/15	
                if ($("#mysmallComment").length == 0) {
                    $("body").append("<div id='mysmallComment'><span class='' id='mysmallCommentContent'></span></div>");
                    $("#mysmallComment").css({
                        'display': 'none',
                        'position': 'fixed',
                        'left': '0px',
                        'right': '0px',
                        'padding': '15px',
                        'bottom': '3em',
                        'z-index': new Date().getTime(),
                        'text-align': 'center',
                        'opacity': 0.8,
                        'pointer-events': 'none'
                    });
                    $("#mysmallCommentContent").css({
                        'color': '#fff',
                        'background-color': '#000',
                        'padding': '10px',
                        'border': '3px solid #fff',
                        'pointer-events': 'none'
                    });
                    $("#mysmallCommentContent").css(cssOptions);
                }
                $("#mysmallCommentContent").html(message);
                if (is_need_motion == true) {
                    //$("#mysmallComment").stop();
                    //$("#mysmallComment").fadeIn("slow");
                    //clearTimeout(window['smallComment_TIMEOUT']);
                    //window['smallComment_TIMEOUT'] = setTimeout(function () {
                    //$("#mysmallComment").fadeOut('fast');
                    //}, seconds);
                }
                else {
                    //$("#mysmallComment").stop();
                    $("#mysmallComment")[0].style.display = "inline";
                    clearTimeout(window['smallComment_TIMEOUT']);
                    window['smallComment_TIMEOUT'] = setTimeout(function () {
                        $("#mysmallComment")[0].style.display = "none";
                    }.bind(this), seconds);
                }
            }, //浮動說明
            "mytabs": function (dom, obj) { //自製的分頁功能
                /*
                  obj.head_css
                  obj.head_li_focus_css
                  obj.content_css
                  obj.show = #div id
                  //example:
              mytabs($("#tabs"),{
                head_li_focus_css:{
                  'background-color':'#77ff77',
                  'font-weight':'bold'
                },
                head_li_css:{
                  'background-color':'#eeeeee',
                  'font-weight':'normal'
                },
                head_a_css:{
                  color:'#000'
                },  content_css:{
                 
                },
                show : "#tabs-1"
              });
                */
                var li_a = dom.find("> ul li a");
                dom.find("> ul li a").css({
                    "text-decoration": "none"
                });
                dom.find("> ul li").css({
                    "display": "inline",
                    "padding": "3px",
                    "border-top": "1px solid #fff",
                    "border-left": "1px solid #fff",
                    "border-right": "1px solid #fff",
                    "border-bottom": "0px",
                    "margin": "0px",
                    "border-radius": "5px 5px 0px 0px"
                });
                if (obj.head_li_css != null) {
                    dom.find("> ul li").css(obj.head_li_css);
                }
                if (obj.head_a_css != null) {
                    dom.find("> ul li a").css(obj.head_a_css);
                }
                if (obj.content_css != null) {
                    for (var i = 0, max_i = li_a.length; i < max_i; i++) {
                        var id = li_a.eq(i).attr('href');
                        dom.find(id).css(obj.content_css);
                    }
                }
                li_a.off("click").on("click", { "dom": dom, "obj": obj }, function (e) {
                    var this_href = $(this).attr('href');
                    var li_a = e.data.dom.find("> ul li a");
                    var mids = new Array();
                    for (var i = 0, max_i = li_a.length; i < max_i; i++) {
                        var id = li_a.eq(i).attr('href');
                        li_a.eq(i).closest("li").css({ 'background-color': 'transparent' });
                        if (e.data.obj.head_li_css != null) {
                            li_a.eq(i).closest("li").css(e.data.obj.head_li_css);
                        }
                        mids.push(id);
                        e.data.dom.find(id).hide();
                    }
                    //li css
                    $(this).closest("li").css({ 'background-color': '#006' });
                    if (e.data.obj.head_li_focus_css != null) {
                        $(this).closest("li").css(e.data.obj.head_li_focus_css);
                    }

                    //e.data.dom.find(this_href).show();
                    // 把所有設成穿透，只有前景不能穿
                    // 似乎是這個原因，害 tabs 裡的 range 都無法順順調整，改成 span 就正常
                    e.data.dom.find("> div").css({
                        'pointer-events': 'none'
                    }).hide();
                    //div css
                    e.data.dom.find(this_href).css({
                        'border': '1px solid #fff',
                        'padding': '10px',
                        'display': 'block',
                        'margin-top': '10px',
                        'pointer-events': 'auto' //不能穿透，任何東西都無法點
                    });
                    return false;
                }); //a click
                if (obj.show != null) {
                    dom.find("> ul li a[href='" + obj.show + "']").trigger("click");
                }
                else {
                    dom.find("> ul li a").eq(0).trigger("click");
                }
            },
            "injectJS": function (fn) {
                //const script = document.createElement('script');
                //script.textContent = `(${fn})();`;
                //(document.head || document.documentElement).appendChild(script);
                //script.remove();
                fn();
            },
            "end": function (arr) {
                this.php_js = this.php_js || {}; this.php_js.pointers = this.php_js.pointers || []; var indexOf = function (value) {
                    for (var i = 0, length = this.length; i < length; i++) { if (this[i] === value) { return i; } }
                    return -1;
                }; var pointers = this.php_js.pointers; if (!pointers.indexOf) { pointers.indexOf = indexOf; }
                if (pointers.indexOf(arr) === -1) { pointers.push(arr, 0); }
                var arrpos = pointers.indexOf(arr); if (!(arr instanceof Array)) {
                    var ct = 0; for (var k in arr) { ct++; var val = arr[k]; }
                    if (ct === 0) { return false; }
                    pointers[arrpos + 1] = ct - 1; return val;
                }
                if (arr.length === 0) { return false; }
                pointers[arrpos + 1] = arr.length - 1; return arr[pointers[arrpos + 1]];
            },
            "basename": function (filepath) {
                var m = filepath.split("/");
                mdata = this.end(m).split("?");
                return mdata[0];
            },
            "mainname": function (filepath) {
                filepath = this.basename(filepath);
                var mdata = filepath.split(".");
                return mdata[0];
            },
            "subname": function (filepath) {
                filepath = this.basename(filepath);
                var m = filepath.split(".");
                return this.end(m);
            },
            "in_array": function (needle, haystack, argStrict) {
                var wtfkey = '', strict = !!argStrict; if (strict) { for (wtfkey in haystack) { if (haystack[wtfkey] === needle) { return true; } } } else { for (wtfkey in haystack) { if (haystack[wtfkey] == needle) { return true; } } }
                return false;
            },
            "str_replace": function (search, replace, subject, count) {
                var i = 0, j = 0, temp = '', repl = '', sl = 0, fl = 0, f = [].concat(search), r = [].concat(replace), s = subject, ra = r instanceof Array, sa = s instanceof Array; s = [].concat(s); if (count) { this.window[count] = 0; }
                for (i = 0, sl = s.length; i < sl; i++) {
                    if (s[i] === '') { continue; }
                    for (j = 0, fl = f.length; j < fl; j++) { temp = s[i] + ''; repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0]; s[i] = (temp).split(f[j]).join(repl); if (count && s[i] !== temp) { this.window[count] += (temp.length - s[i].length) / f[j].length; } }
                }
                return sa ? s : s[0];
            },            
            /*"jsDownload": function (href, displayFilename) {
                const link = document.createElement('a');
                link.target = "_blank";
                link.href = href; // 請替換為你的 檔案連結
                link.download = displayFilename  // 這裡是下載下來的檔案名稱
                link.click();
            },
            */
            "is_string_like": function ($data, $find_string) {
                /*
                  is_string_like($data,$fine_string)
    
                  $mystring = "Hi, this is good!";
                  $searchthis = "%thi% goo%";
    
                  $resp = string_like($mystring,$searchthis);
    
    
                  if ($resp){
                     echo "milike = VERDADERO";
                  } else{
                     echo "milike = FALSO";
                  }
    
                  Will print:
                  milike = VERDADERO
    
                  and so on...
    
                  this is the function:
                */
                $tieneini = 0;
                if ($find_string == "") return 1;
                $vi = $find_string.split("%");
                $offset = 0;
                for ($n = 0, $max_n = $vi.length; $n < $max_n; $n++) {
                    if ($vi[$n] == "") {
                        if ($vi[0] == "") {
                            $tieneini = 1;
                        }
                    } else {
                        $newoff = this.strpos($data, $vi[$n], $offset);
                        if ($newoff !== false) {
                            if (!$tieneini) {
                                if ($offset != $newoff) {
                                    return false;
                                }
                            }
                            if ($n == $max_n - 1) {
                                if ($vi[$n] != this.substr($data, this.strlen($data) - this.strlen($vi[$n]), this.strlen($vi[$n]))) {
                                    return false;
                                }

                            } else {
                                $offset = $newoff + this.strlen($vi[$n]);
                            }
                        } else {
                            return false;
                        }
                    }
                }
                return true;
            },
            "img_mouseover_show": function (dom, options = null) {
                dom.off("mouseout").on("mouseout", function () {
                    $("#show_pic_div_img_mouseover_show").stop().fadeOut();
                });

                //for copy
                dom.off("mousedown").on("mousedown", function () {
                    var o_w = $(this).width();
                    var o_h = $(this).height();
                    if ($(this).attr('bsrc') != null) {
                        $(this).attr('src', $(this).attr('bsrc')).width(o_w).height(o_h);
                    }
                });

                dom.off("mouseover").on("mouseover", { _this: this }, function (e) {
                    window['wh'] = e.data._this.getWindowSize();
                    if ($("#show_pic_div_img_mouseover_show").length == 0) {
                        $("body").append("<div id='show_pic_div_img_mouseover_show'></div>");
                    }
                    if (window['wh']['width'] > window['wh']['height']) {
                        if (parseInt(e.data._this.str_replace("px", "", $(this).css('width'))) > parseInt(e.data._this.str_replace("px", "", $(this).css('height')))) {

                            //console.log('ww1：一般電腦螢幕，橫圖');
                            $("#show_pic_div_img_mouseover_show").css({
                                'position': 'fixed',
                                'pointer-events': 'none',
                                'max-width': (window['wh']['width'] * 80 / 100) + 'px',
                                'max-height': (window['wh']['height'] * 80 / 100) + 'px',
                                'height': (window['wh']['height'] * 80 / 100) + 'px',
                                'background-color': '#dcdcdc',
                                'box-shadow': '1px 1px 10px rgba(0,0,0,0.5)',
                                'z-index': new Date().getTime() * 100,
                                'opacity': 1,
                                'padding': '15px',
                                'display': 'none'
                            });
                        }
                        else {
                            //一般電腦螢幕-直圖
                            //console.log('ww2：一般電腦螢幕，直圖');
                            $("#show_pic_div_img_mouseover_show").css({
                                'position': 'fixed',
                                'pointer-events': 'none',
                                'max-width': (window['wh']['width'] * 80 / 100) + 'px',
                                'max-height': (window['wh']['height'] * 80 / 100) + 'px',
                                'height': (window['wh']['height'] * 80 / 100) + 'px',
                                'background-color': '#dcdcdc',
                                'box-shadow': '1px 1px 10px rgba(0,0,0,0.5)',
                                'z-index': new Date().getTime() * 100,
                                'opacity': 1,
                                'padding': '15px',
                                'display': 'none',
                                'top': (window['wh']['height'] - window['wh']['height'] * 70 / 100) + 'px'
                            });
                        }
                    }
                    else {
                        //手機直螢幕-橫圖
                        if (parseInt(e.data._this.str_replace("px", "", $(this).css('width'))) > parseInt(e.data._this.str_replace("px", "", $(this).css('height')))) {
                            //console.log('ww3：手機直螢幕-橫圖');
                            $("#show_pic_div_img_mouseover_show").css({
                                'position': 'fixed',
                                'pointer-events': 'none',
                                'max-width': (window['wh']['width'] * 80 / 100) + 'px',
                                'max-height': (window['wh']['height'] * 80 / 100) + 'px',
                                'height': (window['wh']['height'] * 80 / 100) + 'px',
                                'background-color': '#dcdcdc',
                                'box-shadow': '1px 1px 10px rgba(0,0,0,0.5)',
                                'z-index': new Date().getTime() * 100,
                                'opacity': 1,
                                'padding': '15px',
                                'display': 'none',
                                'top': (window['wh']['height'] - window['wh']['height'] * 70 / 100) + 'px'
                            });
                        }
                        else {
                            //console.log('ww4：手機直螢幕-直圖');
                            $("#show_pic_div_img_mouseover_show").css({
                                'position': 'fixed',
                                'pointer-events': 'none',
                                'max-width': (window['wh']['width'] * 80 / 100) + 'px',
                                'max-height': (window['wh']['height'] * 80 / 100) + 'px',
                                'background-color': '#dcdcdc',
                                'box-shadow': '1px 1px 10px rgba(0,0,0,0.5)',
                                'z-index': new Date().getTime() * 100,
                                'opacity': 1,
                                'padding': '15px',
                                'display': 'none'
                            });
                        }

                    }
                    //$("#show_pic_div").center();
                    //$("#show_pic_div").corner();
                    var show_url = ($(this).attr('bsrc') != null) ? $(this).attr('bsrc') : $(this).attr('src');
                    var $showDiv = $("#show_pic_div_img_mouseover_show");
                    // 記錄目前要求的圖片，避免較慢完成的舊圖片覆蓋新預覽
                    $showDiv.data('currentSrc', show_url);
                    var Img = new Image();
                    Img.onload = function () {
                        if ($showDiv.data('currentSrc') !== this.src) return;
                        if (options != null) {
                            var w = "100%";
                            var h = "100%";
                            if (options['width'] != null) {
                                w = options['width'];
                            }
                            if (options['height'] != null) {
                                h = options['height'];
                            }
                            $showDiv.css({
                                "width": "auto",
                                "height": "auto"
                            });
                            $showDiv.html("<img src='" + this.src + "' style='pointer-events:none;width:" + w + ";height:" + h + ";'>");
                        }
                        else {
                            $showDiv.html("<img src='" + this.src + "' style='pointer-events:none;width:100%;height:100%;'>");
                        }
                        $showDiv.center();
                        if (this.width > window['wh']['width'] * 80 / 100) {
                            $showDiv.html("<img src='" + this.src + "' style='pointer-events:none;width:" + (window['wh']['width'] * 80 / 100) + "px;height:auto;'>");
                        }
                        if (this.height > window['wh']['height'] * 77 / 100) {
                            $showDiv.html("<img src='" + this.src + "' style='pointer-events:none;width:auto;height:" + (window['wh']['height'] * 77 / 100) + "px;'>");
                        }

                        $showDiv.center();
                    };
                    Img.src = show_url;

                    $showDiv.html("<img src=\"" + show_url + "\" style='pointer-events: none;width:100%;height:100%;'>");
                    $showDiv.stop().fadeIn();
                    $showDiv.center();
                    return true;
                });
            },
            "myW": function (html, func, cssOption) {
                if (typeof (window['myW_t']) == "undefined") {
                    window['myW_t'] = 0;
                }
                $.fn.center = function () {
                    this.css("position", "absolute");
                    this.css("top", ($(window).height() - this.height()) / 2 + $(window).scrollTop() + "px");
                    this.css("left", ($(window).width() - this.width()) / 2 + $(window).scrollLeft() + "px");
                    return this;
                }
                $.fn.centerX = function () {
                    this.css("position", "absolute");
                    this.css("left", ($(window).width() - this.width()) / 2 + $(window).scrollLeft() + "px");
                    return this;
                }
                $.fn.centerY = function () {
                    this.css("position", "absolute");
                    this.css("top", ($(window).height() - this.height()) / 2 + $(window).scrollTop() + "px");
                    return this;
                }
                var t = new Date().getTime() + "_" + window['myW_t']++;
                var id = "myW_" + t;
                $("body").append("<div id='" + id + "'></div>");
                $("#" + id).css({
                    'position': 'absolute',
                    'z-index': new Date().getTime(),
                    'padding': '3px',
                    'background-color': '#fff',
                    'color': 'black',
                    'border': '2px solid #00f'
                });
                if (typeof (cssOption) != "undefined" && typeof (cssOption) == "object") {
                    for (var k in cssOption) {
                        $("#" + id).css(k, cssOption[k]);
                    }
                }
                html = html.replace("{myW_id}", id);
                $("#" + id).html(html);
                $(window).on("scroll", { id: id }, function (event) {
                    $("#" + event.data.id).center();
                });
                $("#" + id).center();
                func(id);
                return id;
            },
            "myDivSliderLeftOn": function (html, callback) {
                $("#divMySliderLeft").remove();
                $("body").append(`<div id='divMySliderLeft' class='my-slider-container'></div>`);
                $("#divMySliderLeft").append(`
<style id="mySliderStyle" nonce="gg">
          .my-slider-container {
            position: fixed;
            top: 0;
            right: -400px;
            width: 400px;           
            min-height: 300px;
            height:auto;
            background: #fff;
            box-shadow: -2px 0 10px rgba(0,0,0,0.3);
            transition: right 0.3s ease;
            z-index: 9999;
            overflow-y: auto;
          }
          .my-slider-container.active {
            right: 0;
          }
          .my-slider-close-btn {
            position: absolute;
            top: 10px;
            left: 10px;
            cursor: pointer;
            padding: 4px 8px;
            background: #f44336;
            color: #fff;
            border: none;
            border-radius: 4px;
          }
        </style>
`);
                $("#divMySliderLeft").append(html);
                // 強制瀏覽器渲染後再套用 transition
                setTimeout(() => {
                    $("#divMySliderLeft").addClass('active');
                }, 10);
                if (callback != null && typeof (callback) == "function") {
                    callback("divMySliderLeft");
                }
            }, // 我的滑動視窗-開啟
            "myDivSliderLeftOff": function () {
                $("#divMySliderLeft").remove();
            }, // 我的滑動視窗-關閉
            "setMemory": function (wtfkey, value) {
                window.localStorage.setItem(wtfkey, value);
            },
            "getMemory": function (wtfkey) {
                return window.localStorage.getItem(wtfkey);
            },
            "removeMemory": function (wtfkey) {
                return window.localStorage.removeItem(wtfkey);
            }
        },
        "interval": { //用來放一堆無腦 interval 的好地方            
        },
        "items": {
            "settings": {
                "www_ptt_cc_pic_force_display": "YES",  // 強制顯示圖片
                "term_ptt_cc_pic_delay_hide": "NO", // term.ptt.cc 延遲隱藏圖片
                "www_ptt_cc_pic_delay_hide": "NO" // term.ptt.cc 延遲隱藏圖片
            }
        },
        "flag": {
        },
        "doms": {
        },
        "init": function () {
            $.fn.center = function () {
                this.css("position", "absolute");
                this.css("top", ($(window).height() - this.height()) / 2 + $(window).scrollTop() + "px");
                this.css("left", ($(window).width() - this.width()) / 2 + $(window).scrollLeft() + "px");
                return this;
            }
            $.fn.centerX = function () {
                this.css("position", "absolute");
                this.css("left", ($(window).width() - this.width()) / 2 + $(window).scrollLeft() + "px");
                return this;
            }
            $.fn.centerY = function () {
                this.css("position", "absolute");
                this.css("top", ($(window).height() - this.height()) / 2 + $(window).scrollTop() + "px");
                return this;
            }
            // 先讀取設定
            window['my_3wa_func'].method.app_getSettings();

            // 載入設定 UI
            window['my_3wa_func'].method.app_init_settings_UI();

            $(window).on("keydown", function (e) {
                // 如果是按上、下、左、右鍵、Enter，移除 term 圖片
                // Issue #11. 空白鍵也要關閉圖片預覽
                if (location.href.indexOf("https://term.ptt.cc/") == 0) {
                    if ((e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode == 13 || e.keyCode == 32) {
                        // 只要鍵盤按就移除
                        $("span[reqc='spantheimg']").remove();
                        $("div[id^='myW']").remove();
                        $("img[reqc='imgDownload']").remove();
                    }
                }
            });

            setInterval(function () {
                // 編輯文章時不要用
                if ($("body").text().indexOf('插入│aipr') != -1) {
                    // 使用者正在編輯文章，先停用
                    return;
                }

                var isFoundURL = [];
                $("a").each(function (i, dom) {
                    //console.log(dom);
                    var jqDom = $(dom);
                    var wasChecked = jqDom.attr('my_3wa_term_ptt_cc_isCheckImg') != null;
                    var checkedHref = jqDom.attr('my_3wa_term_ptt_cc_checked_href');
                    var href = jqDom.attr('href');
                    //console.log(window['my_3wa_func']);
                    // jpg->jpeg
                    if (window['my_3wa_func'].method.is_string_like(href, "%i.imgur.com%") && window['my_3wa_func'].method.is_string_like(href, "%.jpg")) {
                        var mn = window['my_3wa_func'].method.mainname(href);
                        // 修正網址
                        jqDom.attr('href', `https://i.imgur.com/${mn}.jpeg`);
                        // 不要修改原網址，避免跑版問題
                        // Issue #9 避免修改原始網址，以免影響文章格式
                        // jqDom.text(`https://i.imgur.com/${mn}.jpeg`);
                    }

                    // https://meee.com.tw/KtJH3cW -> https://i.meee.com.tw/KtJH3cW.jpg
                    if (window['my_3wa_func'].method.is_string_like(href, "https://meee.com.tw/%")) {
                        //console.log(href);
                        var mn = window['my_3wa_func'].method.mainname(href);
                        var bn = window['my_3wa_func'].method.basename(href);
                        if (mn == bn) {
                            // 使用者沒寫是什麼圖
                            // console.log(mn);
                            // 修正網址
                            jqDom.attr('href', `https://i.meee.com.tw/${mn}.jpg`);
                            // Issue #9 避免修改原始網址，以免影響文章格式
                            //jqDom.text(`https://i.meee.com.tw/${mn}.jpg`);
                        }
                    }


                    jqDom = $(dom);
                    href = jqDom.attr('href');
                    // 修正網址
                    // 有87會用 [img][/img]
                    href = href.replace("[/img]", "", href);
                    jqDom.attr('href', href);

                    // term.ptt.cc reuses anchor nodes while the terminal screen
                    // changes. Re-check a marked anchor when its href changed;
                    // otherwise its old handler keeps previewing the old image.
                    if (wasChecked && checkedHref === href) {
                        isFoundURL.push(jqDom.attr('req_url'));
                        return;
                    }
                    if (wasChecked) {
                        if (previewRace) previewRace.invalidate();
                        jqDom.off(".my3waPreview");
                        $("div[id^='myW_']").remove();
                    }
                    jqDom.attr('my_3wa_term_ptt_cc_isCheckImg', "checked!");
                    jqDom.attr('my_3wa_term_ptt_cc_checked_href', href);


                    var whilePicsSites = {
                        "i.meee.com.tw": { "needProxy": false },
                        "tinyurl.com": { "needProxy": true },
                        "upload.cc": { "needProxy": true },
                        "i.imgur.com": { "needProxy": true },
                        "3wa.tw": { "needProxy": false }
                    };

                    var IMGURL = href;
                    for (var checkURL in whilePicsSites) {
                        if (window['my_3wa_func'].method.is_string_like(href, "%" + checkURL + "%") && whilePicsSites[checkURL]['needProxy']) {
                            IMGURL = `https://proxy.duckduckgo.com/iu/?u=${encodeURIComponent(href)}`;
                        }
                    }

                    jqDom.attr('req_url', IMGURL);

                    // 如果是圖片，浮動視窗
                    if (window['my_3wa_func'].method.in_array(window['my_3wa_func'].method.subname(href).toLowerCase(), ["jpg", "jpeg", "png", "gif"]) ||
                        window['my_3wa_func'].method.is_string_like(href, "%tinyurl.com%")  // tinyurl 也會有圖片
                    ) {

                        // 將圖片直接插到網址列前
                        // term 得用另一種技巧
                        if (location.href.indexOf("https://www.ptt.cc/") == 0) {
                            if (window['my_3wa_func'].items.settings['www_ptt_cc_pic_force_display'] == "YES") {
                                var inlinePreview = $(`
                                <span reqc="spantheimg" req_url="${IMGURL}">
                                    <img src="${IMGURL}" style="width:500px;">
                                    <br>
                                </span>`);
                                inlinePreview.find("img").on("error", function () {
                                    $(this).remove();
                                });
                                jqDom.before(inlinePreview);
                            }
                            else {
                                $("span[reqc='spantheimg']").remove();
                                $("img[loading='lazy']").remove();
                            }
                        }
                        else if (location.href.indexOf("https://term.ptt.cc/") == 0) {
                            // term.ptt.cc 先用滑鼠過去的就好~_~

                            // 重複的不要加
                            /*var datarow = $(this).closest("span").attr('data-row');
                            if ($(`span[reqc="spantheimg"][req_url="${IMGURL}"]`).length == 0) {
                                jqDom.closest("div").prepend(`<span reqc="spantheimg" data-type="bbsline" data-row="${datarow}" req_url="${IMGURL}"><img src="${IMGURL}" style="width:500px;"><br></span>`);
                            } 
                            */
                        }
                        isFoundURL.push(IMGURL);

                        // 2025-06-11 增加圖片預載入功能，避免圖片載入延遲
                        var preImg = new Image();
                        // 如果載成功，加上下載連結，再想想
                        /*
                        preImg.onload = function () {
                            //console.log("preImg.onload: " + IMGURL);
                            jqDom.append(` <img reqc="imgDownload" src="${window['my_3wa_func']['icon']['download64']}" req_url="${this.src}" style="cursor:pointer;width:32px;height:32px;background-color:transparent;" alt="下載" title="下載">`);
                            // 按到
                            jqDom.find("img[reqc='imgDownload']").off().on("click", function () {
                                //console.log("download: " + $(this).attr('req_url'));
                                window['my_3wa_func'].method.jsDownload($(this).attr('req_url'), window['my_3wa_func'].method.basename($(this).attr('req_url')));
                            });
                        };
                        */
                        preImg.src = IMGURL;

                        jqDom.off(".my3waPreview").on("mouseleave.my3waPreview", function () {
                            if (previewRace) previewRace.invalidate();
                            $("div[id^='myW_']").remove();
                        });
                        jqDom.on("mouseenter.my3waPreview", function () {
                            $("div[id^='myW_']").remove();
                            var previewURL = $(this).attr('req_url') || IMGURL;

                            window['my_3wa_func'].method.myW(`
                        <div style="width:auto;pointer-events: none;">
                            <!--img reqc='imgXClose' src="${window['my_3wa_func']['icon']['x_close']}" style="cursor:pointer;position:absolute;width:32px;right:0px;top:0px;"-->
                            <img src="${window['my_3wa_func']['icon']['loading']}" style="width:32px;pointer-events: none;" reqc="theimgloading">
                            <img reqc="theimg" style="pointer-events: none;display:none;">
                        </div>
                        `, function (myWid) {
                                clearTimeout(window['myWTimeout']);
                                $("#" + myWid).css({
                                    "pointer-events": "none",
                                    "border": "0px",
                                    "width": "32px", // 配合 loading
                                    "height": "32px"
                                });
                                $("#" + myWid).on("mouseleave", { "myWid": myWid }, function (ee) {
                                    $("#" + ee.data.myWid).remove();
                                });
                                $("#" + myWid + " img[reqc='imgXClose']").off().on("click", { "myWid": myWid }, function (ee) {
                                    $("#" + ee.data.myWid).remove();
                                });
                                var $previewImg = $("#" + myWid + " img[reqc='theimg']");
                                var onPreviewError = function () {
                                    $("#" + myWid).remove();
                                };
                                var onPreviewLoad = function (loadedImage) {
                                    //console.log("before: " + $(loadedImage).css('width'));
                                    $("#" + myWid + " img[reqc='theimgloading']").hide();
                                    $previewImg.show();
                                    $(loadedImage).css({
                                        'opacity': 1,
                                        'max-width': '700px',
                                        'max-height': '700px'
                                    });
                                    //console.log("after: " + $(loadedImage).css('width'));
                                    $("#" + myWid).css({
                                        "width": $(loadedImage).css('width'),
                                        "height": $(loadedImage).css('height')
                                    });

                                    //$("#" + myWid).center();
                                    // 感覺偏右會比較好
                                };
                                if (previewRace) {
                                    previewRace.load($previewImg[0], previewURL, onPreviewLoad, onPreviewError);
                                }
                                else {
                                    // Keep a safe fallback if content.js is loaded manually
                                    // without the extension's previewRace.js dependency.
                                    $previewImg.on("error", onPreviewError).on("load", function () {
                                        onPreviewLoad(this);
                                    }).attr("src", previewURL);
                                }

                                // Issue #8. 滑鼠移動到圖片連結時，展開圖片，移開馬上關掉
                                /*if (location.href.indexOf("https://term.ptt.cc/") == 0 && window['my_3wa_func'].items.settings["term_ptt_cc_pic_delay_hide"]=="YES") {
                                    window['myWTimeout'] = setTimeout(function () {
                                        $("#" + myWid).remove();
                                    }, 3000);
                                }
                                if (location.href.indexOf("https://www.ptt.cc/") == 0 && window['my_3wa_func'].items.settings["www_ptt_cc_pic_delay_hide"] == "YES") {
                                    window['myWTimeout'] = setTimeout(function () {
                                        $("#" + myWid).remove();
                                    }, 3000);
                                }
                                */

                            });
                        });
                        jqDom.on("mousemove", function (e) {
                            // 永遠保持在滑鼠右邊
                            var mouse_x = parseInt(e.originalEvent.clientX);
                            var mouse_y = parseInt(e.originalEvent.clientY);
                            window['wh'] = window['my_3wa_func'].method.getWindowSize();

                            //依螢幕大小，如 0~1024 圖片高位置是 30px ~ 350px
                            mouse_y = window['my_3wa_func'].method.arduino_map(mouse_y, 0, window['wh']['height'], 30, 350);
                            // 如果 myW 的高加上 350 超過螢幕高，還是要上移
                            if ($("div[id^='myW']").height() + mouse_y > window['wh']['height']) {
                                mouse_y = window['wh']['height'] - $("div[id^='myW']").height() - 70;
                            }

                            $("div[id^='myW']").css({
                                "position": "fixed",
                                "opacity": 1, // 不加上透明
                                "left": (mouse_x + 60) + 'px',
                                "top": mouse_y + 'px',
                                "bottom": "auto"
                            });


                        });
                    }

                    // 如 3wa 的 mp4 來源                  
                    if (window['my_3wa_func'].method.in_array(window['my_3wa_func'].method.subname(href).toLowerCase(), ["mp4"])) {
                        if (location.href.indexOf("https://term.ptt.cc/") == 0) {
                            // 改加 link64
                            $(dom).find("img[reqc='myimgmp4']").remove();
                            $(dom).html(href + `<img reqc="myimgmp4" req_url="${href}" 
                                src="${window['my_3wa_func']['icon']['link64']}" 
                                style="width:35px;height:35px;cursor:pointer;background-color:transparent;position:relative;z-index:9;">`);
                            $("img[reqc='myimgmp4']").off("click").on("click", function (e) {
                                var _href = $(this).attr('req_url');
                                $("div[id^='myW_']").remove(); // 先移除舊的
                                window['my_3wa_func'].method.myW(`                                
                                    <img reqc='imgXClose' src="${window['my_3wa_func']['icon']['x_close']}" style="position:absolute;right:0px;cursor:pointer;top:0px;width:35px;height:35px;z-index:999;background-color:transparent;">                                    
                                    <video autoplay controls style="border:2px solid #fff;width:700px;">
                                        <source type="video/webm" src="${_href}" />
                                    </video>                                                                
                                `, function (myWid) {
                                    $("#" + myWid + " img[reqc='imgXClose']").off().on("click", function () {
                                        $("div[id^='myW_']").fadeOut().delay(3000, function () {
                                            $(this).remove(); // 移除
                                        });
                                    });
                                });
                                e.stopPropagation();
                                return false;
                            });
                        }
                    }

                    // youtube
                    if (href.indexOf("www.youtube.com") != -1 || href.indexOf("youtu.be") != -1 || href.indexOf("m.youtube.com") != -1) {
                        if (location.href.indexOf("https://term.ptt.cc/") == 0) {
                            // 改加 link64
                            $(dom).find("img[reqc='myimgtube']").remove();
                            $(dom).html(href + `<img reqc="myimgtube" req_url="${href}" src="${window['my_3wa_func']['icon']['link64']}" style="width:35px;height:35px;cursor:pointer;background-color:transparent;position:absolute;z-index:1;">`)
                            $("img[reqc='myimgtube']").off("click").on("click", function (e) {
                                var _href = $(this).attr('req_url');
                                var _embed_href = window['my_3wa_func'].method.toEmbedURL(_href);
                                $("div[id^='myW_']").remove(); // 先移除舊的
                                window['my_3wa_func'].method.myW(`                                
                                    <img reqc='imgXClose' src="${window['my_3wa_func']['icon']['x_close']}" style="position:absolute;right:0px;cursor:pointer;top:0px;width:35px;height:35px;z-index:999;background-color:transparent;">                                    
                                    <iframe width="700" height="394" 
                                        src="${_embed_href}" 
                                        title="YouTube video player" frameborder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
                                    </iframe>                                                             
                                `, function (myWid) {
                                    $("#" + myWid + " img[reqc='imgXClose']").off().on("click", function () {
                                        $("div[id^='myW_']").fadeOut().delay(3000, function () {
                                            $(this).remove(); // 移除
                                        });
                                    });
                                });
                                e.stopPropagation();
                                return false;
                            });
                        }
                    }
                });

                // 移除不在畫面的資料
                $("span[reqc='spantheimg']").each(function (index, dom) {
                    var imgurl = $(dom).attr('req_url');
                    //console.log(imgurl);
                    //console.log(isFoundURL);
                    if (!window['my_3wa_func'].method.in_array(imgurl, isFoundURL)) {
                        $(dom).remove();
                    }
                });


            }, 300);
        }
    };
    //主程式開始
    //3秒後執行
    //setTimeout(function(){
    //console.log(location.href);
    if (location.href.indexOf("term_ptt_cc.com") == -1) {
        console.log(location.href.indexOf("term.ptt.cc"));
        console.log("only run on term.ptt.cc url...");
        // return; //只有在 term.ptt.cc 才有效        
    }
    // 程式開始 ------------------------------------------------------------------------------------------------------
    // 程式結束 ------------------------------------------------------------------------------------------------------
    window['my_3wa_func'] = appClass;
    window['my_3wa_func'].init();

}

run_3wa_term_ptt_cc();
