/**
 * 日历插件
 * Version 1.0
 * Written by Gemu
 * 
 * reference: https://www.jb51.net/article/105388.htm
 */
(function () {
    function gmCalendar(element, params) {

        /**
         * 加载配置信息
         */

        var settings = {
            width: '100px',
            height: '100px',
            fontSize: '11px',
            color: 'red',
            redTip: [],
            greenTip: [],
            blueTip: [],
        };

        var loadSetting = function(params) {
            for (var prop in params) {
                if (settings.hasOwnProperty(prop)) {
                    settings[prop] = params[prop];
                }
            }
        };

        if (params) {
            loadSetting(params);
        }

        if (typeof settings.color === 'string') {
            // TODO
        }

        var eventParams;
        var eventQueue = {};

        /**
         * 渲染日历DOM节点
         * @param {Number} year 
         * @param {Number} month 
         * @param {Number} day 
         */
        var generatorCalendarElement = function (year, month, day) {
            var now = new Date();
            var date;
            if (day) {
                date = new Date(year, month, day);
            } else {
                date = new Date(year, month);
            }
            lunar.setDate(date.getFullYear(), 6, 15);

            eventParams = {};

            var html = '<table class="gm-calendar-table" style="width: ' + settings.width + '; height: ' + settings.height + ';">';
            html += '<thead>' +
                '<tr>' +
                '<th colspan=7 class="p-r"><span class="calendar-date-btn year-down">< </span>' +
                date.getFullYear() + lunar.cYearString + '<span class="calendar-date-btn year-up"> ></span> ' +
                '<span class="calendar-date-btn month-down">< </span>' + (date.getMonth() + 1) + '月<span class="calendar-date-btn month-up"> ></span> ' +
                '<span class="today-btn p-a">今</span></th>' +
                '</tr>' +
                '<tr>' +
                '<th>日</th>' +
                '<th>一</th>' +
                '<th>二</th>' +
                '<th>三</th>' +
                '<th>四</th>' +
                '<th>五</th>' +
                '<th>六</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody style="font-size: ' + settings.fontSize + '">';

            var startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            var endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            var count = 1;
            for (let i = 1 - startOfMonth.getDay(); i <= endOfMonth.getDate() + (6 - endOfMonth.getDay()); i++) {
                lunar.setDate(date.getFullYear(), date.getMonth() + 1, i);

                if (count % 7 === 1) {
                    html += '<tr>';
                }

                html += '<td';

                let className = 'date p-r date-' + lunar.theDate.getFullYear() + '-' + (lunar.theDate.getMonth() + 1) + '-' + lunar.theDate.getDate();
                if (date.getMonth() !== lunar.theDate.getMonth()) {
                    className += ' gray-td';
                }
                if (now.getFullYear() === lunar.theDate.getFullYear() && now.getMonth() === lunar.theDate.getMonth() &&
                    now.getDate() === lunar.theDate.getDate()) {
                    className += ' tody-td';
                }
                if (day && lunar.theDate.getTime() === date.getTime()) {
                    className += ' active';
                }

                html += (className ? ' class="' + className + '"' : '') +
                    '><pre>' + lunar.theDate.getDate() + '\n' + (lunar.cDayString === "初一" ? lunar.cMonthString : lunar.cDayString) + '</pre>' +
                    '</td>';

                if (count % 7 === 0) {
                    html += '</tr>';
                }

                eventParams[count] = {
                    year: lunar.theDate.getFullYear(),
                    month: lunar.theDate.getMonth() + 1,
                    day: lunar.theDate.getDate(),
                    cYear: lunar.cYearString,
                    cMonth: lunar.cMonthString,
                    cDay: lunar.cDayString
                };

                count++;
            }

            html += '</tbody>' +
                '</table>';

            element.innerHTML = html;

            var calendarEle = document.getElementsByClassName('gm-calendar-table')[0];

            // 绑定调整日期按钮的点击事件
            calendarEle.getElementsByClassName('year-down')[0].removeEventListener('click', function() {});
            calendarEle.getElementsByClassName('year-down')[0].addEventListener('click', function (ev) {
                if (year - 1 < 2001) {
                    return;
                }
                generatorCalendarElement(year - 1, month);
            });

            calendarEle.getElementsByClassName('year-up')[0].removeEventListener('click', function() {});
            calendarEle.getElementsByClassName('year-up')[0].addEventListener('click', function (ev) {
                generatorCalendarElement(year + 1, month);
            });

            calendarEle.getElementsByClassName('month-down')[0].removeEventListener('click', function() {});
            calendarEle.getElementsByClassName('month-down')[0].addEventListener('click', function (ev) {
                generatorCalendarElement(year, month - 1);
            });

            calendarEle.getElementsByClassName('month-up')[0].removeEventListener('click', function() {});
            calendarEle.getElementsByClassName('month-up')[0].addEventListener('click', function (ev) {
                generatorCalendarElement(year, month + 1);
            });

            calendarEle.getElementsByClassName('today-btn')[0].removeEventListener('click', function() {});
            calendarEle.getElementsByClassName('today-btn')[0].addEventListener('click', function (ev) {
                currentCalendar();
            });

            // 绑定日期的点击事件
            var dateEles = calendarEle.getElementsByClassName('date');
            for (let i = 0; i < dateEles.length; i++) {
                let dateEle = dateEles[i];
                dateEle.addEventListener('click', function (ev) {
                    var params = eventParams[i + 1];
                    generatorCalendarElement(params.year, params.month - 1, params.day);
                    emit("dateClick", params);
                });
            }

            // settings配置渲染
            settings.redTip.forEach(data => {
                let onlyDate = typeof data === 'string';

                let dateEles = calendarEle.getElementsByClassName('date-' + (onlyDate ? data : data.date));

                if (dateEles && dateEles.length > 0) {
                    let dateEle = dateEles[0];
                    dateEle.innerHTML = dateEle.innerHTML + '<div class="red-tip p-a">' + (onlyDate ? '' : data.value) + '</div>';
                }
            });
            settings.greenTip.forEach(data => {
                let onlyDate = typeof data === 'string';

                let dateEles = calendarEle.getElementsByClassName('date-' + (onlyDate ? data : data.date));

                if (dateEles && dateEles.length > 0) {
                    let dateEle = dateEles[0];
                    dateEle.innerHTML = dateEle.innerHTML + '<div class="green-tip p-a">' + (onlyDate ? '' : data.value) + '</div>';
                }
            });
            settings.blueTip.forEach(data => {
                let onlyDate = typeof data === 'string';

                let dateEles = calendarEle.getElementsByClassName('date-' + (onlyDate ? data : data.date));

                if (dateEles && dateEles.length > 0) {
                    let dateEle = dateEles[0];
                    dateEle.innerHTML = dateEle.innerHTML + '<div class="blue-tip p-a">' + (onlyDate ? '' : data.value) + '</div>';
                }
            });
        };

        var lunar = {
            calendarDate: new Array(20),
            madd: new Array(12),
            theDate: '',
            tgString: '甲乙丙丁戊己庚辛壬癸',
            dzString: '子丑寅卯辰巳午未申酉戌亥',
            numString: '一二三四五六七八九十',
            monString: '正二三四五六七八九十冬腊',
            weekString: '日一二三四五六',
            sx: '鼠牛虎兔龙蛇马羊猴鸡狗猪',
            cYear: 0,
            cYearString: '',
            cMonth: 0,
            cMonthString: '',
            cDay: 0,
            cDayString: '',
            cHour: 0,
            cHourString: '',
            cDateString: '',
            dateString: '',

            init: function () {
                this.calendarDate[0] = 0x41A95; //公元2001年;
                this.calendarDate[1] = 0xD4A;
                this.calendarDate[2] = 0xDA5;
                this.calendarDate[3] = 0x20B55;
                this.calendarDate[4] = 0x56A;
                this.calendarDate[5] = 0x7155B;
                this.calendarDate[6] = 0x25D;
                this.calendarDate[7] = 0x92D;
                this.calendarDate[8] = 0x5192B;
                this.calendarDate[9] = 0xA95;
                this.calendarDate[10] = 0xB4A;
                this.calendarDate[11] = 0x416AA;
                this.calendarDate[12] = 0xAD5;
                this.calendarDate[13] = 0x90AB5;
                this.calendarDate[14] = 0x4BA;
                this.calendarDate[15] = 0xA5B;
                this.calendarDate[16] = 0x60A57;
                this.calendarDate[17] = 0x52B;
                this.calendarDate[18] = 0xA93;
                this.calendarDate[19] = 0x40E95;
                this.madd[0] = 0;
                this.madd[1] = 31;
                this.madd[2] = 59;
                this.madd[3] = 90;
                this.madd[4] = 120;
                this.madd[5] = 151;
                this.madd[6] = 181;
                this.madd[7] = 212;
                this.madd[8] = 243;
                this.madd[9] = 273;
                this.madd[10] = 304;
                this.madd[11] = 334; //今年某月已过天数！
            },

            //n月是大月还是小月?
            getBit: function (m, n) {
                return (m >> n) & 1;
            },

            setDateTime: function (timestamp) { //传入日期对象
                if (typeof timestamp === 'number') {
                    this.theDate = new Date(timestamp);
                    this.e2c();
                } else {
                    console.warn('params is uncorrect');
                }
            },

            setDate: function (year, month, day, hour) { //传入日期参数
                if (hour) {
                    this.theDate = new Date(year, month - 1, day, hour);
                } else {
                    this.theDate = new Date(year, month - 1, day);
                }
                this.e2c();
                this.getLunarDateString();
                this.getDateString();
            },

            getDateFromPrompt: function () { //用户输入日期！
                var arr = [];
                strData = prompt('请输入年 月 日 时，并以空格隔开！', '');
                if (strData == null || strData == '') {
                    alert('输入错误！请刷新！');
                    return false;
                }
                arr = strData.split(' ');
                y = arr[0];
                m = arr[1] - 1;
                d = arr[2];
                h = arr[3];
                this.theDate = new Date(y, m, d, h);
            },

            // 公历日期转农历日期
            e2c: function () {
                var total, m, n, k;
                var isEnd = false;
                total = (this.theDate.getFullYear() - 2001) * 365 + Math.floor((this.theDate.getFullYear() - 2001) / 4) + this.madd[this.theDate.getMonth()] + this.theDate.getDate() - 23; //2001年1月23是除夕;该句计算到起始年正月初一的天数
                if (this.theDate.getYear() % 4 == 0 && this.theDate.getMonth() > 1) total++; //当年是闰年且已过2月再加一天！
                for (m = 0;; m++) {
                    k = (this.calendarDate[m] < 0xfff) ? 11 : 12; //起始年+m闰月吗？
                    for (n = k; n >= 0; n--) {
                        if (total <= 29 + this.getBit(this.calendarDate[m], n)) //已找到农历年!
                        {
                            isEnd = true;
                            break;
                        }
                        total = total - 29 - this.getBit(this.calendarDate[m], n); //寻找农历年！
                    }
                    if (isEnd) break;
                }
                this.cYear = 2001 + m; //农历年
                this.cMonth = k - n + 1; //农历月
                this.cDay = total; //农历日
                if (k == 12) //闰年！
                {
                    if (this.cMonth == Math.floor(this.calendarDate[m] / 0x10000) + 1) //该月就是闰月！
                        this.cMonth = 1 - this.cMonth;
                    if (this.cMonth > Math.floor(this.calendarDate[m] / 0x10000) + 1) this.cMonth--; //该月是闰月后某个月！
                }
                this.cHour = Math.floor((this.theDate.getHours() + 1) / 2);
            },

            /**
             * 获取农历时间
             */
            getLunarDateString: function () {
                var tmp = '';
                this.cYearString = '';
                this.cMonthString = '';
                this.cDayString = '';

                this.cYearString += this.tgString.charAt((this.cYear - 4) % 10); //年干
                this.cYearString += this.dzString.charAt((this.cYear - 4) % 12); //年支
                this.cYearString += '年(';
                this.cYearString += this.sx.charAt((this.cYear - 4) % 12);
                this.cYearString += ')';
                tmp += this.cYearString;

                if (this.cMonth < 1) {
                    this.cMonthString += '闰';
                    this.cMonthString += this.monString.charAt(-this.cMonth - 1); // 闰几月！
                } else {
                    this.cMonthString += this.monString.charAt(this.cMonth - 1);
                }
                this.cMonthString += '月';
                tmp += this.cMonthString;

                this.cDayString += (this.cDay < 11) ? '初' : ((this.cDay < 20) ? '十' : ((this.cDay < 30) ? '廿' : '卅')); // 初几！
                if (this.cDay % 10 != 0 || this.cDay == 10) {
                    this.cDayString += this.numString.charAt((this.cDay - 1) % 10);
                }
                tmp += this.cDayString;

                if (this.cHour == 12) {
                    tmp += '夜';
                }
                tmp += this.dzString.charAt((this.cHour) % 12);
                tmp += '时'; //几时！

                this.cDateString = tmp;
                return tmp;
            },

            /**
             * 获取公历时间
             */
            getDateString: function () {
                var tmp = '';
                tmp += this.theDate.getFullYear() + '-' + (this.theDate.getMonth() + 1) + '-' + this.theDate.getDate() + ' ' +
                    this.theDate.getHours() + ':' + ((this.theDate.getMinutes() < 10) ? '0' : '') + this.theDate.getMinutes() +
                    ' 星期' + this.weekString.charAt(this.theDate.getDay());
                this.dateString = tmp;
                return tmp;
            }
        }

        lunar.init();

        // getDateFromPrompt();
        // lunar.setDate(2018, 6, 10, 20);
        // dateStr = lunar.getDateString();
        // lunarDateStr = lunar.getLunarDateString();
        // console.log(dateStr + '\n' + lunarDateStr + '\n' + lunar.week);

        var currentCalendar = function() {
            var now = new Date();
            generatorCalendarElement(now.getFullYear(), now.getMonth(), now.getDate());
        }

        currentCalendar();

        // 发布日期的点击事件
        var emit = function (eventName, ...params) {
            eventQueue[eventName].forEach(event => {
                event.apply(null, params);
            })
        }

        // 订阅日期的点击事件
        this.__proto__.on = function (eventName, handle) {
            if (!eventQueue[eventName]) {
                eventQueue[eventName] = [];
            }
            eventQueue[eventName].push(handle);
        }

        // 刷新日期设置
        this.__proto__.refreshSetting = function (settings) {
            loadSetting(settings);
            
            currentCalendar();
        }
    };

    window.GMCalendar = gmCalendar;
}());