import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Code, Info, Download, Share } from "lucide-react";
import { FileData } from "@/types";
import TreeView from "@/components/ui/tree-view";

interface ResultsSectionProps {
  fileData: FileData;
}

export default function ResultsSection({ fileData }: ResultsSectionProps) {
  const [tab, setTab] = useState("preview");
  
  const renderPreviewContent = () => {
    switch (fileData.fileType) {
      case 'json':
        return (
          <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-[500px]">
            <TreeView data={fileData.parsedData} fileType="json" />
          </div>
        );
      case 'xml':
        return (
          <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-[500px]">
            <TreeView data={fileData.parsedData} fileType="xml" />
          </div>
        );
      case 'excel':
        return (
          <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-[500px]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    {fileData.columns && fileData.columns.map((column, index) => (
                      <th 
                        key={index}
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fileData.rows && fileData.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return <div>Unsupported file format</div>;
    }
  };
  
  return (
    <section className="mb-10 max-w-5xl mx-auto">
      <Card>
        <Tabs value={tab} onValueChange={setTab}>
          <div className="border-b border-gray-200">
            <TabsList className="mx-6 -mb-px">
              <TabsTrigger value="preview" className="flex items-center gap-2 px-6 py-4">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="raw" className="flex items-center gap-2 px-6 py-4">
                <Code className="h-4 w-4" />
                Raw Data
              </TabsTrigger>
              <TabsTrigger value="information" className="flex items-center gap-2 px-6 py-4">
                <Info className="h-4 w-4" />
                Information
              </TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="p-6">
            <TabsContent value="preview" className="mt-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Data Preview</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Share className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
              
              {renderPreviewContent()}
            </TabsContent>
            
            <TabsContent value="raw" className="mt-0">
              <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-[500px]">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                  {typeof fileData.parsedData === 'object' 
                    ? JSON.stringify(fileData.parsedData, null, 2) 
                    : fileData.parsedData.toString()}
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="information" className="mt-0">
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">FILE INFORMATION</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{fileData.fileName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Format</p>
                      <p className="font-medium">{fileData.fileType.toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Size</p>
                      <p className="font-medium">{fileData.fileSize}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Modified</p>
                      <p className="font-medium">{fileData.lastModified}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">DATA STATISTICS</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-500 mb-1">Entries</p>
                      <p className="text-2xl font-bold text-blue-700">{fileData.stats?.entries || 0}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-500 mb-1">Fields</p>
                      <p className="text-2xl font-bold text-green-700">{fileData.stats?.fields || 0}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-500 mb-1">Data Quality</p>
                      <p className="text-2xl font-bold text-purple-700">{fileData.stats?.quality || '0%'}</p>
                    </div>
                  </div>
                </div>
                
                {fileData.dataDistribution && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">DATA DISTRIBUTION</h4>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between mt-4 text-xs text-gray-500">
                        {Object.entries(fileData.dataDistribution).map(([key, value], index) => (
                          <div key={index}>
                            <div className="flex items-center">
                              <span 
                                className={`w-3 h-3 rounded-full inline-block mr-1 ${
                                  index === 0 ? 'bg-blue-500' : 
                                  index === 1 ? 'bg-green-500' : 
                                  index === 2 ? 'bg-yellow-500' : 
                                  'bg-purple-500'
                                }`}
                              ></span>
                              <span>{key} ({value})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </section>
  );
}
