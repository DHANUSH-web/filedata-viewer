import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/use-file-upload";
import FileUpload from "@/components/ui/file-upload";
import { AlertCircle, X, FileCode, FileSpreadsheet, FileText } from "lucide-react";
import { FileData } from "@/types";

interface FileUploadSectionProps {
  onFileProcessed: (data: FileData) => void;
  onClearFile: () => void;
}

export default function FileUploadSection({ onFileProcessed, onClearFile }: FileUploadSectionProps) {
  const {
    selectedFile,
    fileType,
    isProcessing,
    errorMessage,
    handleFileSelect,
    handleFileDrop,
    removeFile,
    processFile,
    formatFileSize
  } = useFileUpload({ onFileProcessed, onClearFile });

  const FileTypeIcon = () => {
    switch (fileType) {
      case 'json':
        return <FileCode className="text-primary h-5 w-5" />;
      case 'xml':
        return <FileText className="text-accent h-5 w-5" />;
      case 'excel':
        return <FileSpreadsheet className="text-secondary h-5 w-5" />;
      case 'csv':
        return <FileSpreadsheet className="text-green-600 h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <section className="mb-10 max-w-3xl mx-auto">
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload Your Data File</h3>
          
          <FileUpload 
            onFileSelect={handleFileSelect}
            onFileDrop={handleFileDrop}
            acceptedFileTypes=".json,.xml,.xlsx,.xls,.csv"
          />
          
          {selectedFile && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FileTypeIcon />
                </div>
                <div className="ml-3 flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{selectedFile.name}</h4>
                  <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
                <button
                  onClick={removeFile}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-500"
                  aria-label="Remove file"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mt-3 flex justify-end">
                <Button
                  onClick={processFile}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Process File'
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {errorMessage && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
