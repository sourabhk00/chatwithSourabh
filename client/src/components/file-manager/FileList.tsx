import { File as FileType } from "@shared/schema";
import { useFileManager } from "@/hooks/use-file-manager";
import { getFileIcon, getFileType, formatFileSize } from "@/lib/file-utils";
import { Edit, Trash2, Eye, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface FileListProps {
  files: FileType[];
  selectedFileIds: string[];
  onFileSelect: (fileIds: string[]) => void;
}

export function FileList({ files, selectedFileIds, onFileSelect }: FileListProps) {
  const { deleteFile, analyzeFile } = useFileManager();

  const handleFileToggle = (fileId: string, checked: boolean) => {
    if (checked) {
      onFileSelect([...selectedFileIds, fileId]);
    } else {
      onFileSelect(selectedFileIds.filter(id => id !== fileId));
    }
  };

  const handleAnalyze = async (file: FileType) => {
    try {
      await analyzeFile(file.id);
    } catch (error) {
      console.error('Failed to analyze file:', error);
    }
  };

  const handleDelete = async (file: FileType) => {
    if (confirm(`Are you sure you want to delete "${file.originalName}"?`)) {
      try {
        await deleteFile(file.id);
        // Remove from selection if selected
        if (selectedFileIds.includes(file.id)) {
          onFileSelect(selectedFileIds.filter(id => id !== file.id));
        }
      } catch (error) {
        console.error('Failed to delete file:', error);
      }
    }
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <p className="text-sm">No files uploaded yet</p>
        <p className="text-xs mt-1">Upload some files to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2" data-testid="list-files">
      {files.map((file) => {
        const IconComponent = getFileIcon(file.mimeType, file.originalName);
        const isSelected = selectedFileIds.includes(file.id);

        return (
          <div 
            key={file.id} 
            className="file-item p-3 rounded-lg bg-slate-700 cursor-pointer"
            data-testid={`item-file-${file.id}`}
          >
            <div className="flex items-center">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => handleFileToggle(file.id, checked as boolean)}
                className="mr-3"
                data-testid={`checkbox-file-${file.id}`}
              />
              
              <IconComponent className="mr-3 h-4 w-4" />
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate" title={file.originalName}>
                  {file.originalName}
                </p>
                <p className="text-xs text-slate-400">
                  {formatFileSize(file.size)} • {getFileType(file.originalName)}
                </p>
              </div>
              
              <div className="flex space-x-1 ml-2">
                {file.mimeType.startsWith('image/') ? (
                  <button
                    onClick={() => handleAnalyze(file)}
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                    title="Analyze Image"
                    data-testid={`button-analyze-${file.id}`}
                  >
                    <Search className="h-3 w-3" />
                  </button>
                ) : file.content ? (
                  <button
                    onClick={() => handleAnalyze(file)}
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                    title="Analyze File"
                    data-testid={`button-analyze-${file.id}`}
                  >
                    <Eye className="h-3 w-3" />
                  </button>
                ) : null}
                
                <button
                  onClick={() => handleDelete(file)}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                  title="Delete"
                  data-testid={`button-delete-${file.id}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
