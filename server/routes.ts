import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { parseJsonFile, parseXmlFile, parseExcelFile } from "./utils/file-parsers";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const filetypes = /json|xml|xlsx|xls/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("File upload only supports the following filetypes - " + filetypes));
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // File upload endpoint
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }
      
      const fileBuffer = req.file.buffer;
      const filename = req.file.originalname;
      const fileExtension = path.extname(filename).toLowerCase();

      let result;
      
      switch (fileExtension) {
        case '.json':
          result = await parseJsonFile(fileBuffer);
          break;
        case '.xml':
          result = await parseXmlFile(fileBuffer);
          break;
        case '.xlsx':
        case '.xls':
          result = await parseExcelFile(fileBuffer);
          break;
        default:
          return res.status(400).json({ 
            success: false, 
            message: "Unsupported file format" 
          });
      }
      
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
