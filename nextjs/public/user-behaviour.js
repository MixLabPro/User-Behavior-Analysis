"use strict";
var userBehaviour = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // userBehaviour.ts
  var require_userBehaviour = __commonJS({
    "userBehaviour.ts"(exports, module) {
      (function(window2) {
        const userBehaviour = function() {
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
            processData: function(results2) {
              console.log(results2);
            },
            autoSendEvents: false,
            sendUrl: ""
          };
          let userConfig = {};
          const mem = {
            processInterval: null,
            mouseInterval: null,
            mousePosition: [],
            // [x坐标, y坐标, 时间戳]
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
                const scrollData = [window2.scrollX, window2.scrollY, getTimeStamp()];
                results.mouseScroll.push(scrollData);
                sendEventData("scroll", scrollData);
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
                e.composedPath().forEach((el, i) => {
                  const element = el;
                  if (i !== e.composedPath().length - 1 && i !== e.composedPath().length - 2) {
                    node = element.localName || "";
                    if (element.className && typeof element.className === "string") {
                      element.classList.forEach((clE) => {
                        node += "." + clE;
                      });
                    }
                    if (element.id) {
                      node += "#" + element.id;
                    }
                    path.push(node);
                  }
                });
                const elementSummary = getElementSummary(e.target);
                const clickDetail = [e.clientX, e.clientY, elementSummary, getTimeStamp()];
                results.clicks.clickDetails.push(clickDetail);
                sendEventData("click", clickDetail);
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
                const windowSize = [window2.innerWidth, window2.innerHeight, getTimeStamp()];
                results.windowSizes.push(windowSize);
                sendEventData("windowResize", windowSize);
              },
              /**
               * 页面可见性变化事件处理函数
               * 记录可见性状态变化并处理结果
               * @param e 事件对象
               */
              visibilitychange: (e) => {
                const visibilityChange = [document.visibilityState, getTimeStamp()];
                results.visibilitychanges.push(visibilityChange);
                sendEventData("visibilitychange", visibilityChange);
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
                sendEventData("keyboardActivity", keyboardActivity);
              },
              /**
               * 输入活动事件处理函数
               * 记录输入框的内容变化和时间戳
               * @param e 输入事件对象
               */
              inputActivity: (e) => {
                const target = e.target;
                const elementSummary = getElementSummary(e.target);
                const inputValue = target.value || "";
                const inputActivity = [inputValue, elementSummary, getTimeStamp()];
                results.keyboardActivities.push(inputActivity);
                sendEventData("inputActivity", inputActivity);
              },
              /**
               * 页面导航事件处理函数
               * 记录页面URL变化和时间戳
               */
              pageNavigation: () => {
                const navigationHistory = [location.href, getTimeStamp()];
                results.navigationHistory.push(navigationHistory);
                sendEventData("pageNavigation", navigationHistory);
              },
              /**
               * 表单交互事件处理函数
               * 记录表单提交事件
               * @param e 事件对象
               */
              formInteraction: (e) => {
                e.preventDefault();
                const elementSummary = getElementSummary(e.target);
                const formInteraction = [elementSummary, getTimeStamp()];
                results.formInteractions.push(formInteraction);
                sendEventData("formInteraction", formInteraction);
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
                  const touchEventData = ["touchstart", touch.clientX, touch.clientY, elementSummary, getTimeStamp()];
                  results.touchEvents.push(touchEventData);
                  sendEventData("touchStart", touchEventData);
                }
              },
              /**
               * 媒体交互事件处理函数
               * 记录媒体播放事件
               * @param e 事件对象
               */
              mediaInteraction: (e) => {
                const target = e.target;
                const mediaInteraction = [e.type, target.currentSrc || "", getTimeStamp()];
                results.mediaInteractions.push(mediaInteraction);
                sendEventData("mediaInteraction", mediaInteraction);
              }
            }
          };
          let results = {};
          function resetResults() {
            results = {
              userInfo: {
                windowSize: [window2.innerWidth, window2.innerHeight],
                appCodeName: navigator.appCodeName || "",
                appName: navigator.appName || "",
                vendor: navigator.vendor || "",
                platform: navigator.platform || "",
                userAgent: navigator.userAgent || ""
              },
              time: {
                startTime: 0,
                currentTime: 0,
                stopTime: 0
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
              visibilitychanges: []
            };
          }
          resetResults();
          function getElementSummary(element) {
            if (!element || !(element instanceof HTMLElement)) {
              return {
                tagName: "",
                id: "",
                className: "",
                name: "",
                value: "",
                textContent: ""
              };
            }
            const target = element;
            return {
              tagName: target.tagName || "",
              id: target.id || "",
              className: typeof target.className === "string" ? target.className : "",
              name: target.getAttribute("name") || "",
              value: target.value === void 0 || target.value === null ? "" : String(target.value),
              textContent: target.textContent?.trim() || ""
            };
          }
          function sendEventData(eventType, data) {
            if (userConfig.autoSendEvents && userConfig.sendUrl) {
              const payload = {
                type: eventType,
                data,
                timestamp: getTimeStamp(),
                url: location.href,
                userInfo: results.userInfo
                // 附加用户信息以便后台分析
              };
              try {
                if (navigator.sendBeacon) {
                  console.log(`Sending event data to ${userConfig.sendUrl}`, payload);
                  navigator.sendBeacon(userConfig.sendUrl, JSON.stringify(payload));
                }
              } catch (error) {
                console.error("Failed to send event data:", error);
              }
            }
          }
          function getTimeStamp() {
            const now = /* @__PURE__ */ new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, "0");
            const day = now.getDate().toString().padStart(2, "0");
            const hours = now.getHours().toString().padStart(2, "0");
            const minutes = now.getMinutes().toString().padStart(2, "0");
            const seconds = now.getSeconds().toString().padStart(2, "0");
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
          }
          function config(ob) {
            userConfig = {};
            Object.keys(defaults).forEach((key) => {
              const value = key in ob ? ob[key] : defaults[key];
              userConfig[key] = value;
            });
          }
          function start() {
            if (Object.keys(userConfig).length !== Object.keys(defaults).length) {
              console.log("no config provided. using default..");
              userConfig = defaults;
            }
            if (userConfig.timeCount !== void 0 && userConfig.timeCount) {
              results.time.startTime = getTimeStamp();
            }
            if (userConfig.mouseMovement) {
              window2.addEventListener("mousemove", mem.eventsFunctions.mouseMovement);
              mem.mouseInterval = window2.setInterval(() => {
                if (mem.mousePosition && mem.mousePosition.length) {
                  const lastMovement = results.mouseMovements[results.mouseMovements.length - 1];
                  if (!results.mouseMovements.length || mem.mousePosition[0] !== lastMovement[0] && mem.mousePosition[1] !== lastMovement[1]) {
                    const mousePosition = mem.mousePosition;
                    results.mouseMovements.push(mousePosition);
                    sendEventData("mouseMovement", mousePosition);
                  }
                }
              }, defaults.mouseMovementInterval * 1e3);
            }
            if (userConfig.clicks) {
              window2.addEventListener("click", mem.eventsFunctions.click);
            }
            if (userConfig.mouseScroll) {
              window2.addEventListener("scroll", mem.eventsFunctions.scroll);
            }
            if (userConfig.windowResize !== false) {
              window2.addEventListener("resize", mem.eventsFunctions.windowResize);
            }
            if (userConfig.visibilitychange !== false) {
              window2.addEventListener("visibilitychange", mem.eventsFunctions.visibilitychange);
            }
            if (userConfig.keyboardActivity) {
              window2.addEventListener("keydown", mem.eventsFunctions.keyboardActivity);
              document.addEventListener("input", mem.eventsFunctions.inputActivity);
            }
            if (userConfig.pageNavigation) {
              const originalPushState = window2.history.pushState;
              window2.history.pushState = function pushState(data, unused, url) {
                const ret = originalPushState.call(this, data, unused, url);
                window2.dispatchEvent(new Event("pushstate"));
                window2.dispatchEvent(new Event("locationchange"));
                return ret;
              };
              window2.addEventListener("popstate", mem.eventsFunctions.pageNavigation);
              window2.addEventListener("pushstate", mem.eventsFunctions.pageNavigation);
              window2.addEventListener("locationchange", mem.eventsFunctions.pageNavigation);
            }
            if (userConfig.formInteractions) {
              document.querySelectorAll("form").forEach(
                (form) => form.addEventListener("submit", mem.eventsFunctions.formInteraction)
              );
            }
            if (userConfig.touchEvents) {
              window2.addEventListener("touchstart", mem.eventsFunctions.touchStart);
            }
            if (userConfig.audioVideoInteraction) {
              document.querySelectorAll("video, audio").forEach((media) => {
                media.addEventListener("play", mem.eventsFunctions.mediaInteraction);
                media.addEventListener("pause", mem.eventsFunctions.mediaInteraction);
                media.addEventListener("ended", mem.eventsFunctions.mediaInteraction);
                media.addEventListener("timeupdate", mem.eventsFunctions.mediaInteraction);
              });
            }
            if (typeof userConfig.processTime === "number" && userConfig.processTime > 0) {
              mem.processInterval = window2.setInterval(() => {
                processResults();
              }, userConfig.processTime * 1e3);
            }
          }
          function processResults() {
            userConfig.processData(result());
            if (userConfig.clearAfterProcess) {
              resetResults();
            }
          }
          function stop() {
            if (mem.processInterval !== null) {
              clearInterval(mem.processInterval);
            }
            if (mem.mouseInterval !== null) {
              clearInterval(mem.mouseInterval);
            }
            window2.removeEventListener("scroll", mem.eventsFunctions.scroll);
            window2.removeEventListener("click", mem.eventsFunctions.click);
            window2.removeEventListener("mousemove", mem.eventsFunctions.mouseMovement);
            window2.removeEventListener("resize", mem.eventsFunctions.windowResize);
            window2.removeEventListener("visibilitychange", mem.eventsFunctions.visibilitychange);
            window2.removeEventListener("keydown", mem.eventsFunctions.keyboardActivity);
            document.removeEventListener("input", mem.eventsFunctions.inputActivity);
            window2.removeEventListener("touchstart", mem.eventsFunctions.touchStart);
            if (userConfig.audioVideoInteraction) {
              document.querySelectorAll("video, audio").forEach((media) => {
                media.removeEventListener("play", mem.eventsFunctions.mediaInteraction);
                media.removeEventListener("pause", mem.eventsFunctions.mediaInteraction);
                media.removeEventListener("ended", mem.eventsFunctions.mediaInteraction);
                media.removeEventListener("timeupdate", mem.eventsFunctions.mediaInteraction);
              });
            }
            results.time.stopTime = getTimeStamp();
            processResults();
          }
          function result() {
            if (userConfig.userInfo === false && results.userInfo !== void 0) {
              delete results.userInfo;
            }
            if (userConfig.timeCount !== void 0 && userConfig.timeCount) {
              results.time.currentTime = getTimeStamp();
            }
            return results;
          }
          function showConfig() {
            if (Object.keys(userConfig).length !== Object.keys(defaults).length) {
              return defaults;
            } else {
              return userConfig;
            }
          }
          function registerCustomEvent(eventName, callback) {
            window2.addEventListener(eventName, callback);
          }
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
            registerCustomEvent
          };
        }();
        if (typeof window2 !== "undefined") {
          window2.userBehaviour = userBehaviour;
        }
        if (typeof module !== "undefined" && module.exports) {
          module.exports = userBehaviour;
        }
      })(window);
    }
  });
  return require_userBehaviour();
})();
