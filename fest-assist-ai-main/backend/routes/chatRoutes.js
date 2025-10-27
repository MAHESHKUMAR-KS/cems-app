const express = require('express');
const router = express.Router();
const {
  startChat,
  sendMessage,
  getChatHistory,
  getConversation,
  deleteConversation,
} = require('../controllers/chatController');
const { protect } = require('../middlewares/auth');

// Public routes (chatbot can work without auth)
router.post('/start', startChat);
router.post('/message', sendMessage);
router.get('/:conversationId', getConversation);

// Private routes (optional - for logged-in users)
router.get('/history/:userId', protect, getChatHistory);
router.delete('/:conversationId', protect, deleteConversation);

module.exports = router;
