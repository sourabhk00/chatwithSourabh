import { useState, useEffect } from "react";
import { Sidebar, Plus, Search, Library, Share, MoreHorizontal, Mic, Upload, Keyboard } from "lucide-react";
import { useChat } from "@/hooks/use-chat";
import { useFileManager } from "@/hooks/use-file-manager";

interface TopNavigationProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  messages: any[];
}

export function TopNavigation({ sidebarCollapsed, onToggleSidebar, messages }: TopNavigationProps) {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { clearChat, sendMessage } = useChat();
  const { files } = useFileManager();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+O for new chat
      if (e.ctrlKey && e.shiftKey && e.key === 'O') {
        e.preventDefault();
        handleNewChat();
      }
      // Ctrl+K for search
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNewChat = async () => {
    await clearChat();
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const exportChat = () => {
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
    setShowShareModal(false);
  };

  const shareViaEmail = () => {
    const chatContent = messages.map((msg: any) => 
      `${msg.sender.toUpperCase()}: ${msg.content}`
    ).join('\n\n');
    
    const subject = encodeURIComponent('Chat with Sourabh - Conversation Export');
    const body = encodeURIComponent(`Here's my conversation with Sourabh:\n\n${chatContent}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
    setShowShareModal(false);
  };

  return (
    <>
      <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4">
        {/* Left Side Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
            title="Toggle Sidebar"
            data-testid="button-toggle-sidebar-top"
          >
            <Sidebar className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleNewChat}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
            title="New Chat (Ctrl+Shift+O)"
            data-testid="button-new-chat"
          >
            <Plus className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setShowSearchModal(true)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
            title="Search Chats (Ctrl+K)"
            data-testid="button-search-chats"
          >
            <Search className="h-5 w-5" />
          </button>
          
          <button
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
            title="Library"
            data-testid="button-library"
          >
            <Library className="h-5 w-5" />
          </button>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
            title="Share Chat"
            data-testid="button-share-chat"
          >
            <Share className="h-5 w-5" />
          </button>
          
          <button
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
            title="More Options"
            data-testid="button-more-options"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
          <div className="bg-slate-800 rounded-lg w-full max-w-2xl mx-4 shadow-2xl">
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search chats and files..."
                  className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none"
                  autoFocus
                  data-testid="input-search-modal"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    id="modal-file-input"
                    className="hidden"
                    multiple
                    accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png,.gif,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.h,.css,.html,.json,.md,.xml"
                  />
                  <button
                    onClick={() => document.getElementById('modal-file-input')?.click()}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
                    title="Upload File"
                    data-testid="button-modal-upload"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
                    title="Voice Input"
                    data-testid="button-modal-voice"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
                    title="Dictate Mode"
                    data-testid="button-modal-dictate"
                  >
                    <Keyboard className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="text-sm text-slate-400">Recent Searches</div>
                {messages.slice(-5).map((msg: any, idx: number) => (
                  <div key={idx} className="p-2 hover:bg-slate-700 rounded cursor-pointer">
                    <div className="text-sm text-white truncate">{msg.content}</div>
                    <div className="text-xs text-slate-500">{msg.timestamp?.toLocaleString()}</div>
                  </div>
                ))}
                {files.slice(0, 3).map((file: any) => (
                  <div key={file.id} className="p-2 hover:bg-slate-700 rounded cursor-pointer">
                    <div className="text-sm text-white truncate">{file.originalName}</div>
                    <div className="text-xs text-slate-500">File • {(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 border-t border-slate-700 text-xs text-slate-500">
              Press <kbd className="px-1 py-0.5 bg-slate-700 rounded">Ctrl+K</kbd> to search anytime
            </div>
          </div>
          <div 
            className="absolute inset-0 -z-10" 
            onClick={() => setShowSearchModal(false)}
          />
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg w-full max-w-md mx-4 shadow-2xl">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">Share Chat</h3>
              <p className="text-sm text-slate-400">Choose how to share this conversation</p>
            </div>
            <div className="p-4 space-y-3">
              <button
                onClick={exportChat}
                className="w-full flex items-center space-x-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                data-testid="button-export-file"
              >
                <Upload className="h-5 w-5 text-blue-400" />
                <div className="text-left">
                  <div className="text-white font-medium">Export as File</div>
                  <div className="text-xs text-slate-400">Download conversation as .txt file</div>
                </div>
              </button>
              
              <button
                onClick={shareViaEmail}
                className="w-full flex items-center space-x-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                data-testid="button-share-email"
              >
                <Share className="h-5 w-5 text-green-400" />
                <div className="text-left">
                  <div className="text-white font-medium">Share via Email</div>
                  <div className="text-xs text-slate-400">Open email client with conversation</div>
                </div>
              </button>
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(messages.map((msg: any) => `${msg.sender}: ${msg.content}`).join('\n'));
                  setShowShareModal(false);
                }}
                className="w-full flex items-center space-x-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                data-testid="button-copy-clipboard"
              >
                <Library className="h-5 w-5 text-purple-400" />
                <div className="text-left">
                  <div className="text-white font-medium">Copy to Clipboard</div>
                  <div className="text-xs text-slate-400">Copy conversation text</div>
                </div>
              </button>
            </div>
            <div className="p-3 border-t border-slate-700">
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full p-2 text-slate-400 hover:text-white transition-colors"
                data-testid="button-cancel-share"
              >
                Cancel
              </button>
            </div>
          </div>
          <div 
            className="absolute inset-0 -z-10" 
            onClick={() => setShowShareModal(false)}
          />
        </div>
      )}
    </>
  );
}