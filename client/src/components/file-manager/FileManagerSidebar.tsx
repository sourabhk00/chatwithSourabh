import { FileUploadZone } from "./FileUploadZone";
import { FileList } from "./FileList";
import { useFileManager } from "@/hooks/use-file-manager";
import { X, FolderOpen } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface FileManagerSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  selectedFileIds: string[];
  onFileSelect: (fileIds: string[]) => void;
}

export function FileManagerSidebar({ 
  collapsed, 
  onToggle, 
  selectedFileIds, 
  onFileSelect 
}: FileManagerSidebarProps) {
  const { files, uploadProgress, storageUsed, storageTotal } = useFileManager();
  const isMobile = useIsMobile();

  return (
    <div 
      className={`w-80 bg-slate-800 border-r border-slate-700 flex flex-col panel-transition
        ${collapsed ? 'sidebar-collapsed' : ''}
        ${isMobile ? 'absolute inset-y-0 left-0 z-40' : ''}`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center" data-testid="sidebar-title">
          <FolderOpen className="mr-2 h-5 w-5 text-blue-400" />
          File Manager
        </h2>
        <button 
          onClick={onToggle}
          className="lg:hidden text-slate-400 hover:text-white transition-colors"
          data-testid="button-close-sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

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
