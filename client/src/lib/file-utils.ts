import { 
  FileText, 
  Code, 
  Image, 
  FileCode,
  FileSpreadsheet,
  File as FileIcon,
  FileVideo,
  FileAudio,
  Archive
} from "lucide-react";

export function getFileIcon(mimeType: string, filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  
  // Code files
  if (['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'h', 'php', 'rb', 'go', 'rs'].includes(ext)) {
    return Code;
  }
  
  // Web files
  if (['html', 'css', 'xml', 'json'].includes(ext)) {
    return FileCode;
  }
  
  // Images
  if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
    return Image;
  }
  
  // Videos
  if (mimeType.startsWith('video/') || ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(ext)) {
    return FileVideo;
  }
  
  // Audio
  if (mimeType.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(ext)) {
    return FileAudio;
  }
  
  // Spreadsheets
  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return FileSpreadsheet;
  }
  
  // Archives
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return Archive;
  }
  
  // Text files
  if (mimeType.startsWith('text/') || ['txt', 'md', 'rtf'].includes(ext)) {
    return FileText;
  }
  
  return FileIcon;
}

export function getFileType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  
  const types: Record<string, string> = {
    // Code
    'js': 'JavaScript',
    'jsx': 'React JSX',
    'ts': 'TypeScript',
    'tsx': 'React TSX',
    'py': 'Python',
    'java': 'Java',
    'cpp': 'C++',
    'c': 'C',
    'h': 'Header',
    'css': 'CSS',
    'html': 'HTML',
    'php': 'PHP',
    'rb': 'Ruby',
    'go': 'Go',
    'rs': 'Rust',
    
    // Documents
    'pdf': 'PDF Document',
    'doc': 'Word Document',
    'docx': 'Word Document',
    'txt': 'Text File',
    'md': 'Markdown',
    'rtf': 'Rich Text',
    
    // Data
    'json': 'JSON',
    'xml': 'XML',
    'csv': 'CSV',
    'xls': 'Excel',
    'xlsx': 'Excel',
    
    // Media
    'jpg': 'JPEG Image',
    'jpeg': 'JPEG Image',
    'png': 'PNG Image',
    'gif': 'GIF Image',
    'svg': 'SVG Image',
    'webp': 'WebP Image',
    'mp4': 'MP4 Video',
    'avi': 'AVI Video',
    'mov': 'QuickTime Video',
    'mp3': 'MP3 Audio',
    'wav': 'WAV Audio',
    'ogg': 'OGG Audio',
    
    // Archives
    'zip': 'ZIP Archive',
    'rar': 'RAR Archive',
    '7z': '7-Zip Archive',
    'tar': 'TAR Archive',
    'gz': 'Gzip Archive'
  };
  
  return types[ext] || 'Unknown File';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function isTextFile(mimeType: string, filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const textExtensions = [
    'txt', 'md', 'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'h',
    'css', 'html', 'xml', 'json', 'php', 'rb', 'go', 'rs', 'sh', 'yml', 'yaml'
  ];
  
  return mimeType.startsWith('text/') || textExtensions.includes(ext);
}

export function isImageFile(mimeType: string, filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'];
  
  return mimeType.startsWith('image/') || imageExtensions.includes(ext);
}
