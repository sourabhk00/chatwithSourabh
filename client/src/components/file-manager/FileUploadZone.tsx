import { useCallback, useState } from "react";
import { useFileManager } from "@/hooks/use-file-manager";
import { CloudUpload } from "lucide-react";

interface FileUploadZoneProps {
  uploadProgress?: number;
}

export function FileUploadZone({ uploadProgress }: FileUploadZoneProps) {
  const { uploadFile } = useFileManager();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => uploadFile(file));
  }, [uploadFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => uploadFile(file));
    // Reset input
    e.target.value = '';
  }, [uploadFile]);

  const handleClick = () => {
    document.getElementById('file-input')?.click();
  };

  return (
    <div 
      className={`file-upload-zone rounded-xl p-6 text-center cursor-pointer ${
        isDragOver ? 'dragover' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      data-testid="zone-file-upload"
    >
      <CloudUpload className="mx-auto h-8 w-8 text-slate-400 mb-3" />
      <p className="text-slate-300 mb-2">Drop files here or click to upload</p>
      <p className="text-xs text-slate-500">Supports: PDF, TXT, DOC, Images, Code files</p>
      
      {uploadProgress !== undefined && uploadProgress > 0 && (
        <div className="mt-3">
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">{uploadProgress}% uploaded</p>
        </div>
      )}
      
      <input
        type="file"
        id="file-input"
        className="hidden"
        multiple
        accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png,.gif,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.h,.css,.html,.json,.md,.xml"
        onChange={handleFileSelect}
        data-testid="input-file-upload"
      />
    </div>
  );
}
