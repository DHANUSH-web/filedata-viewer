import Header from "@/components/header";
import IntroSection from "@/components/intro-section";
import FileUploadSection from "@/components/file-upload-section";
import ResultsSection from "@/components/results-section";
import ExamplesSection from "@/components/examples-section";
import Footer from "@/components/footer";
import { useState } from "react";
import { FileData } from "@/types";

export default function Home() {
  const [fileData, setFileData] = useState<FileData | null>(null);
  
  const handleFileProcessed = (data: FileData) => {
    setFileData(data);
  };
  
  const handleClearData = () => {
    setFileData(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <IntroSection />
        <FileUploadSection onFileProcessed={handleFileProcessed} onClearFile={handleClearData} />
        
        {fileData ? (
          <ResultsSection fileData={fileData} />
        ) : (
          <ExamplesSection />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
