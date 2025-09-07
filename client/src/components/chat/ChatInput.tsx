import { useState, useRef, useCallback } from "react";
import { Paperclip, Send, X, Code, FileText, Sparkles } from "lucide-react";
import { useFileManager } from "@/hooks/use-file-manager";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  selectedFileIds: string[];
  isLoading: boolean;
}


export function ChatInput({ onSendMessage, selectedFileIds, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { files } = useFileManager();

  const selectedFiles = files.filter((file: any) => selectedFileIds.includes(file.id));

  const autoResize = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    autoResize();
  };

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickAction = (action: string) => {
    const prompts = {
      'analyze-code': 'Please analyze the code in my editor and provide feedback on best practices, potential issues, and suggestions for improvement.',
      'explain-file': 'Can you explain what the uploaded file contains and its purpose?',
      'generate-code': 'Please generate code based on my requirements. I\'ll specify what I need.'
    };
    
    setInput(prompts[action as keyof typeof prompts] || '');
    textareaRef.current?.focus();
    autoResize();
  };

  return (
    <div className="p-4 bg-slate-800 border-t border-slate-700">
      {/* File Attachment Preview */}
      {selectedFiles.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center space-x-2 p-3 bg-slate-700 rounded-lg">
            <Paperclip className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-slate-300" data-testid="text-selected-files">
              {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected: {' '}
              {selectedFiles.map((f: any) => f.originalName).join(', ')}
            </span>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full resize-none p-3 pr-12 rounded-xl bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 max-h-32"
            rows={1}
            placeholder="Type your message or ask about uploaded files..."
            disabled={isLoading}
            data-testid="input-chat-message"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center space-x-2 mt-3">
        <button
          onClick={() => handleQuickAction('analyze-code')}
          className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full hover:bg-slate-600 transition-colors"
          data-testid="button-quick-analyze-code"
        >
          <Code className="inline h-3 w-3 mr-1" />
          Analyze Code
        </button>
        
        <button
          onClick={() => handleQuickAction('explain-file')}
          className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full hover:bg-slate-600 transition-colors"
          data-testid="button-quick-explain-file"
        >
          <FileText className="inline h-3 w-3 mr-1" />
          Explain File
        </button>
        
        <button
          onClick={() => handleQuickAction('generate-code')}
          className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full hover:bg-slate-600 transition-colors"
          data-testid="button-quick-generate-code"
        >
          <Sparkles className="inline h-3 w-3 mr-1" />
          Generate Code
        </button>
      </div>
    </div>
  );
}
