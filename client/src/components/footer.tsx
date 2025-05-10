import { FileSearchIcon, GithubIcon, TwitterIcon, LinkedinIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex items-center">
            <FileSearchIcon className="text-primary h-5 w-5 mr-2" />
            <span className="text-sm font-medium text-gray-900">Data Parser</span>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Data Parser. All rights reserved.</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <GithubIcon className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <TwitterIcon className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <LinkedinIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
