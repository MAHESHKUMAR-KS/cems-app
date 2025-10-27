const Chat = require('../models/Chat');
const Event = require('../models/Event');

/**
 * Local rule-based chatbot response generator
 * No external API calls - fully local implementation
 */
const generateBotResponse = async (query) => {
  const lowerQuery = query.toLowerCase();

  try {
    // Event count queries
    if (lowerQuery.includes('how many events') || lowerQuery.includes('total events')) {
      const count = await Event.countDocuments();
      return `Currently, there are ${count} events available in our system. Would you like to explore them by category?`;
    }

    // Today/upcoming events
    if (lowerQuery.includes('today') || lowerQuery.includes('upcoming')) {
      const upcomingEvents = await Event.find({
        date: { $gte: new Date() },
      })
        .sort({ date: 1 })
        .limit(3);

      if (upcomingEvents.length > 0) {
        const eventList = upcomingEvents
          .map((e) => `• ${e.title} (${e.category}) on ${new Date(e.date).toLocaleDateString()}`)
          .join('\n');
        return `Here are the upcoming events:\n${eventList}\n\nWould you like details on any specific event?`;
      }
      return "There are no upcoming events scheduled at the moment. Check back soon!";
    }

    // Technical events
    if (lowerQuery.includes('technical') || lowerQuery.includes('tech') || lowerQuery.includes('hackathon')) {
      const techEvents = await Event.find({ category: 'technical' });
      if (techEvents.length > 0) {
        const eventList = techEvents
          .map((e) => `• ${e.title} at ${e.venue} on ${new Date(e.date).toLocaleDateString()}`)
          .join('\n');
        return `Here are our technical events:\n${eventList}\n\nThese events are perfect for coding enthusiasts!`;
      }
      return "We don't have any technical events scheduled right now. Stay tuned!";
    }

    // Cultural events
    if (lowerQuery.includes('cultural') || lowerQuery.includes('music') || lowerQuery.includes('dance') || lowerQuery.includes('art')) {
      const culturalEvents = await Event.find({ category: 'cultural' });
      if (culturalEvents.length > 0) {
        const eventList = culturalEvents
          .map((e) => `• ${e.title} at ${e.venue} on ${new Date(e.date).toLocaleDateString()}`)
          .join('\n');
        return `Check out these cultural events:\n${eventList}\n\nExperience the diversity of our campus culture!`;
      }
      return "No cultural events are currently scheduled. Check back later!";
    }

    // Sports events
    if (lowerQuery.includes('sports') || lowerQuery.includes('sport') || lowerQuery.includes('game') || lowerQuery.includes('tournament')) {
      const sportsEvents = await Event.find({ category: 'sports' });
      if (sportsEvents.length > 0) {
        const eventList = sportsEvents
          .map((e) => `• ${e.title} at ${e.venue} on ${new Date(e.date).toLocaleDateString()}`)
          .join('\n');
        return `Here are our sports events:\n${eventList}\n\nReady to compete?`;
      }
      return "No sports events are scheduled at the moment. Stay active!";
    }

    // Workshop events
    if (lowerQuery.includes('workshop') || lowerQuery.includes('training') || lowerQuery.includes('learn')) {
      const workshops = await Event.find({ category: 'workshop' });
      if (workshops.length > 0) {
        const eventList = workshops
          .map((e) => `• ${e.title} at ${e.venue} on ${new Date(e.date).toLocaleDateString()}`)
          .join('\n');
        return `Available workshops:\n${eventList}\n\nExpand your skills with these hands-on sessions!`;
      }
      return "No workshops are available right now. Keep learning!";
    }

    // Registration help
    if (lowerQuery.includes('register') || lowerQuery.includes('signup') || lowerQuery.includes('how to join')) {
      return "To register for an event:\n1. Browse available events\n2. Click on an event to view details\n3. Click the 'Register' button\n4. You must be logged in as a student to register\n\nNeed help finding a specific event?";
    }

    // My events
    if (lowerQuery.includes('my events') || lowerQuery.includes('registered events') || lowerQuery.includes('my registrations')) {
      return "You can view all your registered events in your Student Dashboard. Navigate to the dashboard from the main menu to see your complete event list.";
    }

    // Event categories
    if (lowerQuery.includes('categories') || lowerQuery.includes('types of events')) {
      return "We have 4 event categories:\n• Technical - Hackathons, tech talks, coding competitions\n• Cultural - Music, dance, drama, art exhibitions\n• Sports - Tournaments, championships, athletic meets\n• Workshop - Skill-building sessions, training programs\n\nWhich category interests you?";
    }

    // Help/general
    if (lowerQuery.includes('help') || lowerQuery.includes('what can you do')) {
      return "I'm CEMS AI Assistant! I can help you with:\n• Finding events by category or date\n• Event registration information\n• Viewing upcoming events\n• Understanding event categories\n• General event queries\n\nWhat would you like to know?";
    }

    // Venue information
    if (lowerQuery.includes('venue') || lowerQuery.includes('location') || lowerQuery.includes('where')) {
      return "Each event has a specific venue. You can see the venue details on the event page. Common venues include:\n• Main Auditorium\n• Sports Complex\n• Open Air Theater\n• Computer Labs\n• Innovation Hub\n\nLooking for a specific event's location?";
    }

    // Default response
    return "I can help you find events, get registration info, and answer questions about our college event management system. Try asking about:\n• Upcoming events\n• Events by category (technical, cultural, sports, workshop)\n• How to register\n• Your registered events\n\nWhat would you like to know?";
  } catch (error) {
    console.error('Bot response error:', error);
    return "I encountered an issue processing your request. Please try asking about upcoming events or event categories.";
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
          content: "Hi! I'm CEMS AI Assistant. How can I help you with events today?",
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
    res.status(500).json({
      success: false,
      message: error.message || 'Error starting chat',
    });
  }
};

/**
 * @desc    Send message and get response
 * @route   POST /api/chat/message
 * @access  Public
 */
const sendMessage = async (req, res) => {
  try {
    const { conversationId, message } = req.body;

    if (!conversationId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Conversation ID and message are required',
      });
    }

    let chat = await Chat.findOne({ conversationId });

    if (!chat) {
      // Create new chat if doesn't exist
      chat = await Chat.create({
        userId: req.user ? req.user._id : null,
        conversationId,
        title: message.slice(0, 30) + (message.length > 30 ? '...' : ''),
        messages: [],
      });
    }

    // Add user message
    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Generate bot response
    const botResponse = await generateBotResponse(message);

    // Add bot response
    chat.messages.push({
      role: 'assistant',
      content: botResponse,
      timestamp: new Date(),
    });

    // Update title if it's the first user message
    if (chat.title === 'New Conversation' && chat.messages.length === 3) {
      chat.title = message.slice(0, 30) + (message.length > 30 ? '...' : '');
    }

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
    res.status(500).json({
      success: false,
      message: error.message || 'Error sending message',
    });
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

    const chats = await Chat.find({ userId })
      .sort({ updatedAt: -1 })
      .select('conversationId title messages updatedAt');

    res.status(200).json({
      success: true,
      count: chats.length,
      data: chats,
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching chat history',
    });
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

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching conversation',
    });
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

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    // Check ownership
    if (req.user && chat.userId && chat.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this conversation',
      });
    }

    await Chat.deleteOne({ conversationId: req.params.conversationId });

    res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully',
    });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting conversation',
    });
  }
};

module.exports = {
  startChat,
  sendMessage,
  getChatHistory,
  getConversation,
  deleteConversation,
};
