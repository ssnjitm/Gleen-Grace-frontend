import React, { type ReactNode } from 'react';
import { Cross } from 'lucide-react';

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AuthCard: React.FC<AuthCardProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-amber-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-amber-100">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
              <Cross className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            {title}
          </h2>
          <p className="text-center text-gray-600 mb-8">
            {subtitle}
          </p>
          
          {children}
        </div>
        
        {/* Bible Verse */}
        <div className="text-center mt-6 text-gray-500 text-3xl">
          <p>"I am the way, the truth, and the life."</p>
          <p className="text-2xl mt-1">- John 14:6</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;