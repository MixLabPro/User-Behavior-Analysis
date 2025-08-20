"use strict";
/**
 *
 * 这个库用于追踪和记录用户在网页上的各种交互行为，包括：
 * - 鼠标移动和点击
 * - 键盘活动
 * - 滚动行为
 * - 窗口大小变化
 * - 页面可见性变化
 * - 表单交互
 * - 触摸事件
 * - 媒体交互
 * - 页面导航
 */
/**
 * 用户行为追踪库主类
 */
(function (window) {
    const userBehaviour = (function () {
        /**
         * 默认配置选项
         */
        const defaults = {
            userInfo: true,
            clicks: true,
            mouseMovement: true,
            mouseMovementInterval: 1,
            mouseScroll: true,
            timeCount: true,
            clearAfterProcess: true,
            processTime: 15,
            windowResize: true,
            visibilitychange: true,
            keyboardActivity: true,
            pageNavigation: true,
            formInteractions: true,
            touchEvents: true,
            audioVideoInteraction: true,
            customEventRegistration: true,
            processData: function (results) {
                console.log(results);
            },
            autoSendEvents: false,
            sendUrl: '',
        };
        /**
         * 用户自定义配置
         */
        let userConfig = {};
        /**
         * 内存管理对象，存储定时器和事件监听器
         */
        const mem = {
            processInterval: null,
            mouseInterval: null,
            mousePosition: [], // [x坐标, y坐标, 时间戳]
            eventListeners: {
                scroll: null,
                click: null,
                mouseMovement: null,
                windowResize: null,
                visibilitychange: null,
                keyboardActivity: null,
                inputActivity: null,
                touchStart: null
            },
            eventsFunctions: {
                /**
                 * 滚动事件处理函数
                 * 记录页面滚动位置和时间戳
                 */
                scroll: () => {
                    const scrollData = [window.scrollX, window.scrollY, getTimeStamp()];
                    results.mouseScroll.push(scrollData);
                    sendEventData('scroll', scrollData);
                },
                /**
                 * 点击事件处理函数
                 * 记录点击位置、DOM路径和时间戳
                 * @param e 鼠标事件对象
                 */
                click: (e) => {
                    results.clicks.clickCount++;
                    const path = [];
                    let node = "";
                    // 构建DOM路径
                    e.composedPath().forEach((el, i) => {
                        const element = el;
                        if ((i !== e.composedPath().length - 1) && (i !== e.composedPath().length - 2)) {
                            node = element.localName || "";
                            // 添加类名
                            if (element.className && typeof element.className === 'string') {
                                element.classList.forEach((clE) => {
                                    node += "." + clE;
                                });
                            }
                            // 添加ID
                            if (element.id) {
                                node += "#" + element.id;
                            }
                            path.push(node);
                        }
                    });
                    const elementSummary = getElementSummary(e.target);
                    const clickDetail = [e.clientX, e.clientY, elementSummary, getTimeStamp()];
                    results.clicks.clickDetails.push(clickDetail);
                    sendEventData('click', clickDetail);
                },
                /**
                 * 鼠标移动事件处理函数
                 * 更新当前鼠标位置
                 * @param e 鼠标事件对象
                 */
                mouseMovement: (e) => {
                    mem.mousePosition = [e.clientX, e.clientY, getTimeStamp()];
                },
                /**
                 * 窗口大小变化事件处理函数
                 * 记录新的窗口尺寸和时间戳
                 * @param e 事件对象
                 */
                windowResize: (e) => {
                    const windowSize = [window.innerWidth, window.innerHeight, getTimeStamp()];
                    results.windowSizes.push(windowSize);
                    sendEventData('windowResize', windowSize);
                },
                /**
                 * 页面可见性变化事件处理函数
                 * 记录可见性状态变化并处理结果
                 * @param e 事件对象
                 */
                visibilitychange: (e) => {
                    const visibilityChange = [document.visibilityState, getTimeStamp()];
                    results.visibilitychanges.push(visibilityChange);
                    sendEventData('visibilitychange', visibilityChange);
                    processResults();
                },
                /**
                 * 键盘活动事件处理函数
                 * 记录按键和时间戳
                 * @param e 键盘事件对象
                 */
                keyboardActivity: (e) => {
                    const elementSummary = getElementSummary(e.target);
                    const keyboardActivity = [e.key, elementSummary, getTimeStamp()];
                    results.keyboardActivities.push(keyboardActivity);
                    sendEventData('keyboardActivity', keyboardActivity);
                },
                /**
                 * 输入活动事件处理函数
                 * 记录输入框的内容变化和时间戳
                 * @param e 输入事件对象
                 */
                inputActivity: (e) => {
                    const target = e.target;
                    const elementSummary = getElementSummary(e.target);
                    const inputValue = target.value || '';
                    const inputActivity = [inputValue, elementSummary, getTimeStamp()];
                    results.keyboardActivities.push(inputActivity);
                    sendEventData('inputActivity', inputActivity);
                },
                /**
                 * 页面导航事件处理函数
                 * 记录页面URL变化和时间戳
                 */
                pageNavigation: () => {
                    const navigationHistory = [location.href, getTimeStamp()];
                    results.navigationHistory.push(navigationHistory);
                    sendEventData('pageNavigation', navigationHistory);
                },
                /**
                 * 表单交互事件处理函数
                 * 记录表单提交事件
                 * @param e 事件对象
                 */
                formInteraction: (e) => {
                    e.preventDefault(); // 阻止表单正常提交
                    const elementSummary = getElementSummary(e.target);
                    const formInteraction = [elementSummary, getTimeStamp()];
                    results.formInteractions.push(formInteraction);
                    sendEventData('formInteraction', formInteraction);
                    // 可选：在追踪后程序化提交表单
                },
                /**
                 * 触摸开始事件处理函数
                 * 记录触摸位置和时间戳
                 * @param e 触摸事件对象
                 */
                touchStart: (e) => {
                    if (e.touches && e.touches.length > 0) {
                        const touch = e.touches[0];
                        const elementSummary = getElementSummary(touch.target);
                        const touchEventData = ['touchstart', touch.clientX, touch.clientY, elementSummary, getTimeStamp()];
                        results.touchEvents.push(touchEventData);
                        sendEventData('touchStart', touchEventData);
                    }
                },
                /**
                 * 媒体交互事件处理函数
                 * 记录媒体播放事件
                 * @param e 事件对象
                 */
                mediaInteraction: (e) => {
                    const target = e.target;
                    const mediaInteraction = [e.type, target.currentSrc || '', getTimeStamp()];
                    results.mediaInteractions.push(mediaInteraction);
                    sendEventData('mediaInteraction', mediaInteraction);
                }
            }
        };
        /**
         * 追踪结果数据存储
         */
        let results = {};
        /**
         * 重置结果数据为初始状态
         * 初始化所有追踪数据结构
         */
        function resetResults() {
            results = {
                userInfo: {
                    windowSize: [window.innerWidth, window.innerHeight],
                    appCodeName: navigator.appCodeName || '',
                    appName: navigator.appName || '',
                    vendor: navigator.vendor || '',
                    platform: navigator.platform || '',
                    userAgent: navigator.userAgent || ''
                },
                time: {
                    startTime: 0,
                    currentTime: 0,
                    stopTime: 0,
                },
                clicks: {
                    clickCount: 0,
                    clickDetails: []
                },
                mouseMovements: [],
                mouseScroll: [],
                keyboardActivities: [],
                navigationHistory: [],
                formInteractions: [],
                touchEvents: [],
                mediaInteractions: [],
                windowSizes: [],
                visibilitychanges: [],
            };
        }
        // 初始化结果数据
        resetResults();
        /**
         * 获取元素的摘要信息
         * @param element HTML元素
         * @returns 元素摘要对象
         */
        function getElementSummary(element) {
            var _a;
            if (!element || !(element instanceof HTMLElement)) {
                return {
                    tagName: '',
                    id: '',
                    className: '',
                    name: '',
                    value: '',
                    textContent: ''
                };
            }
            const target = element;
            return {
                tagName: target.tagName || '',
                id: target.id || '',
                className: typeof target.className === 'string' ? target.className : '',
                name: target.getAttribute('name') || '',
                value: target.value === undefined || target.value === null ? '' : String(target.value),
                textContent: ((_a = target.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''
            };
        }
        /**
         * 发送事件数据到后台
         * @param eventType 事件类型
         * @param data 事件数据
         */
        function sendEventData(eventType, data) {
            if (userConfig.autoSendEvents && userConfig.sendUrl) {
                const payload = {
                    type: eventType,
                    data: data,
                    timestamp: getTimeStamp(),
                    url: location.href,
                    userInfo: results.userInfo // 附加用户信息以便后台分析
                };
                try {
                    // 使用 sendBeacon 保证数据能可靠发送
                    if (navigator.sendBeacon) {
                        console.log(`Sending event data to ${userConfig.sendUrl}`, payload);
                        navigator.sendBeacon(userConfig.sendUrl, JSON.stringify(payload));
                    }
                }
                catch (error) {
                    console.error('Failed to send event data:', error);
                }
            }
        }
        /**
         * 获取当前时间戳
         * @returns 当前时间的毫秒时间戳
         */
        function getTimeStamp() {
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
        /**
         * 配置用户行为追踪选项
         * 合并用户配置和默认配置
         * @param ob 用户自定义配置对象
         */
        function config(ob) {
            userConfig = {};
            // 遍历默认配置，使用用户配置覆盖默认值
            Object.keys(defaults).forEach((key) => {
                const value = key in ob ? ob[key] : defaults[key];
                userConfig[key] = value;
            });
        }
        /**
         * 开始用户行为追踪
         * 根据配置启用相应的事件监听器和定时器
         */
        function start() {
            // 如果没有提供配置，使用默认配置
            if (Object.keys(userConfig).length !== Object.keys(defaults).length) {
                console.log("no config provided. using default..");
                userConfig = defaults;
            }
            // 时间计数设置
            if (userConfig.timeCount !== undefined && userConfig.timeCount) {
                results.time.startTime = getTimeStamp();
            }
            // 鼠标移动追踪
            if (userConfig.mouseMovement) {
                window.addEventListener("mousemove", mem.eventsFunctions.mouseMovement);
                mem.mouseInterval = window.setInterval(() => {
                    if (mem.mousePosition && mem.mousePosition.length) {
                        // 只有当鼠标位置发生变化时才记录
                        const lastMovement = results.mouseMovements[results.mouseMovements.length - 1];
                        if (!results.mouseMovements.length ||
                            ((mem.mousePosition[0] !== lastMovement[0]) && (mem.mousePosition[1] !== lastMovement[1]))) {
                            const mousePosition = mem.mousePosition;
                            results.mouseMovements.push(mousePosition);
                            sendEventData('mouseMovement', mousePosition);
                        }
                    }
                }, defaults.mouseMovementInterval * 1000);
            }
            // 点击事件追踪
            if (userConfig.clicks) {
                window.addEventListener("click", mem.eventsFunctions.click);
            }
            // 滚动事件追踪
            if (userConfig.mouseScroll) {
                window.addEventListener("scroll", mem.eventsFunctions.scroll);
            }
            // 窗口大小变化追踪
            if (userConfig.windowResize !== false) {
                window.addEventListener("resize", mem.eventsFunctions.windowResize);
            }
            // 页面可见性变化追踪
            if (userConfig.visibilitychange !== false) {
                window.addEventListener("visibilitychange", mem.eventsFunctions.visibilitychange);
            }
            // 键盘活动追踪
            if (userConfig.keyboardActivity) {
                window.addEventListener("keydown", mem.eventsFunctions.keyboardActivity);
                // 添加输入事件监听，用于捕获输入框的内容变化
                document.addEventListener("input", mem.eventsFunctions.inputActivity);
            }
            // 页面导航追踪
            if (userConfig.pageNavigation) {
                // 重写 pushState 方法以捕获程序化导航
                const originalPushState = window.history.pushState;
                window.history.pushState = function pushState(data, unused, url) {
                    const ret = originalPushState.call(this, data, unused, url);
                    window.dispatchEvent(new Event('pushstate'));
                    window.dispatchEvent(new Event('locationchange'));
                    return ret;
                };
                // 监听各种导航事件
                window.addEventListener('popstate', mem.eventsFunctions.pageNavigation);
                window.addEventListener('pushstate', mem.eventsFunctions.pageNavigation);
                window.addEventListener('locationchange', mem.eventsFunctions.pageNavigation);
            }
            // 表单交互追踪
            if (userConfig.formInteractions) {
                document.querySelectorAll('form').forEach(form => form.addEventListener('submit', mem.eventsFunctions.formInteraction));
            }
            // 触摸事件追踪
            if (userConfig.touchEvents) {
                window.addEventListener("touchstart", mem.eventsFunctions.touchStart);
            }
            // 音视频交互追踪
            if (userConfig.audioVideoInteraction) {
                document.querySelectorAll('video, audio').forEach(media => {
                    media.addEventListener('play', mem.eventsFunctions.mediaInteraction);
                    media.addEventListener('pause', mem.eventsFunctions.mediaInteraction);
                    media.addEventListener('ended', mem.eventsFunctions.mediaInteraction);
                    media.addEventListener('timeupdate', mem.eventsFunctions.mediaInteraction);
                    // 可以根据需要添加其他媒体事件
                });
            }
            // 设置数据处理定时器
            if (typeof userConfig.processTime === 'number' && userConfig.processTime > 0) {
                mem.processInterval = window.setInterval(() => {
                    processResults();
                }, userConfig.processTime * 1000);
            }
        }
        /**
         * 处理追踪结果
         * 调用用户定义的处理函数，并根据配置决定是否清除数据
         */
        function processResults() {
            userConfig.processData(result());
            if (userConfig.clearAfterProcess) {
                resetResults();
            }
        }
        /**
         * 停止用户行为追踪
         * 清除所有定时器和事件监听器，并处理最终结果
         */
        function stop() {
            // 清除定时器
            if (mem.processInterval !== null) {
                clearInterval(mem.processInterval);
            }
            if (mem.mouseInterval !== null) {
                clearInterval(mem.mouseInterval);
            }
            // 移除事件监听器
            window.removeEventListener("scroll", mem.eventsFunctions.scroll);
            window.removeEventListener("click", mem.eventsFunctions.click);
            window.removeEventListener("mousemove", mem.eventsFunctions.mouseMovement);
            window.removeEventListener("resize", mem.eventsFunctions.windowResize);
            window.removeEventListener("visibilitychange", mem.eventsFunctions.visibilitychange);
            window.removeEventListener("keydown", mem.eventsFunctions.keyboardActivity);
            document.removeEventListener("input", mem.eventsFunctions.inputActivity);
            window.removeEventListener("touchstart", mem.eventsFunctions.touchStart);
            // 移除媒体事件监听器
            if (userConfig.audioVideoInteraction) {
                document.querySelectorAll('video, audio').forEach(media => {
                    media.removeEventListener('play', mem.eventsFunctions.mediaInteraction);
                    media.removeEventListener('pause', mem.eventsFunctions.mediaInteraction);
                    media.removeEventListener('ended', mem.eventsFunctions.mediaInteraction);
                    media.removeEventListener('timeupdate', mem.eventsFunctions.mediaInteraction);
                });
            }
            // 记录停止时间并处理最终结果
            results.time.stopTime = getTimeStamp();
            processResults();
        }
        /**
         * 获取当前追踪结果
         * 根据配置决定是否包含用户信息和时间信息
         * @returns 当前的追踪结果数据
         */
        function result() {
            // 如果配置为不收集用户信息，则删除用户信息
            if (userConfig.userInfo === false && results.userInfo !== undefined) {
                delete results.userInfo;
            }
            // 如果启用时间计数，更新当前时间
            if (userConfig.timeCount !== undefined && userConfig.timeCount) {
                results.time.currentTime = getTimeStamp();
            }
            return results;
        }
        /**
         * 显示当前配置
         * @returns 当前使用的配置对象
         */
        function showConfig() {
            if (Object.keys(userConfig).length !== Object.keys(defaults).length) {
                return defaults;
            }
            else {
                return userConfig;
            }
        }
        /**
         * 注册自定义事件
         * 允许用户注册自定义事件监听器
         * @param eventName 事件名称
         * @param callback 事件回调函数
         */
        function registerCustomEvent(eventName, callback) {
            window.addEventListener(eventName, callback);
        }
        // 返回公共API
        return {
            /** 显示当前配置 */
            showConfig,
            /** 设置配置选项 */
            config,
            /** 开始追踪 */
            start,
            /** 停止追踪 */
            stop,
            /** 获取追踪结果 */
            showResult: result,
            /** 手动处理结果 */
            processResults,
            /** 注册自定义事件 */
            registerCustomEvent,
        };
    })();
    // 在浏览器环境中将库挂载到全局对象
    if (typeof window !== 'undefined') {
        window.userBehaviour = userBehaviour;
    }
    // 支持模块导出
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = userBehaviour;
    }
})(window);
//# sourceMappingURL=userBehaviour.js.map