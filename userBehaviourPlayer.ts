/**
 * 用户行为播放器
 * 用于播放和重现通过 userBehaviour.ts 收集的用户行为数据
 * 支持鼠标轨迹、点击、滚动等行为的动画播放
 */

/**
 * 播放器配置接口
 */
interface PlayerConfig {
    /** 播放速度倍率 */
    playbackSpeed?: number;
    /** 是否显示鼠标轨迹 */
    showMouseTrail?: boolean;
    /** 鼠标轨迹颜色 */
    mouseTrailColor?: string;
    /** 鼠标轨迹宽度 */
    mouseTrailWidth?: number;
    /** 是否显示点击效果 */
    showClickEffect?: boolean;
    /** 点击效果颜色 */
    clickEffectColor?: string;
    /** 点击效果大小 */
    clickEffectSize?: number;
    /** 是否显示滚动指示器 */
    showScrollIndicator?: boolean;
    /** 是否显示键盘输入 */
    showKeyboardInput?: boolean;
    /** 播放控制面板位置 */
    controlPanelPosition?: 'top' | 'bottom' | 'left' | 'right';
    /** 是否自动播放 */
    autoPlay?: boolean;
    /** 是否循环播放 */
    loop?: boolean;
}

/**
 * 播放状态枚举
 */
enum PlaybackState {
    STOPPED = 'stopped',
    PLAYING = 'playing',
    PAUSED = 'paused',
    FINISHED = 'finished'
}

/**
 * 时间轴事件接口
 */
interface TimelineEvent {
    /** 事件时间戳 */
    timestamp: string;
    /** 事件类型 */
    type: 'mouseMove' | 'click' | 'scroll' | 'keyboard' | 'windowResize' | 'visibilityChange' | 'touch' | 'media' | 'form' | 'navigation';
    /** 事件数据 */
    data: any;
    /** 相对时间（毫秒） */
    relativeTime: number;
}

/**
 * 播放器状态接口
 */
interface PlayerState {
    /** 当前播放状态 */
    state: PlaybackState;
    /** 当前播放时间 */
    currentTime: number;
    /** 总播放时长 */
    totalDuration: number;
    /** 当前事件索引 */
    currentEventIndex: number;
    /** 播放进度（0-1） */
    progress: number;
}

/**
 * 用户行为播放器主类
 */
(function (window) {
    const userBehaviourPlayer = (function () {
        /**
         * 默认配置
         */
        const defaults: Required<PlayerConfig> = {
            playbackSpeed: 1.0,
            showMouseTrail: true,
            mouseTrailColor: '#ff0000',
            mouseTrailWidth: 2,
            showClickEffect: true,
            clickEffectColor: '#00ff00',
            clickEffectSize: 20,
            showScrollIndicator: true,
            showKeyboardInput: true,
            controlPanelPosition: 'bottom',
            autoPlay: false,
            loop: false
        };

        /**
         * 用户配置
         */
        let config: Required<PlayerConfig> = defaults;

        /**
         * 播放器状态
         */
        let playerState: PlayerState = {
            state: PlaybackState.STOPPED,
            currentTime: 0,
            totalDuration: 0,
            currentEventIndex: 0,
            progress: 0
        };

        /**
         * 时间轴事件数组
         */
        let timeline: TimelineEvent[] = [];

        /**
         * 播放定时器
         */
        let playbackTimer: number | null = null;

        /**
         * DOM元素引用
         */
        let elements = {
            canvas: null as HTMLCanvasElement | null,
            ctx: null as CanvasRenderingContext2D | null,
            controlPanel: null as HTMLDivElement | null,
            mouseIndicator: null as HTMLDivElement | null,
            overlay: null as HTMLDivElement | null
        };

        /**
         * 鼠标轨迹点数组
         */
        let mouseTrailPoints: Array<{x: number, y: number, timestamp: number}> = [];

        /**
         * 解析时间戳为毫秒
         */
        function parseTimestamp(timestamp: string): number {
            return new Date(timestamp).getTime();
        }

        /**
         * 从追踪结果构建时间轴
         */
        function buildTimeline(trackingResults: any): void {
            timeline = [];
            const startTime = parseTimestamp(trackingResults.time.startTime);

            // 添加鼠标移动事件
            if (trackingResults.mouseMovements) {
                trackingResults.mouseMovements.forEach((movement: any) => {
                    timeline.push({
                        timestamp: movement[2],
                        type: 'mouseMove',
                        data: { x: movement[0], y: movement[1] },
                        relativeTime: parseTimestamp(movement[2]) - startTime
                    });
                });
            }

            // 添加点击事件
            if (trackingResults.clicks && trackingResults.clicks.clickDetails) {
                trackingResults.clicks.clickDetails.forEach((click: any) => {
                    timeline.push({
                        timestamp: click[3],
                        type: 'click',
                        data: { x: click[0], y: click[1], element: click[2] },
                        relativeTime: parseTimestamp(click[3]) - startTime
                    });
                });
            }

            // 添加滚动事件
            if (trackingResults.mouseScroll) {
                trackingResults.mouseScroll.forEach((scroll: any) => {
                    timeline.push({
                        timestamp: scroll[2],
                        type: 'scroll',
                        data: { scrollX: scroll[0], scrollY: scroll[1] },
                        relativeTime: parseTimestamp(scroll[2]) - startTime
                    });
                });
            }

            // 添加键盘事件
            if (trackingResults.keyboardActivities) {
                trackingResults.keyboardActivities.forEach((keyboard: any) => {
                    timeline.push({
                        timestamp: keyboard[2],
                        type: 'keyboard',
                        data: { key: keyboard[0], element: keyboard[1] },
                        relativeTime: parseTimestamp(keyboard[2]) - startTime
                    });
                });
            }

            // 添加窗口大小变化事件
            if (trackingResults.windowSizes) {
                trackingResults.windowSizes.forEach((size: any) => {
                    timeline.push({
                        timestamp: size[2],
                        type: 'windowResize',
                        data: { width: size[0], height: size[1] },
                        relativeTime: parseTimestamp(size[2]) - startTime
                    });
                });
            }

            // 按时间排序
            timeline.sort((a, b) => a.relativeTime - b.relativeTime);
            
            // 设置总时长
            if (timeline.length > 0) {
                playerState.totalDuration = timeline[timeline.length - 1].relativeTime;
            }
        }

        /**
         * 创建播放器UI
         */
        function createPlayerUI(): void {
            // 创建覆盖层
            elements.overlay = document.createElement('div');
            elements.overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9999;
            `;
            document.body.appendChild(elements.overlay);

            // 创建画布用于绘制轨迹
            elements.canvas = document.createElement('canvas');
            elements.canvas.width = window.innerWidth;
            elements.canvas.height = window.innerHeight;
            elements.canvas.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                pointer-events: none;
            `;
            elements.overlay.appendChild(elements.canvas);
            elements.ctx = elements.canvas.getContext('2d');

            // 创建鼠标指示器
            elements.mouseIndicator = document.createElement('div');
            elements.mouseIndicator.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                background: ${config.mouseTrailColor};
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.1s ease;
                box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
                display: none;
            `;
            elements.overlay.appendChild(elements.mouseIndicator);

            // 创建控制面板
            createControlPanel();
        }

        /**
         * 创建控制面板
         */
        function createControlPanel(): void {
            elements.controlPanel = document.createElement('div');
            elements.controlPanel.style.cssText = `
                position: fixed;
                ${config.controlPanelPosition}: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 25px;
                display: flex;
                align-items: center;
                gap: 10px;
                font-family: Arial, sans-serif;
                font-size: 14px;
                pointer-events: auto;
                z-index: 10000;
            `;

            // 播放/暂停按钮
            const playButton = document.createElement('button');
            playButton.textContent = '▶️';
            playButton.style.cssText = `
                background: none;
                border: none;
                color: white;
                font-size: 16px;
                cursor: pointer;
                padding: 5px;
            `;
            playButton.onclick = togglePlayback;

            // 停止按钮
            const stopButton = document.createElement('button');
            stopButton.textContent = '⏹️';
            stopButton.style.cssText = playButton.style.cssText;
            stopButton.onclick = stop;

            // 进度条
            const progressBar = document.createElement('input');
            progressBar.type = 'range';
            progressBar.min = '0';
            progressBar.max = '100';
            progressBar.value = '0';
            progressBar.style.cssText = `
                width: 200px;
                margin: 0 10px;
            `;
            progressBar.oninput = (e) => {
                const target = e.target as HTMLInputElement;
                seekTo(parseFloat(target.value) / 100);
            };

            // 时间显示
            const timeDisplay = document.createElement('span');
            timeDisplay.textContent = '00:00 / 00:00';

            // 速度控制
            const speedSelect = document.createElement('select');
            speedSelect.style.cssText = `
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: none;
                padding: 2px 5px;
                border-radius: 3px;
            `;
            ['0.5x', '1x', '1.5x', '2x', '3x'].forEach(speed => {
                const option = document.createElement('option');
                option.value = speed.replace('x', '');
                option.textContent = speed;
                option.selected = speed === '1x';
                speedSelect.appendChild(option);
            });
            speedSelect.onchange = (e) => {
                const target = e.target as HTMLSelectElement;
                config.playbackSpeed = parseFloat(target.value);
            };

            elements.controlPanel.appendChild(playButton);
            elements.controlPanel.appendChild(stopButton);
            elements.controlPanel.appendChild(progressBar);
            elements.controlPanel.appendChild(timeDisplay);
            elements.controlPanel.appendChild(speedSelect);

            document.body.appendChild(elements.controlPanel);

            // 保存引用以便更新
            (elements.controlPanel as any).playButton = playButton;
            (elements.controlPanel as any).progressBar = progressBar;
            (elements.controlPanel as any).timeDisplay = timeDisplay;
        }

        /**
         * 格式化时间显示
         */
        function formatTime(milliseconds: number): string {
            const seconds = Math.floor(milliseconds / 1000);
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        /**
         * 更新控制面板
         */
        function updateControlPanel(): void {
            if (!elements.controlPanel) return;

            const playButton = (elements.controlPanel as any).playButton;
            const progressBar = (elements.controlPanel as any).progressBar;
            const timeDisplay = (elements.controlPanel as any).timeDisplay;

            playButton.textContent = playerState.state === PlaybackState.PLAYING ? '⏸️' : '▶️';
            progressBar.value = (playerState.progress * 100).toString();
            timeDisplay.textContent = `${formatTime(playerState.currentTime)} / ${formatTime(playerState.totalDuration)}`;
        }

        /**
         * 播放事件
         */
        function playEvent(event: TimelineEvent): void {
            switch (event.type) {
                case 'mouseMove':
                    handleMouseMove(event.data);
                    break;
                case 'click':
                    handleClick(event.data);
                    break;
                case 'scroll':
                    handleScroll(event.data);
                    break;
                case 'keyboard':
                    handleKeyboard(event.data);
                    break;
                case 'windowResize':
                    handleWindowResize(event.data);
                    break;
            }
        }

        /**
         * 处理鼠标移动
         */
        function handleMouseMove(data: {x: number, y: number}): void {
            if (!elements.mouseIndicator) return;

            elements.mouseIndicator.style.display = 'block';
            elements.mouseIndicator.style.left = data.x + 'px';
            elements.mouseIndicator.style.top = data.y + 'px';

            // 添加到轨迹点
            if (config.showMouseTrail) {
                mouseTrailPoints.push({
                    x: data.x,
                    y: data.y,
                    timestamp: Date.now()
                });

                // 限制轨迹点数量
                if (mouseTrailPoints.length > 50) {
                    mouseTrailPoints.shift();
                }

                drawMouseTrail();
            }
        }

        /**
         * 绘制鼠标轨迹
         */
        function drawMouseTrail(): void {
            if (!elements.ctx || !config.showMouseTrail) return;

            elements.ctx.clearRect(0, 0, elements.canvas!.width, elements.canvas!.height);
            
            if (mouseTrailPoints.length < 2) return;

            elements.ctx.strokeStyle = config.mouseTrailColor;
            elements.ctx.lineWidth = config.mouseTrailWidth;
            elements.ctx.lineCap = 'round';
            elements.ctx.lineJoin = 'round';

            elements.ctx.beginPath();
            elements.ctx.moveTo(mouseTrailPoints[0].x, mouseTrailPoints[0].y);

            for (let i = 1; i < mouseTrailPoints.length; i++) {
                const point = mouseTrailPoints[i];
                const alpha = i / mouseTrailPoints.length;
                elements.ctx.globalAlpha = alpha;
                elements.ctx.lineTo(point.x, point.y);
            }

            elements.ctx.stroke();
            elements.ctx.globalAlpha = 1;
        }

        /**
         * 处理点击事件
         */
        function handleClick(data: {x: number, y: number, element: any}): void {
            if (!config.showClickEffect) return;

            // 创建点击效果
            const clickEffect = document.createElement('div');
            clickEffect.style.cssText = `
                position: absolute;
                left: ${data.x}px;
                top: ${data.y}px;
                width: ${config.clickEffectSize}px;
                height: ${config.clickEffectSize}px;
                background: ${config.clickEffectColor};
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: clickPulse 0.6s ease-out forwards;
                pointer-events: none;
                z-index: 10001;
            `;

            // 添加CSS动画
            if (!document.getElementById('click-animation-style')) {
                const style = document.createElement('style');
                style.id = 'click-animation-style';
                style.textContent = `
                    @keyframes clickPulse {
                        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                        100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }

            elements.overlay!.appendChild(clickEffect);

            // 移除效果
            setTimeout(() => {
                if (clickEffect.parentNode) {
                    clickEffect.parentNode.removeChild(clickEffect);
                }
            }, 600);
        }

        /**
         * 处理滚动事件
         */
        function handleScroll(data: {scrollX: number, scrollY: number}): void {
            window.scrollTo(data.scrollX, data.scrollY);
        }

        /**
         * 处理键盘事件
         */
        function handleKeyboard(data: {key: string, element: any}): void {
            if (!config.showKeyboardInput) return;

            // 显示按键提示
            const keyIndicator = document.createElement('div');
            keyIndicator.textContent = data.key;
            keyIndicator.style.cssText = `
                position: fixed;
                top: 50px;
                right: 50px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 16px;
                z-index: 10001;
                animation: keyFade 1s ease-out forwards;
            `;

            // 添加CSS动画
            if (!document.getElementById('key-animation-style')) {
                const style = document.createElement('style');
                style.id = 'key-animation-style';
                style.textContent = `
                    @keyframes keyFade {
                        0% { opacity: 1; transform: translateY(0); }
                        100% { opacity: 0; transform: translateY(-20px); }
                    }
                `;
                document.head.appendChild(style);
            }

            document.body.appendChild(keyIndicator);

            setTimeout(() => {
                if (keyIndicator.parentNode) {
                    keyIndicator.parentNode.removeChild(keyIndicator);
                }
            }, 1000);
        }

        /**
         * 处理窗口大小变化
         */
        function handleWindowResize(data: {width: number, height: number}): void {
            // 调整画布大小
            if (elements.canvas) {
                elements.canvas.width = data.width;
                elements.canvas.height = data.height;
            }
        }

        /**
         * 播放循环
         */
        function playbackLoop(): void {
            if (playerState.state !== PlaybackState.PLAYING) return;

            const currentTime = playerState.currentTime;
            
            // 查找当前时间应该播放的事件
            while (playerState.currentEventIndex < timeline.length) {
                const event = timeline[playerState.currentEventIndex];
                if (event.relativeTime <= currentTime) {
                    playEvent(event);
                    playerState.currentEventIndex++;
                } else {
                    break;
                }
            }

            // 更新进度
            playerState.progress = playerState.totalDuration > 0 ? currentTime / playerState.totalDuration : 0;
            updateControlPanel();

            // 检查是否播放完成
            if (currentTime >= playerState.totalDuration) {
                if (config.loop) {
                    seekTo(0);
                } else {
                    playerState.state = PlaybackState.FINISHED;
                    updateControlPanel();
                    return;
                }
            }

            // 更新播放时间
            playerState.currentTime += 50 * config.playbackSpeed;

            // 继续播放
            playbackTimer = window.setTimeout(playbackLoop, 50);
        }

        /**
         * 开始播放
         */
        function play(): void {
            if (playerState.state === PlaybackState.FINISHED) {
                seekTo(0);
            }
            
            playerState.state = PlaybackState.PLAYING;
            updateControlPanel();
            playbackLoop();
        }

        /**
         * 暂停播放
         */
        function pause(): void {
            playerState.state = PlaybackState.PAUSED;
            if (playbackTimer) {
                clearTimeout(playbackTimer);
                playbackTimer = null;
            }
            updateControlPanel();
        }

        /**
         * 停止播放
         */
        function stop(): void {
            playerState.state = PlaybackState.STOPPED;
            if (playbackTimer) {
                clearTimeout(playbackTimer);
                playbackTimer = null;
            }
            seekTo(0);
            
            // 隐藏鼠标指示器
            if (elements.mouseIndicator) {
                elements.mouseIndicator.style.display = 'none';
            }
            
            // 清除轨迹
            mouseTrailPoints = [];
            if (elements.ctx) {
                elements.ctx.clearRect(0, 0, elements.canvas!.width, elements.canvas!.height);
            }
            
            updateControlPanel();
        }

        /**
         * 切换播放/暂停
         */
        function togglePlayback(): void {
            if (playerState.state === PlaybackState.PLAYING) {
                pause();
            } else {
                play();
            }
        }

        /**
         * 跳转到指定进度
         */
        function seekTo(progress: number): void {
            progress = Math.max(0, Math.min(1, progress));
            playerState.currentTime = progress * playerState.totalDuration;
            playerState.progress = progress;
            playerState.currentEventIndex = 0;

            // 重新定位到正确的事件索引
            for (let i = 0; i < timeline.length; i++) {
                if (timeline[i].relativeTime <= playerState.currentTime) {
                    playerState.currentEventIndex = i + 1;
                } else {
                    break;
                }
            }

            updateControlPanel();
        }

        /**
         * 销毁播放器
         */
        function destroy(): void {
            stop();
            
            // 移除DOM元素
            if (elements.overlay && elements.overlay.parentNode) {
                elements.overlay.parentNode.removeChild(elements.overlay);
            }
            if (elements.controlPanel && elements.controlPanel.parentNode) {
                elements.controlPanel.parentNode.removeChild(elements.controlPanel);
            }

            // 重置状态
            elements = {
                canvas: null,
                ctx: null,
                controlPanel: null,
                mouseIndicator: null,
                overlay: null
            };
            timeline = [];
            mouseTrailPoints = [];
            playerState = {
                state: PlaybackState.STOPPED,
                currentTime: 0,
                totalDuration: 0,
                currentEventIndex: 0,
                progress: 0
            };
        }

        /**
         * 配置播放器
         */
        function configure(userConfig: Partial<PlayerConfig>): void {
            config = { ...defaults, ...userConfig };
        }

        /**
         * 加载并播放追踪数据
         */
        function load(trackingResults: any, userConfig?: Partial<PlayerConfig>): void {
            if (userConfig) {
                configure(userConfig);
            }

            buildTimeline(trackingResults);
            createPlayerUI();

            if (config.autoPlay) {
                play();
            }
        }

        /**
         * 获取播放器状态
         */
        function getState(): PlayerState {
            return { ...playerState };
        }

        // 返回公共API
        return {
            /** 配置播放器 */
            configure,
            /** 加载追踪数据 */
            load,
            /** 开始播放 */
            play,
            /** 暂停播放 */
            pause,
            /** 停止播放 */
            stop,
            /** 跳转到指定进度 */
            seekTo,
            /** 获取播放器状态 */
            getState,
            /** 销毁播放器 */
            destroy
        };
    })();

    // 在浏览器环境中将库挂载到全局对象
    if (typeof window !== 'undefined') {
        (window as any).userBehaviourPlayer = userBehaviourPlayer;
    }

    // 支持模块导出
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = userBehaviourPlayer;
    }

})(window);