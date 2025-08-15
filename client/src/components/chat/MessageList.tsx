import { ChatMessage } from "@shared/schema";
import { useEffect, useRef } from "react";
import { Bot, User, Image, Code, FileText, Sparkles, MoreHorizontal, Mic } from "lucide-react";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
}

export function MessageList({ messages, isLoading, onSendMessage }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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
    <div className={`flex-1 overflow-y-auto ${messages.length === 0 ? 'gradient-bg' : 'bg-slate-900'}`} data-testid="list-messages">
      {messages.length === 0 ? (
        <div className="hero-container">
          <h1 className="hero-title">
            Introducing Sourabh Kumar
          </h1>
          <p className="hero-subtitle">
            Your AI assistant now has the smartest, fastest, most useful capabilities yet,
            with advanced reasoning built in — so you get the best answer, every time.
          </p>
          
          <div className="w-full max-w-3xl relative">
            <input
              type="text"
              placeholder="Ask anything"
              className="hero-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  handleQuickAction(e.currentTarget.value.trim());
                  e.currentTarget.value = '';
                }
              }}
              data-testid="input-hero-message"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
              <Mic className="h-5 w-5" />
            </button>
          </div>
          
          <div className="quick-actions">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="quick-action-btn"
                  data-testid={`button-quick-${action.label.toLowerCase().replace(' ', '-')}`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-6 space-y-4 bg-slate-900">

          {messages.map((message) => (
        <div
          key={message.id}
          className={`message-box ${
            message.sender === 'user' ? 'user-message ml-auto' : 'ai-message'
          } p-4 rounded-2xl text-white`}
          data-testid={`message-${message.id}`}
        >
          {message.sender === 'user' ? (
            <div className="flex items-start space-x-3 justify-end">
              <div className="text-right">
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <User className="h-3 w-3 text-white" />
              </div>
            </div>
          ) : (
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="h-3 w-3 text-white" />
              </div>
              <div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          )}
        </div>
      ))}

          {isLoading && (
            <div className="message-box ai-message p-4 rounded-2xl text-white">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-3 w-3 text-white" />
                </div>
                <div className="loading-dots flex items-center space-x-1">
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
