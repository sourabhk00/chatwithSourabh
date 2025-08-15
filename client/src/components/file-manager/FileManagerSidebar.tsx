import { FileUploadZone } from "./FileUploadZone";
import { FileList } from "./FileList";
import { useFileManager } from "@/hooks/use-file-manager";
import { useChat } from "@/hooks/use-chat";
import { X, FolderOpen, MessageSquare, History, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface FileManagerSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  selectedFileIds: string[];
  onFileSelect: (fileIds: string[]) => void;
  activeTab: 'files' | 'history';
  onTabChange: (tab: 'files' | 'history') => void;
}

export function FileManagerSidebar({ 
  collapsed, 
  onToggle, 
  selectedFileIds, 
  onFileSelect,
  activeTab,
  onTabChange
}: FileManagerSidebarProps) {
  const { files, uploadProgress, storageUsed, storageTotal } = useFileManager();
  const { messages, clearChat } = useChat();
  const isMobile = useIsMobile();

  // Group messages by date for history
  const groupedMessages = messages.reduce((groups: any, message) => {
    const date = message.timestamp ? new Date(message.timestamp).toDateString() : 'Today';
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div 
      className={`sidebar bg-slate-800 border-r border-slate-700 flex flex-col sidebar-toggle
        ${collapsed ? 'sidebar-collapsed' : ''}
        ${isMobile ? 'fixed inset-y-0 left-0 z-40 shadow-2xl' : 'relative'}`}
    >
      {/* Sidebar Header */}
      <div className="p-3 sm:p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-white truncate" data-testid="sidebar-title">
            Chat with Sourabh
          </h2>
          <button 
            onClick={onToggle}
            className="text-slate-400 hover:text-white transition-colors flex-shrink-0 p-1 hover:bg-slate-700 rounded-lg"
            data-testid="button-close-sidebar"
            title="Close Sidebar"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-700 rounded-lg p-1">
          <button
            onClick={() => onTabChange('files')}
            className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
              activeTab === 'files'
                ? 'bg-slate-600 text-white transform scale-105'
                : 'text-slate-300 hover:text-white hover:bg-slate-600'
            }`}
            data-testid="tab-files"
          >
            <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Files</span>
            <span className="sm:hidden">Files</span>
          </button>
          <button
            onClick={() => onTabChange('history')}
            className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
              activeTab === 'history'
                ? 'bg-slate-600 text-white transform scale-105'
                : 'text-slate-300 hover:text-white hover:bg-slate-600'
            }`}
            data-testid="tab-history"
          >
            <History className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">History</span>
            <span className="sm:hidden">Chat</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'files' ? (
        <>
          {/* File Upload Zone */}
          <div className="p-3 sm:p-4">
            <FileUploadZone uploadProgress={uploadProgress} />
          </div>

          {/* File List */}
          <div className="flex-1 overflow-y-auto scroll-container">
            <div className="p-3 sm:p-4">
              <h3 className="text-xs sm:text-sm font-medium text-slate-400 mb-3 uppercase tracking-wide">
                Recent Files
              </h3>
              <FileList 
                files={files} 
                selectedFileIds={selectedFileIds}
                onFileSelect={onFileSelect}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto scroll-container">
            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs sm:text-sm font-medium text-slate-400 uppercase tracking-wide">
                  <span className="hidden sm:inline">Conversation History</span>
                  <span className="sm:hidden">History</span>
                </h3>
                <button
                  onClick={clearChat}
                  className="text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-slate-700"
                  data-testid="button-clear-history"
                >
                  Clear
                </button>
              </div>
              
              {Object.keys(groupedMessages).length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-slate-500">
                  <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs sm:text-sm">No conversations yet</p>
                  <p className="text-xs mt-1 hidden sm:block">Start chatting to see your history</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedMessages).map(([date, msgs]: [string, any]) => (
                    <div key={date} className="">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-3 w-3 text-slate-500" />
                        <span className="text-xs text-slate-500 font-medium">{date}</span>
                      </div>
                      <div className="space-y-2 ml-5">
                        {msgs.slice(0, isMobile ? 3 : 5).map((msg: any, idx: number) => (
                          <div key={idx} className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]">
                            <div className="flex items-start space-x-2">
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                msg.sender === 'user' ? 'bg-blue-400' : 'bg-purple-400'
                              }`}></div>
                              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                                {msg.content.substring(0, isMobile ? 60 : 100)}{msg.content.length > (isMobile ? 60 : 100) ? '...' : ''}
                              </p>
                            </div>
                          </div>
                        ))}
                        {msgs.length > 5 && (
                          <p className="text-xs text-slate-500 ml-4">+{msgs.length - 5} more messages</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Storage Usage */}
      <div className="p-3 sm:p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 mb-2">
          <span className="hidden sm:inline">Storage Usage</span>
          <span className="sm:hidden">Storage</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5 sm:h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${(storageUsed / storageTotal) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span data-testid="text-storage-used">
            <span className="hidden sm:inline">{(storageUsed / (1024 * 1024 * 1024)).toFixed(1)} GB used</span>
            <span className="sm:hidden">{(storageUsed / (1024 * 1024)).toFixed(0)} MB</span>
          </span>
          <span data-testid="text-storage-total">
            <span className="hidden sm:inline">{(storageTotal / (1024 * 1024 * 1024)).toFixed(0)} GB total</span>
            <span className="sm:hidden">{(storageTotal / (1024 * 1024 * 1024)).toFixed(0)} GB</span>
          </span>
        </div>
      </div>
    </div>
  );
}
