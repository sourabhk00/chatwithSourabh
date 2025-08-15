import { useState, useEffect } from "react";
import { FileManagerSidebar } from "@/components/file-manager/FileManagerSidebar";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { TopNavigation } from "@/components/navigation/TopNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChat } from "@/hooks/use-chat";

export default function ChatPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editorVisible, setEditorVisible] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'files' | 'history'>('files');
  const isMobile = useIsMobile();
  const { messages } = useChat();
  
  // Auto-collapse sidebar on mobile when starting to chat
  useEffect(() => {
    if (isMobile && messages.length > 0 && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
  }, [isMobile, messages.length, sidebarCollapsed]);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleEditor = () => setEditorVisible(!editorVisible);

  // Update body class based on whether we have messages
  useEffect(() => {
    if (messages.length === 0) {
      document.body.classList.add('gradient');
      document.body.classList.remove('dark');
    } else {
      document.body.classList.remove('gradient');
      document.body.classList.add('dark');
    }
    
    return () => {
      document.body.classList.remove('gradient', 'dark');
    };
  }, [messages.length]);

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white overflow-hidden relative">
      {/* Top Navigation */}
      <TopNavigation 
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        messages={messages}
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* File Manager Sidebar */}
        <FileManagerSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={toggleSidebar}
          selectedFileIds={selectedFileIds}
          onFileSelect={setSelectedFileIds}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* Sidebar Overlay for mobile */}
        {isMobile && !sidebarCollapsed && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={toggleSidebar}
            data-testid="sidebar-overlay"
          />
        )}
        
        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col lg:flex-row chat-container transition-all duration-300 ${
          isMobile && !sidebarCollapsed ? 'sidebar-open' : ''
        }`}>
          {/* Chat Interface */}
          <ChatInterface
            onToggleSidebar={toggleSidebar}
            onToggleEditor={toggleEditor}
            selectedFileIds={selectedFileIds}
            editorVisible={editorVisible}
          />
          
          {/* Code Editor */}
          {editorVisible && (
            <div className={`${isMobile ? 'fixed inset-0 z-20 bg-slate-900' : 'w-1/2'}`}>
              <CodeEditor 
                onClose={() => setEditorVisible(false)}
                visible={editorVisible}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
