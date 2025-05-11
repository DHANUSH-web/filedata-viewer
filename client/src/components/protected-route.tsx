import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode; // Optional fallback content for unauthenticated users
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated, show the protected content
  // If not authenticated and fallback is provided, show the fallback
  // If not authenticated and no fallback, show null
  return currentUser ? <>{children}</> : fallback ? <>{fallback}</> : null;
}