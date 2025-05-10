import { FileSearchIcon, CircleHelp, Settings2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FileSearchIcon className="text-primary h-6 w-6 mr-2" />
            <h1 className="text-xl font-semibold text-gray-800">Data Parser</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" aria-label="Help">
              <CircleHelp className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings2Icon className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
