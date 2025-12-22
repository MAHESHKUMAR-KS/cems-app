import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { FaRobot, FaTimes, FaPaperPlane, FaPlus, FaTrash, FaBars, FaComments } from 'react-icons/fa';
import { useChatbot } from '@/contexts/ChatbotContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import TypingIndicator from '@/components/TypingIndicator';

const ChatbotSidebar = () => {
  const location = useLocation();
  const { 
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
  } = useChatbot();
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const suggestedPrompts = [
    "Show me today's events",
    "Find technical events",
    "Show upcoming workshops",
    "My registered events",
  ];

  // Don't render chatbot on auth pages
  if (isAuthPage) {
    return null;
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleChatbot}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] shadow-2xl animate-glow-pulse hover:shadow-2xl hover:shadow-primary/50 transition-all"
          >
            <FaRobot className="text-white text-2xl" />
            <span className="text-white font-semibold text-sm">Chat with AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleChatbot}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Main Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full z-50 flex"
            >
              {/* History Sidebar */}
              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ x: -280 }}
                    animate={{ x: 0 }}
                    exit={{ x: -280 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="w-64 bg-background/95 backdrop-blur-xl border-r border-border flex flex-col"
                  >
                    {/* History Header */}
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-sm flex items-center gap-2">
                          <FaComments className="text-primary" />
                          Chat History
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowHistory(false)}
                          className="h-8 w-8 p-0"
                        >
                          <FaTimes className="text-xs" />
                        </Button>
                      </div>
                      <Button
                        onClick={() => {
                          startNewConversation();
                          setShowHistory(false);
                        }}
                        className="w-full bg-gradient-to-r from-primary to-accent text-white"
                        size="sm"
                      >
                        <FaPlus className="mr-2" />
                        New Chat
                      </Button>
                    </div>

                    {/* Conversations List */}
                    <ScrollArea className="flex-1 p-2">
                      {conversations.map((conv) => (
                        <motion.div
                          key={conv.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`group relative p-3 mb-2 rounded-lg cursor-pointer transition-all ${
                            conv.id === currentConversationId
                              ? 'bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30'
                              : 'bg-muted/50 hover:bg-muted'
                          }`}
                          onClick={() => {
                            switchConversation(conv.id);
                            setShowHistory(false);
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{conv.title}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">
                                {conv.updatedAt.toLocaleDateString()}
                              </p>
                            </div>
                            {conversations.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteConversation(conv.id);
                                }}
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FaTrash className="text-xs text-destructive" />
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </ScrollArea>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Panel */}
              <div className="w-full sm:w-[480px] bg-background/98 backdrop-blur-xl border-l border-border/50 flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHistory(!showHistory)}
                        className="h-9 w-9 p-0 hover:bg-primary/10"
                      >
                        <FaBars className="text-lg" />
                      </Button>
                      <div className="flex items-center gap-3">
                        <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-primary via-accent to-primary bg-[length:200%_200%] animate-gradient-shift shadow-lg">
                          <FaRobot className="text-white text-xl" />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                        </div>
                        <div>
                          <h2 className="font-bold text-base">CEMS AI Assistant</h2>
                          <p className="text-xs text-muted-foreground">Online • Ready to help</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleChatbot}
                      className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <FaTimes className="text-lg" />
                    </Button>
                  </div>
                </div>

                {/* Suggested Prompts */}
                {messages.length <= 1 && !isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 border-b border-border/30 bg-muted/20"
                  >
                    <p className="text-xs text-muted-foreground mb-3 font-semibold flex items-center gap-2">
                      <span className="w-1 h-4 bg-gradient-to-b from-primary to-accent rounded-full" />
                      Quick suggestions
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {suggestedPrompts.map((prompt, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            sendMessage(prompt);
                          }}
                          className="text-xs px-3 py-2.5 rounded-xl bg-gradient-to-br from-card to-muted/30 hover:from-primary/10 hover:to-accent/10 transition-all border border-border/50 hover:border-primary/40 text-left font-medium shadow-sm hover:shadow-md"
                        >
                          {prompt}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Messages */}
                <ScrollArea className="flex-1 p-5 bg-gradient-to-b from-muted/5 to-transparent">
                  <div className="space-y-5">
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          duration: 0.3,
                          delay: index * 0.03,
                          ease: "easeOut"
                        }}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        } items-end gap-2`}
                      >
                        {message.role === 'assistant' && (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-md">
                            <FaRobot className="text-white text-xs" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] ${
                            message.role === 'user'
                              ? 'bg-gradient-to-br from-primary via-primary/90 to-accent text-white rounded-3xl rounded-br-lg shadow-lg shadow-primary/25'
                              : 'bg-card/80 backdrop-blur-sm border border-border/60 rounded-3xl rounded-bl-lg shadow-md'
                          } px-4 py-3 transition-all hover:shadow-xl`}
                        >
                          <p className={`text-sm leading-relaxed ${
                            message.role === 'user' ? 'text-white' : 'text-foreground'
                          }`}>
                            {message.content}
                          </p>
                          <p className={`text-[10px] mt-1.5 ${
                            message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        {message.role === 'user' && (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0 shadow-md">
                            <span className="text-white text-xs font-bold">U</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start items-end gap-2"
                      >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-md">
                          <FaRobot className="text-white text-xs" />
                        </div>
                        <TypingIndicator />
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t border-border/50 bg-card/50 backdrop-blur-sm">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1 relative">
                      <Textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message... (Shift + Enter for new line)"
                        className="min-h-[50px] max-h-[150px] resize-none bg-muted/80 border-border/60 focus:border-primary/50 rounded-2xl px-4 py-3 text-sm shadow-inner focus:shadow-lg transition-all pr-12"
                        rows={1}
                      />
                      <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground">
                        {input.length}/1000
                      </span>
                    </div>
                    <Button
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping}
                      className="bg-gradient-to-br from-primary via-accent to-primary bg-[length:200%_200%] animate-gradient-shift text-white hover:shadow-xl hover:shadow-primary/40 transition-all rounded-xl h-12 w-12 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      size="default"
                    >
                      <FaPaperPlane className="text-base" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 text-center">
                    Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[9px] font-mono">Enter</kbd> to send • <kbd className="px-1.5 py-0.5 bg-muted rounded text-[9px] font-mono">Shift + Enter</kbd> for new line
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotSidebar;
