import { FileCodeIcon, FileTextIcon, FileSpreadsheetIcon } from "lucide-react";

export default function IntroSection() {
  return (
    <section className="mb-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload and Analyze Data Files</h2>
        <p className="text-lg text-gray-600 mb-6">
          Upload JSON, XML, or Excel files to parse and visualize the data in a structured format.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-center mb-3">
              <FileCodeIcon className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-medium text-lg mb-2">JSON Files</h3>
            <p className="text-gray-500 text-sm">
              Upload and parse JSON data into an interactive tree view.
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-center mb-3">
              <FileTextIcon className="h-10 w-10 text-accent" />
            </div>
            <h3 className="font-medium text-lg mb-2">XML Files</h3>
            <p className="text-gray-500 text-sm">
              Convert XML documents into structured, readable formats.
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-center mb-3">
              <FileSpreadsheetIcon className="h-10 w-10 text-secondary" />
            </div>
            <h3 className="font-medium text-lg mb-2">Excel Files</h3>
            <p className="text-gray-500 text-sm">
              Transform Excel spreadsheets into interactive tables.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
