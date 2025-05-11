import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LogIn, UserPlus } from 'lucide-react';

export default function AuthBanner() {
  const [, setLocation] = useLocation();

  return (
    <Card className="mb-6 border-primary/20 bg-primary/5">
      <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-4 sm:mb-0">
          <h3 className="text-lg font-medium">Sign in to save your work</h3>
          <p className="text-sm text-muted-foreground">
            Create an account to save your file analysis and access them anytime.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setLocation('/login')}
            className="flex items-center"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Log In
          </Button>
          <Button 
            onClick={() => setLocation('/signup')}
            className="flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Sign Up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}