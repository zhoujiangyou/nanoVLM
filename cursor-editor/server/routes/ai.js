import express from 'express';

const router = express.Router();

// AI 聊天端点
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // 获取最后一条用户消息
    const lastMessage = messages[messages.length - 1];
    
    // 这里是一个简单的模拟 AI 响应
    // 在实际应用中，你应该调用真实的 AI API（如 OpenAI、Claude 等）
    const response = generateMockResponse(lastMessage.content);
    
    res.json({ response });
  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ error: error.message });
  }
});

// 模拟 AI 响应
function generateMockResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  // 简单的关键词匹配响应
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return 'Hello! How can I help you with your code today?';
  }
  
  if (lowerMessage.includes('python')) {
    return 'Python is a great language! I can help you with:\n\n• Writing Python code\n• Debugging errors\n• Explaining Python concepts\n• Suggesting best practices\n\nWhat specific Python question do you have?';
  }
  
  if (lowerMessage.includes('javascript') || lowerMessage.includes('js')) {
    return 'JavaScript is awesome! I can assist you with:\n\n• Modern ES6+ features\n• React, Vue, or Angular\n• Node.js backend development\n• Debugging and optimization\n\nWhat would you like to know?';
  }
  
  if (lowerMessage.includes('bug') || lowerMessage.includes('error')) {
    return 'I\'d be happy to help you debug! To better assist you, please:\n\n1. Share the error message\n2. Show me the relevant code\n3. Describe what you expected vs. what happened\n\nLet\'s fix this together!';
  }
  
  if (lowerMessage.includes('function') || lowerMessage.includes('code')) {
    return 'I can help you write or improve that function! Could you provide more details about:\n\n• What the function should do\n• What inputs it should accept\n• What output you expect\n• Any specific requirements or constraints';
  }

  if (lowerMessage.includes('how') || lowerMessage.includes('what')) {
    return 'Great question! To give you the best answer, I need a bit more context. Could you:\n\n• Share the specific code you\'re working with\n• Describe what you\'re trying to achieve\n• Mention which programming language you\'re using\n\nThen I can provide detailed guidance!';
  }
  
  // 默认响应
  return `I understand you're asking about: "${userMessage}"\n\nNote: This is a demo AI assistant. In a production environment, this would be connected to a real AI model like GPT-4, Claude, or similar.\n\nFor now, I can help with general coding questions. Try asking me about:\n\n• Specific programming languages\n• Debugging help\n• Code explanations\n• Best practices`;
}

// 代码补全端点（未来功能）
router.post('/complete', async (req, res) => {
  try {
    const { code, language, cursor } = req.body;
    
    // 这里将来可以集成代码补全 AI
    res.json({ 
      suggestions: [
        '// AI code completion coming soon...'
      ]
    });
  } catch (error) {
    console.error('Error in code completion:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
