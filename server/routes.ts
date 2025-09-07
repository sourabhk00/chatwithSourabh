import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { generateChatResponse, analyzeFile, analyzeImage } from "./services/gemini";
import { insertFileSchema, insertChatMessageSchema } from "@shared/schema";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allow common file types
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/json',
      'text/javascript',
      'text/html',
      'text/css',
      'text/markdown',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(txt|js|jsx|ts|tsx|py|java|cpp|c|h|css|html|json|md|xml)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all files
  app.get("/api/files", async (req, res) => {
    try {
      const files = await storage.getFiles();
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  // Upload file
  app.post("/api/files/upload", upload.single('file'), async (req: Express.Request, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      let content = '';
      const isTextFile = req.file.mimetype.startsWith('text/') || 
                        req.file.originalname.match(/\.(txt|js|jsx|ts|tsx|py|java|cpp|c|h|css|html|json|md|xml)$/i);
      
      if (isTextFile) {
        content = fs.readFileSync(req.file.path, 'utf-8');
      }

      const fileData = insertFileSchema.parse({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        content: content || null,
      });

      const file = await storage.createFile(fileData);
      res.json(file);
    } catch (error) {
      console.error("File upload error:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Delete file
  app.delete("/api/files/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const file = await storage.getFile(id);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      // Delete physical file
      const filePath = path.join(uploadDir, file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      const deleted = await storage.deleteFile(id);
      if (deleted) {
        res.json({ message: "File deleted successfully" });
      } else {
        res.status(404).json({ message: "File not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // Get file content
  app.get("/api/files/:id/content", async (req, res) => {
    try {
      const { id } = req.params;
      const file = await storage.getFile(id);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      if (file.content) {
        res.json({ content: file.content });
      } else {
        // Try to read from disk for non-text files
        const filePath = path.join(uploadDir, file.filename);
        if (fs.existsSync(filePath)) {
          if (file.mimeType.startsWith('image/')) {
            const imageAnalysis = await analyzeImage(filePath);
            res.json({ content: imageAnalysis.text, analyzed: true });
          } else {
            res.status(400).json({ message: "File content not available" });
          }
        } else {
          res.status(404).json({ message: "File not found on disk" });
        }
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to get file content" });
    }
  });

  // Get chat messages
  app.get("/api/chat/messages", async (req, res) => {
    try {
      const messages = await storage.getChatMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Send chat message
  app.post("/api/chat/send", async (req, res) => {
    try {
      const { content, fileIds } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: "Message content is required" });
      }

      // Save user message
      const userMessageData = insertChatMessageSchema.parse({
        content,
        sender: 'user',
        fileIds: fileIds || []
      });
      const userMessage = await storage.createChatMessage(userMessageData);

      // Get file contents if fileIds provided
      let fileContents: Array<{ filename: string; content: string; mimeType: string }> = [];
      if (fileIds && fileIds.length > 0) {
        for (const fileId of fileIds) {
          const file = await storage.getFile(fileId);
          if (file && file.content) {
            fileContents.push({
              filename: file.originalName,
              content: file.content,
              mimeType: file.mimeType
            });
          }
        }
      }

      // Generate AI response
      const aiResponse = await generateChatResponse(content, fileContents);
      
      // Save AI message
      const aiMessageData = insertChatMessageSchema.parse({
        content: aiResponse.text,
        sender: 'ai',
        fileIds: []
      });
      const aiMessage = await storage.createChatMessage(aiMessageData);

      res.json({
        userMessage,
        aiMessage,
        error: aiResponse.error
      });
    } catch (error) {
      console.error("Chat send error:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Clear chat history
  app.delete("/api/chat/clear", async (req, res) => {
    try {
      await storage.clearChatHistory();
      res.json({ message: "Chat history cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear chat history" });
    }
  });

  // Analyze file
  app.post("/api/files/:id/analyze", async (req, res) => {
    try {
      const { id } = req.params;
      const file = await storage.getFile(id);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      let analysis;
      if (file.mimeType.startsWith('image/')) {
        const filePath = path.join(uploadDir, file.filename);
        analysis = await analyzeImage(filePath);
      } else if (file.content) {
        analysis = await analyzeFile(file.originalName, file.content, file.mimeType);
      } else {
        return res.status(400).json({ message: "File cannot be analyzed" });
      }

      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
