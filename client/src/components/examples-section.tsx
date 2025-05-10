import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCode, FileText, FileSpreadsheet, Info } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ExamplesSection() {
  const { toast } = useToast();
  
  const loadExampleMutation = useMutation({
    mutationFn: async (fileType: string) => {
      const response = await apiRequest('GET', `/api/examples/${fileType}`, undefined);
      return response.json();
    },
    onError: (error) => {
      toast({
        title: "Error loading example",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleUseExample = (fileType: string) => {
    loadExampleMutation.mutate(fileType);
  };
  
  return (
    <section className="mb-10 max-w-5xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Sample Data Examples</h3>
          <p className="text-gray-600 mb-6">
            Don't have a file to upload? Here are some sample data files you can use to test the parser.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FileCode className="h-6 w-6 text-primary mr-2" />
                  <h4 className="font-medium">establishments.json</h4>
                </div>
                <span className="text-xs text-gray-500">24.5 KB</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Sample JSON file containing information about various commercial establishments in Saudi Arabia.
              </p>
              <Button 
                variant="link" 
                className="text-primary p-0 h-auto font-medium"
                onClick={() => handleUseExample('json')}
                disabled={loadExampleMutation.isPending}
              >
                Use This Example
              </Button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:border-accent hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FileText className="h-6 w-6 text-accent mr-2" />
                  <h4 className="font-medium">commercial_data.xml</h4>
                </div>
                <span className="text-xs text-gray-500">18.2 KB</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                XML data featuring business establishments with location details and categorization.
              </p>
              <Button 
                variant="link" 
                className="text-accent p-0 h-auto font-medium"
                onClick={() => handleUseExample('xml')}
                disabled={loadExampleMutation.isPending}
              >
                Use This Example
              </Button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:border-secondary hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FileSpreadsheet className="h-6 w-6 text-secondary mr-2" />
                  <h4 className="font-medium">business_registry.xlsx</h4>
                </div>
                <span className="text-xs text-gray-500">32.8 KB</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Excel spreadsheet containing detailed registry of businesses with multiple worksheet tabs.
              </p>
              <Button 
                variant="link" 
                className="text-secondary p-0 h-auto font-medium"
                onClick={() => handleUseExample('excel')}
                disabled={loadExampleMutation.isPending}
              >
                Use This Example
              </Button>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">Need help finding data?</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Visit the <a href="https://data.gov.sa/en" className="text-primary hover:underline">Saudi Open Data Portal</a> to access a wide range of 
                  publicly available datasets about commercial establishments, businesses, and economic indicators.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
