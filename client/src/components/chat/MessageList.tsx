import { ChatMessage } from "@shared/schema";
import { useEffect, useRef, useState } from "react";
import { Bot, User, Image, Code, FileText, Sparkles, MoreHorizontal, Mic, Upload, Paperclip } from "lucide-react";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
}


export function MessageList({ messages, isLoading, onSendMessage }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [animatingMessages, setAnimatingMessages] = useState<Set<string>>(new Set());

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end",
        inline: "nearest"
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      // Add animation to new messages
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.id) {
        setAnimatingMessages(prev => new Set(Array.from(prev).concat(lastMessage.id)));
        
        // Remove animation class after animation completes
        setTimeout(() => {
          setAnimatingMessages(prev => {
            const newSet = new Set(prev);
            newSet.delete(lastMessage.id);
            return newSet;
          });
        }, 300);
      }
    }
    
    // Smooth scroll to bottom with delay for animation
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

  const quickActions = [
    { icon: Image, label: "Analyze images", prompt: "Please analyze any images I upload and provide detailed insights about their content, context, and meaning." },
    { icon: Code, label: "Code", prompt: "Help me write, review, or debug code. I can work with various programming languages and frameworks." },
    { icon: FileText, label: "Summarize text", prompt: "Summarize and extract key insights from any documents or text I provide." },
    { icon: Sparkles, label: "Creative writing", prompt: "Help me with creative writing tasks like stories, poems, or content creation." },
    { icon: MoreHorizontal, label: "More", prompt: "I'm here to help with any questions or tasks you have. What would you like to work on?" }
  ];

  const handleQuickAction = (prompt: string) => {
    onSendMessage(prompt);
  };

  return (
    <div className={`flex-1 overflow-y-auto scroll-container ${messages.length === 0 ? 'gradient-bg' : 'bg-slate-900'}`} data-testid="list-messages">
      {messages.length === 0 ? (
        <div className="hero-container">
          <h1 className="hero-title">
            Chat with Sourabh
          </h1>
          <p className="hero-subtitle">
            Smarter. Faster. Always right there for you — Chat with Sourabh
          </p>
          
          <div className="w-full max-w-3xl relative">
            <input
              type="text"
              placeholder="Chat with Sourabh..."
              className="hero-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  handleQuickAction(e.currentTarget.value.trim());
                  e.currentTarget.value = '';
                }
              }}
              data-testid="input-hero-message"
            />
            <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <input
                type="file"
                id="hero-file-input"
                className="hidden"
                multiple
                accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png,.gif,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.h,.css,.html,.json,.md,.xml"
                onChange={(e) => {
                  // Handle file upload here
                  if (e.target.files) {
                    console.log('Files selected:', e.target.files);
                  }
                }}
              />
              <button 
                onClick={() => document.getElementById('hero-file-input')?.click()}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-200 hover:bg-opacity-10 active:scale-95"
                title="Upload Files"
                data-testid="button-upload-files"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <div className="h-4 w-px bg-slate-300 hidden sm:block"></div>
              <button 
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-200 hover:bg-opacity-10 active:scale-95 hidden sm:flex"
                title="Voice Input"
                data-testid="button-voice-input"
              >
                <Mic className="h-4 w-4" />
              </button>
              <button 
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-200 hover:bg-opacity-10 active:scale-95 hidden md:flex"
                title="Dictate Mode"
                data-testid="button-dictate-mode"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-200 hover:bg-opacity-10 active:scale-95 block lg:hidden"
                title="More Options"
                data-testid="button-more-hero-options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="quick-actions">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="quick-action-btn"
                  style={{ '--i': index } as React.CSSProperties}
                  data-testid={`button-quick-${action.label.toLowerCase().replace(' ', '-')}`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{action.label}</span>
                  <span className="sm:hidden">{action.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 bg-slate-900">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`message-box ${
                message.sender === 'user' ? 'user-message ml-auto' : 'ai-message'
              } ${animatingMessages.has(message.id) ? 'animate-in' : ''} p-3 sm:p-4 rounded-2xl text-white`}
              style={{ 
                animationDelay: `${index * 0.05}s`,
                '--message-index': index 
              } as React.CSSProperties}
              data-testid={`message-${message.id}`}
            >
              {message.sender === 'user' ? (
                <div className="flex items-start space-x-2 sm:space-x-3 justify-end">
                  <div className="text-right">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed break-words">{message.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="message-box ai-message p-3 sm:p-4 rounded-2xl text-white animate-in">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="loading-dots flex items-center space-x-1 py-1">
                  <span className="dot-1 w-2 h-2 bg-slate-300 rounded-full"></span>
                  <span className="dot-2 w-2 h-2 bg-slate-300 rounded-full"></span>
                  <span className="dot-3 w-2 h-2 bg-slate-300 rounded-full"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
