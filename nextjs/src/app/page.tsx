'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [generatedImages, setGeneratedImages] = useState<{[key: string]: string}>({});
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});

  // 初始化用户行为分析
  useEffect(() => {
    // 确保只在客户端运行
    if (typeof window === 'undefined') {
      return;
    }

    // 动态导入user-behavior-analysis，避免SSR问题
    const initUserBehaviorAnalysis = async () => {
      try {
        // 动态加载脚本
        const script = document.createElement('script');
        script.src = '/user-behaviour.js'; // 我们需要将库文件放到public目录
        script.onload = () => {
          // 脚本加载完成后，使用全局变量
          const uba = (window as any).userBehaviour;
          
          if (!uba) {
            console.error('userBehaviour不可用');
            return;
          }
          
          // 配置用户行为追踪
          uba.config({
            // 配置后端接口地址
            sendUrl: 'api/track',
            // 应用标识
            appId: 'sarah-ai-journey',
            // 用户标识（可以从登录系统获取）
            userId: 'anonymous-user',
            // 是否启用调试模式
            debug: true,
            // 自动收集页面浏览事件
            autoSendEvents: true,
            // 自动收集点击事件
            clicks: true,
            // 自动收集滚动事件
            mouseScroll: true,
            // 自动收集表单提交事件
            formInteractions: true,
            // 数据处理回调函数
            processData: (results: any) => {
              console.log('用户行为数据:', results);
              // 这里可以发送数据到后端
              fetch('api/track', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  type: 'user_behavior',
                  data: results,
                  timestamp: new Date().toISOString(),
                  appId: 'sarah-ai-journey',
                  userId: 'anonymous-user'
                })
              }).catch(error => {
                console.error('发送用户行为数据失败:', error);
              });
            }
          });

          // 开始追踪
          uba.start();

          // 手动追踪页面加载事件
          uba.processResults();

          // 将实例保存到全局变量，以便在其他地方使用
          (window as any).uba = uba;
        };
        
        document.head.appendChild(script);
      } catch (error) {
        console.error('初始化用户行为分析失败:', error);
      }
    };

    initUserBehaviorAnalysis();

    return () => {
      // 清理工作
      const uba = (window as any).uba;
      if (uba && uba.stop) {
        uba.stop();
      }
    };
  }, []);

  // 保存API密钥
  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('siliconflow_api_key', apiKey);
      alert('API密钥已保存！');
      
      // 追踪API密钥保存事件
      const uba = (window as any).uba;
      if (uba) {
        // 手动触发数据处理来记录这个事件
        uba.processResults();
      }
    } else {
      alert('请输入有效的API密钥');
    }
  };

  // 复制内容到剪贴板
  const copyToClipboard = async () => {
    try {
      const content = document.getElementById('contentToCopy');
      if (!content) return;

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content.innerHTML;
      tempDiv.style.fontFamily = 'Noto Sans SC, sans-serif';
      tempDiv.style.fontSize = '14px';
      tempDiv.style.color = '#4B5563';
      tempDiv.style.lineHeight = '1.6';
      
      const htmlContent = `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Noto Sans SC', sans-serif; color: #4B5563; line-height: 1.6;">
          <h1 style="color: #1F2937; font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 8px;">
            从零到一：<span style="background: linear-gradient(to right, #4F46E5, #7C3AED); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Sarah</span> 的AI创造之旅
          </h1>
          <p style="color: #6B7280; font-size: 14px; text-align: center; margin-bottom: 24px;">
            一位产品经理如何用AI编程打造家庭健康管理平台，实现从使用者到创造者的蜕变
          </p>
          ${tempDiv.innerHTML}
          <div style="text-align: center; margin-top: 32px; padding: 24px; background: linear-gradient(to right, #4F46E5, #7C3AED); border-radius: 16px; color: white;">
            <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 12px;">每一个痛点，都可能是创造的起点</h2>
            <p style="opacity: 0.9; margin-bottom: 12px;">Sarah的故事告诉我们：无需深厚技术背景，只要有真实需求和持续行动，每个人都能用AI创造改变生活的工具。</p>
            <div style="font-size: 12px; opacity: 0.8;">Generated from Sarah's 6-month AI programming journey</div>
          </div>
        </div>
      `;
      
      const textContent = Array.from(document.querySelectorAll('.prompt-card')).map(card => {
        const title = card.querySelector('h2')?.textContent || '';
        const quote = card.querySelector('.highlight')?.textContent || '';
        const prompt = card.querySelector('span[id^="prompt"]')?.textContent || '';
        return `【${title}】\n${quote}\nPrompt: ${prompt}\n`;
      }).join('\n');
      
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([htmlContent], { type: 'text/html' }),
          'text/plain': new Blob([textContent], { type: 'text/plain' })
        })
      ]);
      
      // 追踪复制事件
      const uba = (window as any).uba;
      if (uba) {
        // 手动触发数据处理来记录这个事件
        uba.processResults();
      }
      
      alert('内容已复制到剪贴板！');
    } catch (err) {
      console.error('复制失败:', err);
      alert('复制失败，请重试');
    }
  };

  // 生成图片
  const generateImage = async (promptId: string, promptText: string) => {
    const savedKey = localStorage.getItem('siliconflow_api_key');
    if (!savedKey) {
      alert('请先设置API密钥！');
      return;
    }
    
    // 设置加载状态
    setLoadingStates(prev => ({ ...prev, [promptId]: true }));
    
    try {
      const url = 'https://api.siliconflow.cn/v1/images/generations';
      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${savedKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'Kwai-Kolors/Kolors',
          prompt: promptText,
          image_size: '1024x1024',
          batch_size: 1,
          num_inference_steps: 20,
          guidance_scale: 7.5
        })
      };
      
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setGeneratedImages(prev => ({ ...prev, [promptId]: data.data[0].url }));
        
        // 追踪图片生成成功事件
        const uba = (window as any).uba;
        if (uba) {
          // 手动触发数据处理来记录这个事件
          uba.processResults();
        }
      } else {
        throw new Error('No image URL returned');
      }
      
    } catch (error) {
      console.error('生成失败:', error);
      alert(`生成失败: ${error instanceof Error ? error.message : '未知错误'}\n请检查API密钥是否正确，或稍后重试。`);
      
      // 追踪图片生成失败事件
      const uba = (window as any).uba;
      if (uba) {
        // 手动触发数据处理来记录这个事件
        uba.processResults();
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, [promptId]: false }));
    }
  };

  // 处理按钮点击事件
  const handleButtonClick = (action: string, data?: any) => {
    const uba = (window as any).uba;
    if (uba) {
      // 手动触发数据处理来记录这个事件
      uba.processResults();
    }
  };

  const steps = [
    {
      id: '1',
      title: '灵感起源：Vibe Coding 的吸引力',
      description: 'Sarah被"Vibe Coding"理念吸引，决定学习AI编程，渴望亲手实现创意。',
      quote: '"我关注Mixlab很久了，AI编程看起来门槛不高，正好是个机会。"',
      prompt: 'A curious female product manager sitting at a modern desk, looking at a glowing AI interface labeled "Vibe Coding", surrounded by abstract digital waves and light particles, soft blue and purple tones, cinematic lighting, realistic style.'
    },
    {
      id: '2',
      title: '痛点触发：混乱的健康档案',
      description: '母亲就医时无法提供历史报告，激发了Sarah创建数字化健康档案的想法。',
      quote: '"我们在家翻箱倒柜找了半天，终于在一堆纸质资料里找到了...这过程太糟了。"',
      prompt: 'A woman and her elderly mother searching through piles of scattered medical reports and paper documents in a messy home office, looking stressed, warm indoor lighting, realistic photography style.'
    },
    {
      id: '3',
      title: '功能设计：四大核心模块',
      description: 'Sarah设计了家庭成员管理、健康档案、数据记录、用药与就诊管理四大功能。',
      quote: '"我想做一个地方，能把家人的所有健康资料都收集整理起来。"',
      prompt: 'A clean, modern web interface showing a family health dashboard with four sections: family members selector, health records upload, daily health data input (blood pressure, glucose), and medication schedule, minimalist UI, light theme, on a laptop screen.'
    },
    {
      id: '4',
      title: '技术创新：AI识别医疗报告',
      description: '通过AI自动识别上传的检查报告图片，提取关键指标并结构化。',
      quote: '"上传一张血常规报告，AI能识别出白细胞、红细胞、血小板等数值。"',
      prompt: 'Close-up of a smartphone screen showing a photo of a blood test report being uploaded, with AI scanning animation highlighting key values like WBC, RBC, Platelets, digital overlay with data extraction effect, futuristic tech style.'
    },
    {
      id: '5',
      title: '智能助手：健康AI对话',
      description: '集成AI健康助手，可基于历史数据提供基础咨询和提醒。',
      quote: '"我可以问AI：\'我刚才上传的报告有什么要注意的吗？\'"',
      prompt: 'A friendly AI chat interface on a mobile phone, showing a conversation between a user and a health assistant analyzing recent lab results, with icons for heart rate, blood pressure, and warning alerts, soft pastel colors.'
    },
    {
      id: '6',
      title: '家庭协同：全家参与健康管理',
      description: '全家共享平台，父母的血压、用药记录实时同步，提升管理效率。',
      quote: '"我妈妈每天量完血压，我会帮她记到网页里...医生觉得这些记录很有用。"',
      prompt: 'A family of three (middle-aged woman, elderly parents) using smartphones and a tablet, all viewing the same health dashboard with synchronized data, cozy living room setting, warm evening light, heartwarming atmosphere.'
    },
    {
      id: '7',
      title: '技术挑战：从本地存储到云端部署',
      description: '克服数据丢失问题，使用Supabase和Vercel实现数据持久化与在线访问。',
      quote: '"关掉网页再打开，所有数据都没了！后来学会了用Supabase做数据库。"',
      prompt: 'Split-screen image: left side shows a frustrated woman at a computer with "Data Lost" message; right side shows a deployment dashboard with Vercel and Supabase logos, green success checkmarks, and cloud sync animation, tech illustration style.'
    },
    {
      id: '8',
      title: '角色转变：从用户到创造者',
      description: 'Sarah完成了从产品需求方到独立开发者的转变，获得了前所未有的成就感。',
      quote: '"我从一个只会用别人东西的人，变成了能自己做东西的人。"',
      prompt: 'A woman standing confidently in front of a large transparent screen displaying her family health app, with code snippets and AI models floating around her, glowing light effect, symbolic of empowerment and creation, digital art style.'
    },
    {
      id: '9',
      title: '未来愿景：个性化健康建议',
      description: '计划让AI根据长期数据提供趋势分析和个性化健康提醒。',
      quote: '"我想让AI提醒我们哪个指标不太正常，该去看医生了。"',
      prompt: 'A futuristic health AI system analyzing long-term health trends across years, showing dynamic graphs of blood pressure and glucose levels, with alert icons and personalized recommendation cards, sci-fi UI design, dark theme with neon blue accents.'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            从零到一：<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Sarah</span> 的AI创造之旅
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            一位产品经理如何用AI编程打造家庭健康管理平台，实现从使用者到创造者的蜕变
          </p>
          
          {/* API Key Setting */}
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">设置AI生图API密钥</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="请输入您的 SiliconFlow API 密钥" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex-grow"
              />
              <button 
                onClick={() => {
                  saveApiKey();
                  handleButtonClick('save_api_key');
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg shadow transition-all duration-200 flex items-center space-x-2 whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>保存密钥</span>
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">密钥将仅保存在本地浏览器中，安全可靠</p>
          </div>

          {/* Copy Button */}
          <button 
            onClick={() => {
              copyToClipboard();
              handleButtonClick('copy_content');
            }}
            className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-2 px-4 rounded-lg shadow transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>复制富文本到剪切板</span>
          </button>
        </header>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <img src="https://placehold.co/800x300/6366f1/ffffff?text=AI+Programming+Journey" alt="AI编程之旅" className="w-full h-64 object-cover rounded-xl mb-6"/>
          <p className="text-gray-700 leading-relaxed">
            Sarah，一位非技术背景的产品经理，在参加AI编程训练营6个月后，成功开发出一个实用的家庭健康管理平台。这不仅是一个工具的诞生，更是一段从"需求提出者"到"产品创造者"的成长旅程。
          </p>
        </div>

        {/* Timeline of Prompts */}
        <div id="contentToCopy" className="space-y-12">
          {steps.map((step) => (
            <div key={step.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold">
                    {step.id}
                  </div>
                </div>
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">{step.title}</h2>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-400 p-4 italic text-gray-700">
                    {step.quote}
                  </div>
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg text-sm text-gray-800">
                    <strong>Prompt:</strong> 
                    <span id={`prompt${step.id}`}>{step.prompt}</span>
                  </div>
                  <button 
                    onClick={() => {
                      generateImage(`prompt${step.id}`, step.prompt);
                      handleButtonClick('generate_image', { step_id: step.id });
                    }}
                    disabled={loadingStates[`prompt${step.id}`]}
                    className="mt-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg shadow transition-all duration-200 flex items-center space-x-2"
                  >
                    {loadingStates[`prompt${step.id}`] ? (
                      <>
                        <svg className="animate-spin inline-block" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"/>
                          <path stroke="currentColor" strokeWidth="4" strokeLinecap="round" d="M12 6v6l4 2"/>
                        </svg>
                        <span>生成中...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>生成图片</span>
                      </>
                    )}
                  </button>
                  {generatedImages[`prompt${step.id}`] && (
                    <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <img src={generatedImages[`prompt${step.id}`]} alt="生成的图片" className="max-w-full h-auto mx-auto rounded-lg" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-4">每一个痛点，都可能是创造的起点</h2>
            <p className="text-indigo-100 mb-6">
              Sarah的故事告诉我们：无需深厚技术背景，只要有真实需求和持续行动，每个人都能用AI创造改变生活的工具。
            </p>
            <div className="text-sm opacity-90">
              Generated from Sarah's 6-month AI programming journey
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
