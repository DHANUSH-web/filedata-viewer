import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FileData } from "@/types";

interface UseFileUploadProps {
  onFileProcessed: (data: FileData) => void;
  onClearFile: () => void;
}

export function useFileUpload({ onFileProcessed, onClearFile }: UseFileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  
  const getFileType = (fileName: string): string | null => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (!extension) return null;
    
    if (extension === 'json') return 'json';
    if (extension === 'xml') return 'xml';
    if (extension === 'xlsx' || extension === 'xls') return 'excel';
    
    return null;
  };
  
  const validateFile = (file: File): boolean => {
    const validExtensions = ['.json', '.xml', '.xlsx', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setErrorMessage('Invalid file format. Please upload JSON, XML, or Excel files.');
      return false;
    }
    
    return true;
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      handleFileDrop(file);
    }
  };
  
  const handleFileDrop = (file: File) => {
    setErrorMessage(null);
    
    if (!validateFile(file)) {
      return;
    }
    
    setSelectedFile(file);
    setFileType(getFileType(file.name));
  };
  
  const removeFile = () => {
    setSelectedFile(null);
    setFileType(null);
    setErrorMessage(null);
    onClearFile();
  };
  
  const processMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || response.statusText);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "File processed successfully",
        description: "Your file has been uploaded and processed.",
      });
      
      onFileProcessed({
        fileName: selectedFile!.name,
        fileSize: formatFileSize(selectedFile!.size),
        fileType: fileType!,
        lastModified: new Date(selectedFile!.lastModified).toLocaleString(),
        parsedData: data.data,
        columns: data.columns,
        rows: data.rows,
        stats: data.stats,
        dataDistribution: data.dataDistribution
      });
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
      toast({
        title: "Error processing file",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const processFile = () => {
    if (!selectedFile) return;
    
    processMutation.mutate(selectedFile);
  };
  
  return {
    selectedFile,
    fileType,
    isProcessing: processMutation.isPending,
    errorMessage,
    handleFileSelect,
    handleFileDrop,
    removeFile,
    processFile,
    formatFileSize
  };
}
