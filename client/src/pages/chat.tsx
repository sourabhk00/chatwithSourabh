import { useState } from "react";
import { FileManagerSidebar } from "@/components/file-manager/FileManagerSidebar";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ChatPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editorVisible, setEditorVisible] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const isMobile = useIsMobile();

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleEditor = () => setEditorVisible(!editorVisible);

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
