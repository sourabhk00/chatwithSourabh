import { ChatMessage } from "@shared/schema";
import { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-900" data-testid="list-messages">
      {messages.length === 0 && (
        <div className="message-box ai-message p-4 rounded-2xl text-white">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="h-3 w-3 text-white" />
            </div>
            <div>
              <p className="text-sm">Hello! I'm Sourabh Kumar, your AI assistant. I can help you with:</p>
              <ul className="text-sm mt-2 space-y-1 text-slate-200">
                <li>• <strong>File Analysis:</strong> Upload documents, images, or code files for analysis</li>
                <li>• <strong>Code Editing:</strong> Use the integrated editor for programming tasks</li>
                <li>• <strong>Document Processing:</strong> Extract insights from PDFs and text files</li>
                <li>• <strong>General Questions:</strong> Ask me anything you'd like to know</li>
              </ul>
              <p className="text-sm mt-2">What would you like to work on today?</p>
            </div>
          </div>
        </div>
      )}

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
  );
}
