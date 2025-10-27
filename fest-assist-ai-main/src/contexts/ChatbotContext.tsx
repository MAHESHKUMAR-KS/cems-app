import React, { createContext, useContext, useState } from 'react';
import { GEMINI_API_KEY, GEMINI_API_URL, SYSTEM_PROMPT } from '@/config/gemini';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatbotContextType {
  isOpen: boolean;
  messages: Message[];
  conversations: Conversation[];
  currentConversationId: string;
  isTyping: boolean;
  toggleChatbot: () => void;
  sendMessage: (content: string) => void;
  startNewConversation: () => void;
  switchConversation: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState('default');
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'default',
      title: 'New Conversation',
      messages: [
        {
          id: '1',
          role: 'assistant',
          content: "Hi! I'm CEMS AI Assistant. How can I help you with events today?",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const messages = currentConversation?.messages || [];

  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
  };

  const startNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: "Hi! I'm CEMS AI Assistant. How can I help you with events today?",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
  };

  const switchConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => {
      const updated = prev.filter(c => c.id !== conversationId);
      if (conversationId === currentConversationId && updated.length > 0) {
        setCurrentConversationId(updated[0].id);
      }
      return updated;
    });
  };

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversationId) {
        const updatedMessages = [...conv.messages, userMessage];
        const title = conv.title === 'New Conversation' && updatedMessages.length === 2
          ? content.slice(0, 30) + (content.length > 30 ? '...' : '')
          : conv.title;
        
        return {
          ...conv,
          messages: updatedMessages,
          title,
          updatedAt: new Date(),
        };
      }
      return conv;
    }));

    // Show typing indicator
    setIsTyping(true);

    try {
      // Get AI response from Gemini API
      const aiResponse = await getGeminiResponse(content);
      
      setIsTyping(false);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setConversations(prev => prev.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, assistantMessage],
            updatedAt: new Date(),
          };
        }
        return conv;
      }));
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      setIsTyping(false);
      
      // Use fallback response on error
      const fallbackResponse = generateResponse(content.toLowerCase());
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date(),
      };
      
      setConversations(prev => prev.map(conv => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, errorMessage],
            updatedAt: new Date(),
          };
        }
        return conv;
      }));
    }
  };

  const getGeminiResponse = async (userMessage: string): Promise<string> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${SYSTEM_PROMPT}

User: ${userMessage}

Assistant:`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content?.parts?.[0]?.text) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        return aiResponse.trim();
      } else if (data.error) {
        throw new Error(`Gemini API Error: ${data.error.message || 'Unknown error'}`);
      } else {
        throw new Error('No valid response from AI');
      }
    } catch (error: any) {
      console.error('Gemini API call failed:', error);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      throw error;
    }
  };

  const generateResponse = (query: string): string => {
    if (query.includes('today') || query.includes('upcoming')) {
      return "Today's featured events include TechFest 2025, Cultural Night, and Sports Tournament. Would you like details on any specific event?";
    } else if (query.includes('technical') || query.includes('tech')) {
      return "We have several technical events: Hackathon 2025, AI Workshop, and Web Development Bootcamp. Which one interests you?";
    } else if (query.includes('register') || query.includes('signup')) {
      return "To register for an event, please navigate to the event details page and click the 'Register' button. You'll need to be logged in as a student.";
    } else if (query.includes('my events') || query.includes('registered')) {
      return "You can view all your registered events in your Student Dashboard. Navigate to the dashboard to see your event list.";
    } else if (query.includes('cultural')) {
      return "Cultural events include Dance Competition, Music Fest, Drama Night, and Art Exhibition. Which would you like to explore?";
    } else if (query.includes('sports') || query.includes('sport')) {
      return "Sports events include Cricket Tournament, Football League, Basketball Championship, and Athletics Meet. Interested in any?";
    } else if (query.includes('workshop')) {
      return "Available workshops: AI & Machine Learning, Web Development Bootcamp, Mobile App Development, and Cloud Computing. Which topic interests you?";
    } else {
      return "I can help you find events, register for activities, and answer questions about our college event management system. What would you like to know?";
    }
  };

  return (
    <ChatbotContext.Provider value={{ 
      isOpen, 
      messages, 
      conversations,
      currentConversationId,
      isTyping,
      toggleChatbot, 
      sendMessage,
      startNewConversation,
      switchConversation,
      deleteConversation
    }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within ChatbotProvider');
  }
  return context;
};
