import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { useChat } from "@/hooks/use-chat";
import { Menu, Download, RotateCcw, Code, Sidebar } from "lucide-react";

interface ChatInterfaceProps {
  onToggleSidebar: () => void;
  onToggleEditor: () => void;
  selectedFileIds: string[];
  editorVisible: boolean;
}

export function ChatInterface({ 
  onToggleSidebar, 
  onToggleEditor, 
  selectedFileIds,
  editorVisible 
}: ChatInterfaceProps) {
  const { messages, sendMessage, clearChat, isLoading } = useChat();

  const handleSendMessage = async (content: string) => {
    await sendMessage(content, selectedFileIds);
  };

  const handleExportChat = () => {
    const chatContent = messages.map((msg: any) => 
      `[${msg.timestamp?.toLocaleString()}] ${msg.sender.toUpperCase()}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex-1 flex flex-col ${messages.length === 0 ? 'gradient-bg' : 'bg-slate-900'}`}>
      {/* Chat Header - Only show when there are messages */}
      {messages.length > 0 && (
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={onToggleSidebar}
              className="mr-3 text-slate-400 hover:text-white transition-colors"
              data-testid="button-toggle-sidebar"
              title="Toggle Sidebar"
            >
              <Sidebar className="h-5 w-5" />
            </button>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-semibold" data-testid="text-chat-title">
                  Sourabh Kumar
                </h1>
                <p className="text-xs text-slate-400">AI Assistant</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={clearChat}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
              title="Clear Chat"
              data-testid="button-clear-chat"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleExportChat}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
              title="Export Chat"
              data-testid="button-export-chat"
            >
              <Download className="h-4 w-4" />
            </button>
            
            <button
              onClick={onToggleEditor}
              className={`p-2 rounded-lg transition-colors ${
                editorVisible 
                  ? 'text-white bg-slate-700' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              title="Toggle Editor"
              data-testid="button-toggle-editor"
            >
              <Code className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <MessageList messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />

      {/* Chat Input - Only show when there are messages */}
      {messages.length > 0 && (
        <ChatInput 
          onSendMessage={handleSendMessage}
          selectedFileIds={selectedFileIds}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
