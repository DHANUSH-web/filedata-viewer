import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { parseJsonFile, parseXmlFile, parseExcelFile, parseCsvFile } from "./utils/file-parsers";

// Define file uploader
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const filetypes = /json|xml|xlsx|xls|csv/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("File upload only supports the following filetypes - " + filetypes));
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get recent file uploads
  app.get("/api/files", async (req, res) => {
    try {
      const files = await storage.getFiles(10); // Get the 10 most recent files
      return res.status(200).json({ 
        success: true, 
        files 
      });
    } catch (error: any) {
      console.error("Error fetching files:", error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || "Failed to fetch files" 
      });
    }
  });
  
  // Get specific file by ID
  app.get("/api/files/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid file ID" });
      }
      
      const file = await storage.getFile(id);
      if (!file) {
        return res.status(404).json({ success: false, message: "File not found" });
      }
      
      return res.status(200).json({ 
        success: true, 
        file 
      });
    } catch (error: any) {
      console.error("Error fetching file:", error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || "Failed to fetch file" 
      });
    }
  });
  
  // File upload endpoint
  app.post("/api/upload", upload.single("file"), async (req: Request & { file?: Express.Multer.File }, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }
      
      const fileBuffer = req.file.buffer;
      const filename = req.file.originalname;
      const fileExtension = path.extname(filename).toLowerCase();
      const fileSize = req.file.size;

      let result;
      let fileType: string;
      
      switch (fileExtension) {
        case '.json':
          result = await parseJsonFile(fileBuffer);
          fileType = 'json';
          break;
        case '.xml':
          result = await parseXmlFile(fileBuffer);
          fileType = 'xml';
          break;
        case '.xlsx':
        case '.xls':
          result = await parseExcelFile(fileBuffer);
          fileType = 'excel';
          break;
        case '.csv':
          result = await parseCsvFile(fileBuffer);
          fileType = 'csv';
          break;
        default:
          return res.status(400).json({ 
            success: false, 
            message: "Unsupported file format" 
          });
      }
      
      // Store file metadata in the database
      const savedFile = await storage.createFile({
        fileName: filename,
        fileType,
        fileSize,
        parsedData: result.data
      });
      
      // Add the saved file ID to the result
      result.fileId = savedFile.id;
      
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Error processing file:", error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || "Failed to process file" 
      });
    }
  });
  
  // Example file endpoints
  app.get("/api/examples/:type", async (req, res) => {
    try {
      const { type } = req.params;
      let filename: string;
      
      switch (type) {
        case 'json':
          filename = 'establishments.json';
          break;
        case 'xml':
          filename = 'commercial_data.xml';
          break;
        case 'excel':
          filename = 'business_registry.xlsx';
          break;
        case 'csv':
          filename = 'business_data.csv';
          break;
        default:
          return res.status(400).json({ 
            success: false, 
            message: "Invalid example type" 
          });
      }
      
      // This would be implemented with real sample files in production
      // For now, we'll return a mock response
      return res.status(501).json({
        success: false,
        message: "Example files are not implemented"
      });
    } catch (error: any) {
      console.error("Error loading example:", error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || "Failed to load example" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
