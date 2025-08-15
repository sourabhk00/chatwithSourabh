import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useChat() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch chat messages
  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/messages"],
    refetchOnWindowFocus: false,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, fileIds }: { content: string; fileIds: string[] }) => {
      const response = await apiRequest("POST", "/api/chat/send", {
        content,
        fileIds,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.error) {
        toast({
          title: "Warning",
          description: "AI response may be incomplete due to service issues",
          variant: "destructive",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Clear chat mutation
  const clearChatMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/chat/clear");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
      toast({
        title: "Success",
        description: "Chat history cleared",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear chat history",
        variant: "destructive",
      });
    },
  });

  const sendMessage = useCallback(async (content: string, fileIds: string[] = []) => {
    setIsLoading(true);
    try {
      await sendMessageMutation.mutateAsync({ content, fileIds });
    } finally {
      setIsLoading(false);
    }
  }, [sendMessageMutation]);

  const clearChat = useCallback(async () => {
    await clearChatMutation.mutateAsync();
  }, [clearChatMutation]);

  return {
    messages,
    sendMessage,
    clearChat,
    isLoading: isLoading || sendMessageMutation.isPending,
    error: sendMessageMutation.error,
  };
}
