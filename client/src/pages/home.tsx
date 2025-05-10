import Header from "@/components/header";
import IntroSection from "@/components/intro-section";
import FileUploadSection from "@/components/file-upload-section";
import ResultsSection from "@/components/results-section";
import ExamplesSection from "@/components/examples-section";
import HistorySection from "@/components/history-section";
import Footer from "@/components/footer";
import { useState } from "react";
import { FileData } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Clock, Layout } from "lucide-react";

export default function Home() {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  
  const handleFileProcessed = (data: FileData) => {
    setFileData(data);
    setActiveTab("upload"); // Switch to upload tab to show results
  };
  
  const handleClearData = () => {
    setFileData(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <IntroSection />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-6">
            <FileUploadSection onFileProcessed={handleFileProcessed} onClearFile={handleClearData} />
            
            {fileData ? (
              <ResultsSection fileData={fileData} />
            ) : (
              <ExamplesSection />
            )}
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <HistorySection onFileSelected={handleFileProcessed} />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
