// 全局变量
let isTyping = false;
let messageCount = 0;
let currentTheme = 'dark';
let currentModel = 'gpt-3.5';
let sidebarCollapsed = false;
let currentChatMode = 'balanced';
let currentResponseLength = 'medium';
let currentLanguageStyle = 'friendly';

// DOM元素
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messagesContainer = document.getElementById('messagesContainer');
const typingIndicator = document.getElementById('typingIndicator');
const themeToggle = document.getElementById('themeToggle');
const aiModelSelect = document.getElementById('aiModel');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const chatModeSelect = document.getElementById('chatMode');
const responseLengthSelect = document.getElementById('responseLength');
const languageStyleSelect = document.getElementById('languageStyle');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    adjustTextareaHeight();
    loadSettings();
    updateThemeIcon();
    updateSidebarIcon();
});

// 事件监听器
function initializeEventListeners() {
    // 输入框事件
    messageInput.addEventListener('input', handleInput);
    messageInput.addEventListener('keydown', handleKeyDown);
    messageInput.addEventListener('paste', handlePaste);
    
    // 发送按钮事件
    sendButton.addEventListener('click', sendMessage);
    
    // 主题切换事件
    themeToggle.addEventListener('click', toggleTheme);
    
    // AI模型切换事件
    aiModelSelect.addEventListener('change', handleModelChange);
    
    // 对话配置切换事件
    chatModeSelect.addEventListener('change', handleChatModeChange);
    responseLengthSelect.addEventListener('change', handleResponseLengthChange);
    languageStyleSelect.addEventListener('change', handleLanguageStyleChange);
    
    // 侧边栏切换事件
    sidebarToggle.addEventListener('click', toggleSidebar);
    
    // 模型选择器交互效果
    setupModelSelectorInteractions();
    
    // 窗口大小变化
    window.addEventListener('resize', adjustTextareaHeight);
}

// 处理输入
function handleInput() {
    const text = messageInput.value.trim();
    sendButton.disabled = text.length === 0;
    adjustTextareaHeight();
}

// 处理键盘事件
function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!sendButton.disabled && !isTyping) {
            sendMessage();
        }
    }
}

// 处理粘贴事件
function handlePaste(e) {
    setTimeout(() => {
        adjustTextareaHeight();
        handleInput();
    }, 0);
}

// 调整文本域高度
function adjustTextareaHeight() {
    messageInput.style.height = 'auto';
    const scrollHeight = messageInput.scrollHeight;
    const maxHeight = 120;
    messageInput.style.height = Math.min(scrollHeight, maxHeight) + 'px';
}

// 发送消息
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || isTyping) return;
    
    // 隐藏欢迎消息
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.style.display = 'none';
    }
    
    // 添加用户消息
    addMessage(message, 'user');
    
    // 清空输入框
    messageInput.value = '';
    sendButton.disabled = true;
    adjustTextareaHeight();
    
    // 显示打字指示器
    showTypingIndicator();
    
    // 模拟AI回复
    setTimeout(() => {
        hideTypingIndicator();
        const aiResponse = generateAIResponse(message);
        addMessage(aiResponse, 'assistant');
    }, 1000 + Math.random() * 2000); // 1-3秒随机延迟
}

// 添加消息到界面
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = text;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = getCurrentTime();
    
    content.appendChild(textDiv);
    content.appendChild(timeDiv);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    messageCount++;
}

// 显示打字指示器
function showTypingIndicator() {
    isTyping = true;
    typingIndicator.classList.add('show');
    scrollToBottom();
}

// 隐藏打字指示器
function hideTypingIndicator() {
    isTyping = false;
    typingIndicator.classList.remove('show');
}

// 滚动到底部
function scrollToBottom() {
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

// 获取当前时间
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// 生成AI回复
function generateAIResponse(userMessage) {
    const responses = [
        "这是一个很有趣的问题！让我来帮你分析一下。",
        "我理解你的想法。基于我的知识，我认为...",
        "这是一个很好的观点。让我从不同角度来思考这个问题。",
        "感谢你的提问！这确实是一个值得深入探讨的话题。",
        "我明白你的意思。让我为你详细解释一下。",
        "这是一个复杂的问题，需要从多个方面来考虑。",
        "你的问题很有启发性！让我分享一下我的看法。",
        "这确实是一个值得思考的问题。基于我的理解...",
        "我很高兴能帮助你解答这个问题。",
        "这是一个很好的问题！让我为你提供一些见解。"
    ];
    
    // 根据用户消息内容生成更相关的回复
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('你好') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
        return "你好！很高兴见到你！有什么我可以帮助你的吗？";
    }
    
    if (lowerMessage.includes('谢谢') || lowerMessage.includes('thank')) {
        return "不客气！我很高兴能帮助你。如果还有其他问题，随时可以问我！";
    }
    
    if (lowerMessage.includes('再见') || lowerMessage.includes('bye')) {
        return "再见！期待下次与你交流。祝你愉快！";
    }
    
    if (lowerMessage.includes('帮助') || lowerMessage.includes('help')) {
        return "我很乐意帮助你！你可以问我任何问题，我会尽力为你提供有用的信息和建议。";
    }
    
    if (lowerMessage.includes('天气')) {
        return "我无法获取实时天气信息，但我建议你查看当地的天气预报应用或网站来获取准确的天气信息。";
    }
    
    if (lowerMessage.includes('时间')) {
        return `现在的时间是 ${getCurrentTime()}。`;
    }
    
    if (lowerMessage.includes('代码') || lowerMessage.includes('编程')) {
        return "我很乐意帮助你解决编程问题！请告诉我具体遇到了什么技术难题，我会尽力为你提供解决方案。";
    }
    
    if (lowerMessage.includes('学习') || lowerMessage.includes('教育')) {
        return "学习是一个持续的过程！我很高兴能成为你学习路上的伙伴。有什么特定的学习目标或问题吗？";
    }
    
    if (lowerMessage.includes('工作') || lowerMessage.includes('职业')) {
        return "职业发展是一个重要的话题。无论是职业规划、技能提升还是工作相关的问题，我都可以为你提供建议。";
    }
    
    if (lowerMessage.includes('健康') || lowerMessage.includes('医疗')) {
        return "健康是最重要的！不过请注意，我不能提供具体的医疗建议。如果有健康问题，建议咨询专业医生。";
    }
    
    // 默认随机回复
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const additionalThought = generateAdditionalThought(userMessage);
    
    return randomResponse + " " + additionalThought;
}

// 生成额外的思考内容
function generateAdditionalThought(userMessage) {
    const thoughts = [
        "你觉得这个观点怎么样？",
        "你有什么其他的想法吗？",
        "这让我想到了另一个相关的概念。",
        "从另一个角度来看，这个问题也很有趣。",
        "我很好奇你对这个问题的看法。",
        "这确实是一个值得深入讨论的话题。",
        "我想听听你的想法。",
        "你觉得这个解释清楚吗？"
    ];
    
    return thoughts[Math.floor(Math.random() * thoughts.length)];
}

// 新对话功能
document.querySelector('.new-chat-btn').addEventListener('click', function() {
    // 清空消息容器
    messagesContainer.innerHTML = `
        <div class="welcome-message">
            <div class="welcome-content">
                <h2>你好！我是AI助手</h2>
                <p>有什么我可以帮助你的吗？</p>
            </div>
        </div>
    `;
    
    // 重置状态
    messageCount = 0;
    isTyping = false;
    messageInput.value = '';
    sendButton.disabled = true;
    adjustTextareaHeight();
    
    // 更新聊天历史
    updateChatHistory();
});

// 更新聊天历史
function updateChatHistory() {
    const chatHistory = document.querySelector('.chat-history');
    const newChatItem = document.createElement('div');
    newChatItem.className = 'chat-item active';
    newChatItem.innerHTML = `
        <i class="fas fa-message"></i>
        <span>新对话 ${new Date().toLocaleDateString()}</span>
    `;
    
    // 移除其他活跃状态
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 添加新对话项
    chatHistory.insertBefore(newChatItem, chatHistory.firstChild);
}

// 移动端侧边栏切换（如果需要的话）
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

// 导出功能（可选）
function exportChat() {
    const messages = document.querySelectorAll('.message');
    let chatText = 'AI聊天记录\n================\n\n';
    
    messages.forEach(message => {
        const sender = message.classList.contains('user') ? '用户' : 'AI助手';
        const text = message.querySelector('.message-text').textContent;
        const time = message.querySelector('.message-time').textContent;
        
        chatText += `[${time}] ${sender}: ${text}\n\n`;
    });
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// 添加一些实用的快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter 发送消息
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!sendButton.disabled && !isTyping) {
            sendMessage();
        }
    }
    
    // Escape 清空输入框
    if (e.key === 'Escape') {
        messageInput.value = '';
        sendButton.disabled = true;
        adjustTextareaHeight();
        messageInput.focus();
    }
});

// 主题切换功能
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    saveSettings();
}

// 更新主题图标
function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (currentTheme === 'dark') {
        icon.className = 'fas fa-moon';
        themeToggle.title = '切换到白天模式';
    } else {
        icon.className = 'fas fa-sun';
        themeToggle.title = '切换到暗夜模式';
    }
}

// AI模型切换功能
function handleModelChange() {
    currentModel = aiModelSelect.value;
    saveSettings();
    
    // 显示模型切换提示
    showModelChangeNotification();
    
    // 添加切换动画效果
    const modelSelector = document.querySelector('.config-selector');
    modelSelector.style.transform = 'scale(0.98)';
    setTimeout(() => {
        modelSelector.style.transform = 'scale(1)';
    }, 150);
}

// 对话模式切换功能
function handleChatModeChange() {
    currentChatMode = chatModeSelect.value;
    saveSettings();
    showConfigChangeNotification('对话模式', currentChatMode);
}

// 回复长度切换功能
function handleResponseLengthChange() {
    currentResponseLength = responseLengthSelect.value;
    saveSettings();
    showConfigChangeNotification('回复长度', currentResponseLength);
}

// 语言风格切换功能
function handleLanguageStyleChange() {
    currentLanguageStyle = languageStyleSelect.value;
    saveSettings();
    showConfigChangeNotification('语言风格', currentLanguageStyle);
}

// 显示配置变更通知
function showConfigChangeNotification(configType, value) {
    const configNames = {
        'balanced': '平衡模式',
        'creative': '创意模式',
        'precise': '精确模式',
        'casual': '休闲模式',
        'professional': '专业模式',
        'short': '简短',
        'medium': '中等',
        'long': '详细',
        'auto': '自动',
        'formal': '正式',
        'friendly': '友好',
        'technical': '技术性',
        'casual': '随意',
        'academic': '学术'
    };
    
    const notification = document.createElement('div');
    notification.className = 'config-notification';
    notification.textContent = `${configType}已切换到 ${configNames[value] || value}`;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--accent-color);
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: var(--shadow);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// 显示模型切换通知
function showModelChangeNotification() {
    const modelNames = {
        'gpt-3.5': 'GPT-3.5 Turbo',
        'gpt-4': 'GPT-4',
        'gpt-4-turbo': 'GPT-4 Turbo',
        'gpt-4o': 'GPT-4o',
        'claude-3-haiku': 'Claude 3 Haiku',
        'claude-3-sonnet': 'Claude 3 Sonnet',
        'claude-3-opus': 'Claude 3 Opus',
        'gemini-pro': 'Gemini Pro',
        'gemini-ultra': 'Gemini Ultra',
        'llama-2': 'Llama 2',
        'llama-3': 'Llama 3',
        'mistral': 'Mistral',
        'cohere': 'Cohere',
        'palm-2': 'PaLM 2',
        'custom': '自定义模型'
    };
    
    const notification = document.createElement('div');
    notification.className = 'model-notification';
    notification.textContent = `已切换到 ${modelNames[currentModel]}`;
    
    // 添加通知样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--accent-color);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: var(--shadow);
    `;
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 保存设置到本地存储
function saveSettings() {
    const settings = {
        theme: currentTheme,
        model: currentModel,
        sidebarCollapsed: sidebarCollapsed,
        chatMode: currentChatMode,
        responseLength: currentResponseLength,
        languageStyle: currentLanguageStyle
    };
    localStorage.setItem('aiChatSettings', JSON.stringify(settings));
}

// 从本地存储加载设置
function loadSettings() {
    const savedSettings = localStorage.getItem('aiChatSettings');
    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);
            currentTheme = settings.theme || 'dark';
            currentModel = settings.model || 'gpt-3.5';
            sidebarCollapsed = settings.sidebarCollapsed || false;
            currentChatMode = settings.chatMode || 'balanced';
            currentResponseLength = settings.responseLength || 'medium';
            currentLanguageStyle = settings.languageStyle || 'friendly';
            
            // 应用设置
            document.documentElement.setAttribute('data-theme', currentTheme);
            aiModelSelect.value = currentModel;
            chatModeSelect.value = currentChatMode;
            responseLengthSelect.value = currentResponseLength;
            languageStyleSelect.value = currentLanguageStyle;
            
            // 应用侧边栏状态
            if (window.innerWidth > 768) {
                // 桌面端
                if (sidebarCollapsed) {
                    sidebar.classList.add('collapsed');
                    mainContent.classList.add('expanded');
                } else {
                    sidebar.classList.remove('collapsed');
                    mainContent.classList.remove('expanded');
                }
            } else {
                // 移动端
                if (sidebarCollapsed) {
                    sidebar.classList.add('open');
                } else {
                    sidebar.classList.remove('open');
                }
            }
        } catch (e) {
            console.warn('Failed to load settings:', e);
        }
    }
}

// 根据当前模型生成AI回复
function generateAIResponse(userMessage) {
    const modelResponses = {
        'gpt-3.5': generateGPT35Response(userMessage),
        'gpt-4': generateGPT4Response(userMessage),
        'gpt-4-turbo': generateGPT4TurboResponse(userMessage),
        'gpt-4o': generateGPT4oResponse(userMessage),
        'claude-3-haiku': generateClaude3HaikuResponse(userMessage),
        'claude-3-sonnet': generateClaude3SonnetResponse(userMessage),
        'claude-3-opus': generateClaude3OpusResponse(userMessage),
        'gemini-pro': generateGeminiProResponse(userMessage),
        'gemini-ultra': generateGeminiUltraResponse(userMessage),
        'llama-2': generateLlama2Response(userMessage),
        'llama-3': generateLlama3Response(userMessage),
        'mistral': generateMistralResponse(userMessage),
        'cohere': generateCohereResponse(userMessage),
        'palm-2': generatePaLM2Response(userMessage),
        'custom': generateCustomResponse(userMessage)
    };
    
    return modelResponses[currentModel] || modelResponses['gpt-3.5'];
}

// GPT-3.5 回复风格
function generateGPT35Response(userMessage) {
    const responses = [
        "这是一个很好的问题！让我来帮你分析一下。",
        "我理解你的想法。基于我的知识，我认为...",
        "这是一个有趣的观点。让我从不同角度来思考这个问题。",
        "感谢你的提问！这确实是一个值得深入探讨的话题。",
        "我明白你的意思。让我为你详细解释一下。"
    ];
    
    return getContextualResponse(userMessage, responses, "GPT-3.5");
}

// GPT-4 回复风格
function generateGPT4Response(userMessage) {
    const responses = [
        "这是一个复杂而深刻的问题。让我从多个维度来为你分析...",
        "基于最新的研究和我的深度理解，我认为这个问题涉及...",
        "这是一个非常有挑战性的问题。让我为你提供一个全面的解答...",
        "你的问题触及了核心问题。让我从理论和实践两个层面来回答...",
        "这是一个需要深入思考的问题。让我为你提供一个详细而准确的分析..."
    ];
    
    return getContextualResponse(userMessage, responses, "GPT-4");
}

// Claude 回复风格
function generateClaudeResponse(userMessage) {
    const responses = [
        "我理解你的问题。让我以清晰、准确的方式来回答...",
        "这是一个重要的问题。我会尽力为你提供一个有帮助的回答...",
        "让我仔细思考一下你的问题，然后给你一个全面的回答...",
        "你的问题很有价值。让我从多个角度来为你分析...",
        "这是一个值得深入探讨的话题。让我为你提供一个详细的解释..."
    ];
    
    return getContextualResponse(userMessage, responses, "Claude");
}

// Gemini 回复风格
function generateGeminiResponse(userMessage) {
    const responses = [
        "这是一个很棒的问题！让我为你提供一个全面的回答...",
        "我理解你的需求。基于我的知识，我可以为你提供...",
        "这是一个有趣的话题。让我从不同角度来为你分析...",
        "感谢你的提问！让我为你详细解释一下这个概念...",
        "你的问题很有启发性。让我为你提供一个清晰的解答..."
    ];
    
    return getContextualResponse(userMessage, responses, "Gemini");
}

// GPT-4 Turbo 回复风格
function generateGPT4TurboResponse(userMessage) {
    const responses = [
        "基于GPT-4 Turbo的强大能力，让我为你提供一个快速而准确的回答...",
        "作为GPT-4 Turbo，我能够以更快的速度为你提供高质量的分析...",
        "利用我的Turbo优化，让我为你详细解答这个问题...",
        "基于我的增强处理能力，我认为这个问题需要从以下角度来考虑...",
        "作为最新版本的GPT-4 Turbo，我为你提供以下见解..."
    ];
    
    return getContextualResponse(userMessage, responses, "GPT-4 Turbo");
}

// GPT-4o 回复风格
function generateGPT4oResponse(userMessage) {
    const responses = [
        "作为GPT-4o，我具备多模态能力，让我为你提供一个全面的回答...",
        "基于我的多模态理解能力，我认为这个问题涉及多个方面...",
        "作为最新的GPT-4o模型，我能够从文本、图像等多个角度来分析...",
        "利用我的先进AI能力，让我为你提供最准确的解答...",
        "基于我的最新技术，我为你提供以下专业见解..."
    ];
    
    return getContextualResponse(userMessage, responses, "GPT-4o");
}

// Claude 3 Haiku 回复风格
function generateClaude3HaikuResponse(userMessage) {
    const responses = [
        "作为Claude 3 Haiku，我以简洁而深刻的方式为你回答...",
        "基于我的快速处理能力，让我为你提供一个精炼的回答...",
        "作为Haiku模型，我擅长用最简洁的语言表达最深刻的见解...",
        "利用我的高效算法，让我为你快速分析这个问题...",
        "基于我的轻量级设计，我为你提供以下精准回答..."
    ];
    
    return getContextualResponse(userMessage, responses, "Claude 3 Haiku");
}

// Claude 3 Sonnet 回复风格
function generateClaude3SonnetResponse(userMessage) {
    const responses = [
        "作为Claude 3 Sonnet，我以平衡的性能和准确性为你回答...",
        "基于我的中等规模设计，让我为你提供一个全面的分析...",
        "作为Sonnet模型，我擅长在速度和深度之间找到最佳平衡...",
        "利用我的优化架构，让我为你详细解答这个问题...",
        "基于我的平衡性能，我为你提供以下专业见解..."
    ];
    
    return getContextualResponse(userMessage, responses, "Claude 3 Sonnet");
}

// Claude 3 Opus 回复风格
function generateClaude3OpusResponse(userMessage) {
    const responses = [
        "作为Claude 3 Opus，我以最强大的能力为你提供最深入的分析...",
        "基于我的最高性能配置，让我为你提供一个全面而深刻的回答...",
        "作为Opus模型，我擅长处理最复杂和最具挑战性的问题...",
        "利用我的顶级AI能力，让我为你提供最准确的解答...",
        "基于我的最强性能，我为你提供以下深度见解..."
    ];
    
    return getContextualResponse(userMessage, responses, "Claude 3 Opus");
}

// Gemini Pro 回复风格
function generateGeminiProResponse(userMessage) {
    const responses = [
        "作为Gemini Pro，我以Google的先进技术为你提供回答...",
        "基于我的多模态能力，让我为你分析这个问题...",
        "作为Google的Gemini Pro，我能够从多个角度来理解你的问题...",
        "利用我的先进AI技术，让我为你提供专业的解答...",
        "基于我的创新算法，我为你提供以下见解..."
    ];
    
    return getContextualResponse(userMessage, responses, "Gemini Pro");
}

// Gemini Ultra 回复风格
function generateGeminiUltraResponse(userMessage) {
    const responses = [
        "作为Gemini Ultra，我以Google最强大的AI能力为你回答...",
        "基于我的顶级性能，让我为你提供一个全面而深入的分析...",
        "作为Google的旗舰模型，我能够处理最复杂的推理任务...",
        "利用我的最先进技术，让我为你提供最准确的解答...",
        "基于我的最高性能，我为你提供以下深度见解..."
    ];
    
    return getContextualResponse(userMessage, responses, "Gemini Ultra");
}

// Llama 2 回复风格
function generateLlama2Response(userMessage) {
    const responses = [
        "作为Llama 2，我以Meta的开源技术为你提供回答...",
        "基于我的开源架构，让我为你分析这个问题...",
        "作为Meta的Llama 2，我以开放和透明的方式为你解答...",
        "利用我的开源优势，让我为你提供可靠的回答...",
        "基于我的开放设计，我为你提供以下见解..."
    ];
    
    return getContextualResponse(userMessage, responses, "Llama 2");
}

// Llama 3 回复风格
function generateLlama3Response(userMessage) {
    const responses = [
        "作为Llama 3，我以Meta最新的开源技术为你提供回答...",
        "基于我的最新架构，让我为你分析这个问题...",
        "作为Meta的最新模型，我以更强大的能力为你解答...",
        "利用我的最新优化，让我为你提供更准确的回答...",
        "基于我的最新技术，我为你提供以下见解..."
    ];
    
    return getContextualResponse(userMessage, responses, "Llama 3");
}

// Mistral 回复风格
function generateMistralResponse(userMessage) {
    const responses = [
        "作为Mistral，我以欧洲的AI技术为你提供回答...",
        "基于我的高效架构，让我为你分析这个问题...",
        "作为Mistral AI的模型，我以简洁而有效的方式为你解答...",
        "利用我的优化设计，让我为你提供精准的回答...",
        "基于我的高效算法，我为你提供以下见解..."
    ];
    
    return getContextualResponse(userMessage, responses, "Mistral");
}

// Cohere 回复风格
function generateCohereResponse(userMessage) {
    const responses = [
        "作为Cohere，我以企业级AI技术为你提供回答...",
        "基于我的商业级能力，让我为你分析这个问题...",
        "作为Cohere的模型，我专注于实用和可靠的AI应用...",
        "利用我的企业级优化，让我为你提供专业的回答...",
        "基于我的商业级设计，我为你提供以下见解..."
    ];
    
    return getContextualResponse(userMessage, responses, "Cohere");
}

// PaLM 2 回复风格
function generatePaLM2Response(userMessage) {
    const responses = [
        "作为PaLM 2，我以Google的Pathways技术为你提供回答...",
        "基于我的Pathways架构，让我为你分析这个问题...",
        "作为Google的PaLM 2，我以大规模语言模型的能力为你解答...",
        "利用我的Pathways优势，让我为你提供准确的回答...",
        "基于我的大规模训练，我为你提供以下见解..."
    ];
    
    return getContextualResponse(userMessage, responses, "PaLM 2");
}

// 自定义模型回复风格
function generateCustomResponse(userMessage) {
    const responses = [
        "根据我的自定义配置，我来为你回答这个问题...",
        "基于我的个性化设置，我认为...",
        "根据我的定制化理解，让我为你分析...",
        "我的自定义模型为你提供以下见解...",
        "基于我的特殊配置，我建议..."
    ];
    
    return getContextualResponse(userMessage, responses, "自定义模型");
}

// 获取上下文相关的回复
function getContextualResponse(userMessage, responses, modelName) {
    const lowerMessage = userMessage.toLowerCase();
    
    // 问候语
    if (lowerMessage.includes('你好') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
        return `你好！我是${modelName}，很高兴为你服务！有什么我可以帮助你的吗？`;
    }
    
    // 感谢
    if (lowerMessage.includes('谢谢') || lowerMessage.includes('thank')) {
        return `不客气！作为${modelName}，我很高兴能帮助你。如果还有其他问题，随时可以问我！`;
    }
    
    // 再见
    if (lowerMessage.includes('再见') || lowerMessage.includes('bye')) {
        return `再见！期待下次与你交流。${modelName}随时为你服务！`;
    }
    
    // 帮助
    if (lowerMessage.includes('帮助') || lowerMessage.includes('help')) {
        return `我很乐意帮助你！作为${modelName}，我可以为你提供各种信息和建议。请告诉我你需要什么帮助。`;
    }
    
    // 模型相关
    if (lowerMessage.includes('模型') || lowerMessage.includes('model')) {
        return `我现在使用的是${modelName}。每个模型都有其独特的特点和优势，我会根据我的配置为你提供最佳的回答。`;
    }
    
    // 默认回复
    let randomResponse = responses[Math.floor(Math.random() * responses.length)];
    let additionalThought = generateAdditionalThought(userMessage);
    
    // 根据配置调整回复
    randomResponse = adjustResponseByConfig(randomResponse);
    additionalThought = adjustResponseByConfig(additionalThought);
    
    return randomResponse + " " + additionalThought;
}

// 根据配置调整回复
function adjustResponseByConfig(text) {
    // 根据回复长度调整
    if (currentResponseLength === 'short') {
        // 简化回复
        text = text.replace(/让我来帮你分析一下/g, '让我分析');
        text = text.replace(/基于我的.*?能力/g, '基于我的能力');
        text = text.replace(/详细解答/g, '解答');
    } else if (currentResponseLength === 'long') {
        // 扩展回复
        if (!text.includes('详细') && !text.includes('深入')) {
            text = text.replace(/分析/g, '详细分析');
            text = text.replace(/回答/g, '全面回答');
        }
    }
    
    // 根据语言风格调整
    if (currentLanguageStyle === 'formal') {
        text = text.replace(/你好/g, '您好');
        text = text.replace(/谢谢/g, '感谢');
        text = text.replace(/不客气/g, '不必客气');
    } else if (currentLanguageStyle === 'casual') {
        text = text.replace(/您好/g, '你好');
        text = text.replace(/感谢/g, '谢谢');
        text = text.replace(/不必客气/g, '不客气');
    } else if (currentLanguageStyle === 'technical') {
        text = text.replace(/让我来/g, '基于技术分析，让我来');
        text = text.replace(/我认为/g, '从技术角度来看，我认为');
    }
    
    // 根据对话模式调整
    if (currentChatMode === 'creative') {
        text = text.replace(/分析/g, '创新性地分析');
        text = text.replace(/回答/g, '富有创意的回答');
    } else if (currentChatMode === 'precise') {
        text = text.replace(/分析/g, '精确分析');
        text = text.replace(/回答/g, '准确回答');
    } else if (currentChatMode === 'professional') {
        text = text.replace(/让我来/g, '作为专业AI助手，让我来');
        text = text.replace(/我认为/g, '从专业角度，我认为');
    }
    
    return text;
}

// 侧边栏切换功能
function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
    
    if (window.innerWidth <= 768) {
        // 移动端：切换侧边栏显示/隐藏
        if (sidebarCollapsed) {
            sidebar.classList.add('open');
        } else {
            sidebar.classList.remove('open');
        }
    } else {
        // 桌面端：切换侧边栏折叠/展开
        if (sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        } else {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        }
    }
    
    updateSidebarIcon();
    saveSettings();
}

// 更新侧边栏图标
function updateSidebarIcon() {
    const icon = sidebarToggle.querySelector('i');
    if (sidebarCollapsed) {
        icon.className = 'fas fa-bars';
        sidebarToggle.title = '展开侧边栏';
    } else {
        icon.className = 'fas fa-times';
        sidebarToggle.title = '折叠侧边栏';
    }
}

// 移动端侧边栏切换（原有函数更新）
function toggleSidebarMobile() {
    sidebar.classList.toggle('open');
    sidebarCollapsed = !sidebarCollapsed;
    updateSidebarIcon();
}

// 点击主内容区域关闭移动端侧边栏
mainContent.addEventListener('click', function(e) {
    if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        sidebarCollapsed = false;
        updateSidebarIcon();
    }
});

// 窗口大小变化时重置侧边栏状态
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        // 切换到桌面端
        sidebar.classList.remove('open');
        if (sidebarCollapsed) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        } else {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        }
    } else {
        // 切换到移动端
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
        if (!sidebarCollapsed) {
            sidebar.classList.remove('open');
        }
    }
    updateSidebarIcon();
});

// 设置模型选择器交互效果
function setupModelSelectorInteractions() {
    const configSelectors = document.querySelectorAll('.config-selector');
    
    configSelectors.forEach(selector => {
        const select = selector.querySelector('.config-select');
        
        // 悬停效果
        selector.addEventListener('mouseenter', function() {
            this.style.borderColor = 'var(--accent-color)';
            this.style.boxShadow = '0 0 0 1px var(--accent-color)';
        });
        
        selector.addEventListener('mouseleave', function() {
            this.style.borderColor = 'var(--border-color)';
            this.style.boxShadow = 'none';
        });
        
        // 焦点效果
        select.addEventListener('focus', function() {
            selector.style.borderColor = 'var(--accent-color)';
            selector.style.boxShadow = '0 0 0 2px rgba(25, 195, 125, 0.1)';
        });
        
        select.addEventListener('blur', function() {
            selector.style.borderColor = 'var(--border-color)';
            selector.style.boxShadow = 'none';
        });
        
        // 点击效果
        selector.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        selector.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        
        // 键盘导航
        select.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// 自动聚焦到输入框
messageInput.focus();
