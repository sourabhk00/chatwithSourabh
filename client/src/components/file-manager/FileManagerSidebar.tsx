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
      className={`w-80 bg-slate-800 border-r border-slate-700 flex flex-col panel-transition
        ${collapsed ? 'sidebar-collapsed' : ''}
        ${isMobile ? 'absolute inset-y-0 left-0 z-40' : ''}`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white" data-testid="sidebar-title">
            Chat with Sourabh
          </h2>
          <button 
            onClick={onToggle}
            className="text-slate-400 hover:text-white transition-colors"
            data-testid="button-close-sidebar"
            title="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-700 rounded-lg p-1">
          <button
            onClick={() => onTabChange('files')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'files'
                ? 'bg-slate-600 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
            data-testid="tab-files"
          >
            <FolderOpen className="h-4 w-4" />
            <span>Files</span>
          </button>
          <button
            onClick={() => onTabChange('history')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-slate-600 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
            data-testid="tab-history"
          >
            <History className="h-4 w-4" />
            <span>History</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'files' ? (
        <>
          {/* File Upload Zone */}
          <div className="p-4">
            <FileUploadZone uploadProgress={uploadProgress} />
          </div>

          {/* File List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wide">
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
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
                  Conversation History
                </h3>
                <button
                  onClick={clearChat}
                  className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                  data-testid="button-clear-history"
                >
                  Clear All
                </button>
              </div>
              
              {Object.keys(groupedMessages).length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs mt-1">Start chatting to see your history</p>
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
                        {msgs.slice(0, 5).map((msg: any, idx: number) => (
                          <div key={idx} className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer">
                            <div className="flex items-start space-x-2">
                              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                msg.sender === 'user' ? 'bg-blue-400' : 'bg-purple-400'
                              }`}></div>
                              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                                {msg.content.substring(0, 100)}{msg.content.length > 100 ? '...' : ''}
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
      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 mb-2">Storage Usage</div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(storageUsed / storageTotal) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span data-testid="text-storage-used">{(storageUsed / (1024 * 1024 * 1024)).toFixed(1)} GB used</span>
          <span data-testid="text-storage-total">{(storageTotal / (1024 * 1024 * 1024)).toFixed(0)} GB total</span>
        </div>
      </div>
    </div>
  );
}
