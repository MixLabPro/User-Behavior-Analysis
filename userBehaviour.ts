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
 * 鼠标位置数据类型 [x坐标, y坐标, 时间戳]
 */
type MousePosition = [number, number, string];

/**
 * 元素摘要信息
 */
interface ElementSummary {
    /** 标签名 */
    tagName: string;
    /** ID */
    id: string;
    /** 类名 */
    className: string;
    /** name 属性 */
    name: string;
    /** value 属性 */
    value: string;
    /** 文本内容 */
    textContent: string;
}

/**
 * 点击详情数据类型 [x坐标, y坐标, 元素摘要, 时间戳]
 */
type ClickDetail = [number, number, ElementSummary, string];

/**
 * 滚动数据类型 [scrollX, scrollY, 时间戳]
 */
type ScrollData = [number, number, string];

/**
 * 窗口尺寸数据类型 [宽度, 高度, 时间戳]
 */
type WindowSize = [number, number, string];

/**
 * 可见性变化数据类型 [可见状态, 时间戳]
 */
type VisibilityChange = [DocumentVisibilityState, string];

/**
 * 键盘活动数据类型 [按键, 时间戳]
 */
type KeyboardActivity = [string, string];

/**
 * 导航历史数据类型 [URL, 时间戳]
 */
type NavigationHistory = [string, string];

/**
 * 表单交互数据类型 [表单名称, 时间戳]
 */
type FormInteraction = [string, string];

/**
 * 触摸事件数据类型 [事件类型, x坐标, y坐标, 时间戳]
 */
type TouchEventData = [string, number, number, string];

/**
 * 媒体交互数据类型 [事件类型, 媒体源, 时间戳]
 */
type MediaInteraction = [string, string, string];

/**
 * 用户信息接口
 */
interface UserInfo {
    /** 窗口尺寸 */
    windowSize: [number, number];
    /** 应用程序代码名称 */
    appCodeName: string;
    /** 应用程序名称 */
    appName: string;
    /** 浏览器供应商 */
    vendor: string;
    /** 操作系统平台 */
    platform: string;
    /** 用户代理字符串 */
    userAgent: string;
}

/**
 * 时间信息接口
 */
interface TimeInfo {
    /** 开始时间 */
    startTime: number | string;
    /** 当前时间 */
    currentTime: number | string;
    /** 停止时间 */
    stopTime: number | string;
}

/**
 * 点击信息接口
 */
interface ClickInfo {
    /** 点击次数 */
    clickCount: number;
    /** 点击详情列表 */
    clickDetails: ClickDetail[];
}

/**
 * 追踪结果数据接口
 */
interface TrackingResults {
    /** 用户信息 */
    userInfo: UserInfo;
    /** 时间信息 */
    time: TimeInfo;
    /** 点击信息 */
    clicks: ClickInfo;
    /** 鼠标移动轨迹 */
    mouseMovements: MousePosition[];
    /** 滚动记录 */
    mouseScroll: ScrollData[];
    /** 键盘活动记录 */
    keyboardActivities: KeyboardActivity[];
    /** 导航历史 */
    navigationHistory: NavigationHistory[];
    /** 表单交互记录 */
    formInteractions: FormInteraction[];
    /** 触摸事件记录 */
    touchEvents: TouchEventData[];
    /** 媒体交互记录 */
    mediaInteractions: MediaInteraction[];
    /** 窗口尺寸变化记录 */
    windowSizes: WindowSize[];
    /** 页面可见性变化记录 */
    visibilitychanges: VisibilityChange[];
}

/**
 * 配置选项接口
 */
interface UserBehaviourConfig {
    /** 是否收集用户信息 */
    userInfo?: boolean;
    /** 是否追踪点击事件 */
    clicks?: boolean;
    /** 是否追踪鼠标移动 */
    mouseMovement?: boolean;
    /** 鼠标移动记录间隔（秒） */
    mouseMovementInterval?: number;
    /** 是否追踪鼠标滚动 */
    mouseScroll?: boolean;
    /** 是否启用时间计数 */
    timeCount?: boolean;
    /** 处理后是否清除数据 */
    clearAfterProcess?: boolean;
    /** 数据处理间隔时间（秒） */
    processTime?: number;
    /** 是否追踪窗口大小变化 */
    windowResize?: boolean;
    /** 是否追踪页面可见性变化 */
    visibilitychange?: boolean;
    /** 是否追踪键盘活动 */
    keyboardActivity?: boolean;
    /** 是否追踪页面导航 */
    pageNavigation?: boolean;
    /** 是否追踪表单交互 */
    formInteractions?: boolean;
    /** 是否追踪触摸事件 */
    touchEvents?: boolean;
    /** 是否追踪音视频交互 */
    audioVideoInteraction?: boolean;
    /** 是否启用自定义事件注册 */
    customEventRegistration?: boolean;
    /** 数据处理回调函数 */
    processData?: (results: TrackingResults) => void;
}

/**
 * 事件监听器存储接口
 */
interface EventListeners {
    scroll: (() => void) | null;
    click: ((e: MouseEvent) => void) | null;
    mouseMovement: ((e: MouseEvent) => void) | null;
    windowResize: ((e: Event) => void) | null;
    visibilitychange: ((e: Event) => void) | null;
    keyboardActivity: ((e: KeyboardEvent) => void) | null;
    touchStart: ((e: globalThis.TouchEvent) => void) | null;
}

/**
 * 事件处理函数集合接口
 */
interface EventFunctions {
    scroll: () => void;
    click: (e: MouseEvent) => void;
    mouseMovement: (e: MouseEvent) => void;
    windowResize: (e: Event) => void;
    visibilitychange: (e: Event) => void;
    keyboardActivity: (e: KeyboardEvent) => void;
    pageNavigation: () => void;
    formInteraction: (e: Event) => void;
    touchStart: (e: globalThis.TouchEvent) => void;
    mediaInteraction: (e: Event) => void;
}

/**
 * 内存管理接口
 */
interface MemoryManager {
    /** 数据处理定时器 */
    processInterval: number | null;
    /** 鼠标移动记录定时器 */
    mouseInterval: number | null;
    /** 当前鼠标位置 */
    mousePosition: MousePosition | [];
    /** 事件监听器引用 */
    eventListeners: EventListeners;
    /** 事件处理函数集合 */
    eventsFunctions: EventFunctions;
}

/**
 * 用户行为追踪库主类
 */
(function (window) {
    const userBehaviour = (function () {
        /**
         * 默认配置选项
         */
        const defaults: Required<UserBehaviourConfig> = {
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
            processData: function (results: TrackingResults): void {
                console.log(results);
            },
        };

        /**
         * 用户自定义配置
         */
        let userConfig: Required<UserBehaviourConfig> = {} as Required<UserBehaviourConfig>;

        /**
         * 内存管理对象，存储定时器和事件监听器
         */
        const mem: MemoryManager = {
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
                touchStart: null
            },
            eventsFunctions: {
                /**
                 * 滚动事件处理函数
                 * 记录页面滚动位置和时间戳
                 */
                scroll: (): void => {
                    results.mouseScroll.push([window.scrollX, window.scrollY, getTimeStamp()]);
                },

                /**
                 * 点击事件处理函数
                 * 记录点击位置、DOM路径和时间戳
                 * @param e 鼠标事件对象
                 */
                click: (e: MouseEvent): void => {
                    results.clicks.clickCount++;
                    const path: string[] = [];
                    let node = "";
                    
                    // 构建DOM路径
                    e.composedPath().forEach((el: EventTarget, i: number) => {
                        const element = el as Element;
                        if ((i !== e.composedPath().length - 1) && (i !== e.composedPath().length - 2)) {
                            node = element.localName || "";
                            
                            // 添加类名
                            if (element.className && typeof element.className === 'string') {
                                element.classList.forEach((clE: string) => {
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
                    
                    const target = e.target as HTMLElement;

                    const elementSummary: ElementSummary = {
                        tagName: target.tagName || '',
                        id: target.id || '',
                        className: typeof target.className === 'string' ? target.className : '',
                        name: target.getAttribute('name') || '',
                        value: (target as any).value === undefined || (target as any).value === null ? '' : String((target as any).value),
                        textContent: target.textContent?.trim() || ''
                    };
                    results.clicks.clickDetails.push([e.clientX, e.clientY, elementSummary, getTimeStamp()]);
                },

                /**
                 * 鼠标移动事件处理函数
                 * 更新当前鼠标位置
                 * @param e 鼠标事件对象
                 */
                mouseMovement: (e: MouseEvent): void => {
                    mem.mousePosition = [e.clientX, e.clientY, getTimeStamp()];
                },

                /**
                 * 窗口大小变化事件处理函数
                 * 记录新的窗口尺寸和时间戳
                 * @param e 事件对象
                 */
                windowResize: (e: Event): void => {
                    results.windowSizes.push([window.innerWidth, window.innerHeight, getTimeStamp()]);
                },

                /**
                 * 页面可见性变化事件处理函数
                 * 记录可见性状态变化并处理结果
                 * @param e 事件对象
                 */
                visibilitychange: (e: Event): void => {
                    results.visibilitychanges.push([document.visibilityState, getTimeStamp()]);
                    processResults();
                },

                /**
                 * 键盘活动事件处理函数
                 * 记录按键和时间戳
                 * @param e 键盘事件对象
                 */
                keyboardActivity: (e: KeyboardEvent): void => {
                    results.keyboardActivities.push([e.key, getTimeStamp()]);
                },

                /**
                 * 页面导航事件处理函数
                 * 记录页面URL变化和时间戳
                 */
                pageNavigation: (): void => {
                    results.navigationHistory.push([location.href, getTimeStamp()]);
                },

                /**
                 * 表单交互事件处理函数
                 * 记录表单提交事件
                 * @param e 事件对象
                 */
                formInteraction: (e: Event): void => {
                    e.preventDefault(); // 阻止表单正常提交
                    const target = e.target as HTMLFormElement;
                    results.formInteractions.push([target.name || 'unnamed', getTimeStamp()]);
                    // 可选：在追踪后程序化提交表单
                },

                /**
                 * 触摸开始事件处理函数
                 * 记录触摸位置和时间戳
                 * @param e 触摸事件对象
                 */
                touchStart: (e: globalThis.TouchEvent): void => {
                    if (e.touches && e.touches.length > 0) {
                        results.touchEvents.push(['touchstart', e.touches[0].clientX, e.touches[0].clientY, getTimeStamp()]);
                    }
                },

                /**
                 * 媒体交互事件处理函数
                 * 记录媒体播放事件
                 * @param e 事件对象
                 */
                mediaInteraction: (e: Event): void => {
                    const target = e.target as HTMLMediaElement;
                    results.mediaInteractions.push(['play', target.currentSrc || '', getTimeStamp()]);
                }
            }
        };

        /**
         * 追踪结果数据存储
         */
        let results: TrackingResults = {} as TrackingResults;

        /**
         * 重置结果数据为初始状态
         * 初始化所有追踪数据结构
         */
        function resetResults(): void {
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
         * 获取当前时间戳
         * @returns 当前时间的毫秒时间戳
         */
        function getTimeStamp(): string {
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
        function config(ob: Partial<UserBehaviourConfig>): void {
            userConfig = {} as Required<UserBehaviourConfig>;
            
            // 遍历默认配置，使用用户配置覆盖默认值
            (Object.keys(defaults) as Array<keyof UserBehaviourConfig>).forEach((key) => {
                const value = key in ob ? ob[key] : defaults[key];
                (userConfig as any)[key] = value;
            });
        }

        /**
         * 开始用户行为追踪
         * 根据配置启用相应的事件监听器和定时器
         */
        function start(): void {
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
                            results.mouseMovements.push(mem.mousePosition as MousePosition);
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
            }

            // 页面导航追踪
            if (userConfig.pageNavigation) {
                // 重写 pushState 方法以捕获程序化导航
                const originalPushState = window.history.pushState;
                window.history.pushState = function pushState(
                    data: any,
                    unused: string,
                    url?: string | URL | null
                ) {
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
                document.querySelectorAll('form').forEach(form => 
                    form.addEventListener('submit', mem.eventsFunctions.formInteraction)
                );
            }

            // 触摸事件追踪
            if (userConfig.touchEvents) {
                window.addEventListener("touchstart", mem.eventsFunctions.touchStart);
            }

            // 音视频交互追踪
            if (userConfig.audioVideoInteraction) {
                document.querySelectorAll('video').forEach(video => {
                    video.addEventListener('play', mem.eventsFunctions.mediaInteraction);
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
        function processResults(): void {
            userConfig.processData(result());
            if (userConfig.clearAfterProcess) {
                resetResults();
            }
        }

        /**
         * 停止用户行为追踪
         * 清除所有定时器和事件监听器，并处理最终结果
         */
        function stop(): void {
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
            window.removeEventListener("touchstart", mem.eventsFunctions.touchStart);

            // 记录停止时间并处理最终结果
            results.time.stopTime = getTimeStamp();
            processResults();
        }

        /**
         * 获取当前追踪结果
         * 根据配置决定是否包含用户信息和时间信息
         * @returns 当前的追踪结果数据
         */
        function result(): TrackingResults {
            // 如果配置为不收集用户信息，则删除用户信息
            if (userConfig.userInfo === false && results.userInfo !== undefined) {
                delete (results as any).userInfo;
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
        function showConfig(): Required<UserBehaviourConfig> {
            if (Object.keys(userConfig).length !== Object.keys(defaults).length) {
                return defaults;
            } else {
                return userConfig;
            }
        }

        /**
         * 注册自定义事件
         * 允许用户注册自定义事件监听器
         * @param eventName 事件名称
         * @param callback 事件回调函数
         */
        function registerCustomEvent(eventName: string, callback: EventListener): void {
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
        (window as any).userBehaviour = userBehaviour;
    }

    // 支持模块导出
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = userBehaviour;
    }

})(window);

