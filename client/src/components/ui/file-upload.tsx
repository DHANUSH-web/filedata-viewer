import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileDrop: (file: File) => void;
  acceptedFileTypes: string;
}

export default function FileUpload({ onFileSelect, onFileDrop, acceptedFileTypes }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileDrop(file);
    }
  };
  
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className={cn(
        "rounded-lg p-8 text-center border-2 border-dashed transition-all",
        isDragging ? "border-primary bg-blue-50" : "border-gray-200"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* SVG file upload illustration */}
      <svg 
        className="mx-auto h-32 w-auto mb-4" 
        viewBox="0 0 120 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="20" y="10" width="80" height="80" rx="4" fill="#EBF5FF" />
        <path d="M30 20H90" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" />
        <path d="M30 30H90" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" />
        <path d="M30 40H60" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" />
        <rect x="35" y="50" width="50" height="30" rx="4" fill="#3B82F6" fillOpacity="0.2" />
        <path d="M60 55V65M55 60H65" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 75H70" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" />
      </svg>
      
      <div className="mb-3">
        <span className="font-medium text-gray-900">Drag and drop your file here</span>
        <p className="text-sm text-gray-500 mt-1">Supported formats: JSON, XML, Excel (.xls, .xlsx)</p>
      </div>
      
      <Button 
        variant="default" 
        onClick={handleButtonClick}
        className="cursor-pointer"
      >
        <Upload className="mr-2 h-4 w-4" /> Select File
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef}
          onChange={onFileSelect}
          accept={acceptedFileTypes}
        />
      </Button>
    </div>
  );
}
