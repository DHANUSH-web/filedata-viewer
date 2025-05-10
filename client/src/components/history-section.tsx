import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, FileIcon, Clock, HardDrive } from "lucide-react";
import { FileData } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { formatFileSize } from "@/lib/utils";

interface HistorySectionProps {
  onFileSelected: (data: FileData) => void;
}

export interface StoredFile {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  parsedData: any;
  createdAt: string;
}

export default function HistorySection({ onFileSelected }: HistorySectionProps) {
  const [selectedFile, setSelectedFile] = useState<number | null>(null);
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['/api/files'],
    refetchOnWindowFocus: false,
    retry: 1
  }) as { data: { files: StoredFile[] } | undefined, isLoading: boolean, isError: boolean, error: Error | null };
  
  const handleLoadFile = async (file: StoredFile) => {
    setSelectedFile(file.id);
    
    try {
      const response = await fetch(`/api/files/${file.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to load file');
      }
      
      const result = await response.json();
      
      if (result.success && result.file) {
        const storedFile = result.file;
        
        onFileSelected({
          fileName: storedFile.fileName,
          fileSize: formatFileSize(storedFile.fileSize),
          fileType: storedFile.fileType,
          lastModified: new Date(storedFile.createdAt).toLocaleString(),
          parsedData: storedFile.parsedData,
          // These would be computed on the fly in a real implementation
          // For now we'll use placeholder values
          columns: [],
          rows: [],
          stats: {
            entries: 0,
            fields: 0,
            quality: "N/A"
          },
          dataDistribution: {}
        });
      }
    } catch (err) {
      console.error("Error loading file:", err);
    } finally {
      setSelectedFile(null);
    }
  };

  if (isLoading) {
    return (
      <section className="mb-10 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mb-10 max-w-3xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load file history"}
          </AlertDescription>
        </Alert>
      </section>
    );
  }

  const files: StoredFile[] = data?.files || [];
  
  if (files.length === 0) {
    return (
      <section className="mb-10 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
              <HardDrive className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-sm text-gray-500">
                No upload history found. Upload a file to get started.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mb-10 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-200">
            {files.map((file) => (
              <div key={file.id} className="py-4 flex items-start">
                <div className="flex-shrink-0 p-2">
                  <FileIcon className={`h-10 w-10 ${
                    file.fileType === 'json' ? 'text-primary' : 
                    file.fileType === 'xml' ? 'text-purple-600' : 
                    'text-secondary'
                  }`} />
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="text-base font-medium text-gray-900">{file.fileName}</h4>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {new Date(file.createdAt).toLocaleDateString()}
                    </span>
                    <span className="ml-4 flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {new Date(file.createdAt).toLocaleTimeString()}
                    </span>
                    <span className="ml-4">
                      {formatFileSize(file.fileSize)}
                    </span>
                  </div>
                </div>
                <div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleLoadFile(file)}
                    disabled={selectedFile === file.id}
                  >
                    {selectedFile === file.id ? 'Loading...' : 'View'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}