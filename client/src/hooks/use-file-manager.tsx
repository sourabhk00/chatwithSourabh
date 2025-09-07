import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { File } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";


export function useFileManager() {
  const [uploadProgress, setUploadProgress] = useState<number | undefined>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch files
  const { data: files = [] } = useQuery<File[]>({
    queryKey: ["/api/files"],
    refetchOnWindowFocus: false,
  });

  // Upload file mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: globalThis.File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `File "${data.originalName}" uploaded successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      setUploadProgress(undefined);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
      setUploadProgress(undefined);
    },
  });

  // Delete file mutation
  const deleteMutation = useMutation({
    mutationFn: async (fileId: string) => {
      await apiRequest("DELETE", `/api/files/${fileId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    },
  });

  // Analyze file mutation
  const analyzeMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const response = await apiRequest("POST", `/api/files/${fileId}/analyze`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis Complete",
        description: "File analysis added to chat",
      });
      
      // Add analysis to chat
      const analysisMessage = {
        content: `📊 **File Analysis Results:**\n\n${data.text}`,
        sender: 'ai',
        fileIds: []
      };
      
      apiRequest("POST", "/api/chat/send", analysisMessage).then(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to analyze file",
        variant: "destructive",
      });
    },
  });

  const uploadFile = useCallback(async (file: globalThis.File) => {
    setUploadProgress(0);
    
    // Simulate progress for demo
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === undefined) return 0;
        const newProgress = prev + 10;
        if (newProgress >= 90) {
          clearInterval(interval);
          return 90;
        }
        return newProgress;
      });
    }, 100);

    await uploadMutation.mutateAsync(file);
  }, [uploadMutation]);

  const deleteFile = useCallback(async (fileId: string) => {
    await deleteMutation.mutateAsync(fileId);
  }, [deleteMutation]);

  const analyzeFile = useCallback(async (fileId: string) => {
    await analyzeMutation.mutateAsync(fileId);
  }, [analyzeMutation]);

  // Calculate storage usage (mock data for demo)
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const storageUsed = totalSize;
  const storageTotal = 10 * 1024 * 1024 * 1024; // 10GB

  return {
    files,
    uploadFile,
    deleteFile,
    analyzeFile,
    uploadProgress,
    storageUsed,
    storageTotal,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isAnalyzing: analyzeMutation.isPending,
  };
}
