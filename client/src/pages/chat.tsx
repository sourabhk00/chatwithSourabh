import { useState, useEffect } from "react";
import { FileManagerSidebar } from "@/components/file-manager/FileManagerSidebar";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChat } from "@/hooks/use-chat";

export default function ChatPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editorVisible, setEditorVisible] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const isMobile = useIsMobile();
  const { messages } = useChat();

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
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* File Manager Sidebar */}
      <FileManagerSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={toggleSidebar}
        selectedFileIds={selectedFileIds}
        onFileSelect={setSelectedFileIds}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Chat Interface */}
        <ChatInterface
          onToggleSidebar={toggleSidebar}
          onToggleEditor={toggleEditor}
          selectedFileIds={selectedFileIds}
          editorVisible={editorVisible}
        />
        
        {/* Code Editor */}
        {editorVisible && (
          <CodeEditor 
            onClose={() => setEditorVisible(false)}
            visible={editorVisible}
          />
        )}
      </div>
    </div>
  );
}
