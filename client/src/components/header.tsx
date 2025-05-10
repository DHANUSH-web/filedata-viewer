import { FileSearchIcon, CircleHelp, Settings2Icon, LogOut, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [, setLocation] = useLocation();
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      setLocation('/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => setLocation('/')}>
            <FileSearchIcon className="text-primary h-6 w-6 mr-2" />
            <h1 className="text-xl font-semibold text-gray-800">File Data Viewer</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" aria-label="Help">
              <CircleHelp className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings2Icon className="h-5 w-5 text-gray-600" />
            </Button>
            
            {currentUser ? (
              <Button variant="outline" onClick={handleLogout} className="flex items-center">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setLocation('/login')} className="flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button variant="default" onClick={() => setLocation('/signup')} className="flex items-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
