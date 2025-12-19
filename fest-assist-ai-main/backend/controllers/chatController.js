require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../models/Chat');
const Event = require('../models/Event');


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to query Gemini
const generateBotResponse = async (query, context = '') => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    
    const events = await Event.find().limit(5);
    const eventContext = events
      .map(e => `${e.title} (${e.category}) on ${new Date(e.date).toLocaleDateString()} at ${e.venue}`)
      .join('\n');

    const fullPrompt = `
You are CEMS AI Assistant, a helpful chatbot for a college event management system.
Use the following event data for context if needed:
${eventContext || 'No events found.'}

User query: ${query}
Conversation context: ${context}
Keep answers short, helpful, and relevant to college events or event management.
    `;

    const result = await model.generateContent(fullPrompt);
    return result.response.text() || "Sorry, I couldn’t generate a response.";
  } catch (error) {
    console.error('Gemini API error:', error);
    return "I'm having trouble accessing event data right now. Please try again later.";
  }
};

/**
 * @desc    Start new chat conversation
 * @route   POST /api/chat/start
 * @access  Public
 */
const startChat = async (req, res) => {
  try {
    const conversationId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userId = req.user ? req.user._id : null;

    const chat = await Chat.create({
      userId,
      conversationId,
      title: 'New Conversation',
      messages: [
        {
          role: 'assistant',
          content: "Hi! I'm CEMS AI Assistant powered by Gemini. How can I help you today?",
          timestamp: new Date(),
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: {
        conversationId: chat.conversationId,
        messages: chat.messages,
      },
    });
  } catch (error) {
    console.error('Start chat error:', error);
    res.status(500).json({ success: false, message: 'Error starting chat' });
  }
};

/**
 * @desc    Send message and get response from Gemini
 * @route   POST /api/chat/message
 * @access  Public
 */
const sendMessage = async (req, res) => {
  try {
    const { conversationId, message } = req.body;
    if (!conversationId || !message)
      return res.status(400).json({ success: false, message: 'Conversation ID and message are required' });

    let chat = await Chat.findOne({ conversationId });

    if (!chat) {
      chat = await Chat.create({
        userId: req.user ? req.user._id : null,
        conversationId,
        title: message.slice(0, 30) + (message.length > 30 ? '...' : ''),
        messages: [],
      });
    }

    // Add user message
    chat.messages.push({ role: 'user', content: message, timestamp: new Date() });

    // Get the last 5 messages as context
    const context = chat.messages
      .slice(-5)
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');

    // Get Gemini response
    const botResponse = await generateBotResponse(message, context);

    chat.messages.push({
      role: 'assistant',
      content: botResponse,
      timestamp: new Date(),
    });

    await chat.save();

    res.status(200).json({
      success: true,
      data: {
        conversationId: chat.conversationId,
        messages: chat.messages,
      },
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: 'Error sending message' });
  }
};

/**
 * @desc    Get chat history
 * @route   GET /api/chat/history/:userId
 * @access  Private
 */
const getChatHistory = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 }).select('conversationId title messages updatedAt');

    res.status(200).json({
      success: true,
      count: chats.length,
      data: chats,
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ success: false, message: 'Error fetching chat history' });
  }
};

/**
 * @desc    Get single conversation
 * @route   GET /api/chat/:conversationId
 * @access  Public
 */
const getConversation = async (req, res) => {
  try {
    const chat = await Chat.findOne({ conversationId: req.params.conversationId });
    if (!chat) return res.status(404).json({ success: false, message: 'Conversation not found' });

    res.status(200).json({ success: true, data: chat });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ success: false, message: 'Error fetching conversation' });
  }
};

/**
 * @desc    Delete conversation
 * @route   DELETE /api/chat/:conversationId
 * @access  Private
 */
const deleteConversation = async (req, res) => {
  try {
    const chat = await Chat.findOne({ conversationId: req.params.conversationId });
    if (!chat) return res.status(404).json({ success: false, message: 'Conversation not found' });

    if (req.user && chat.userId && chat.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized to delete this conversation' });

    await Chat.deleteOne({ conversationId: req.params.conversationId });
    res.status(200).json({ success: true, message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ success: false, message: 'Error deleting conversation' });
  }
};

module.exports = {
  startChat,
  sendMessage,
  getChatHistory,
  getConversation,
  deleteConversation,
};
