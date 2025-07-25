import React from 'react';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';

const ActionButton = ({ onClick, children, variant = "default", className = "" }) => {
  const baseClasses = "w-full py-5 rounded-2xl font-bold text-xl shadow-2xl transition-all duration-300 hover-lift";
  
  const variantClasses = {
    default: `
      bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 
      text-white 
      hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 
      hover:shadow-3xl 
      hover:scale-105 
      active:scale-95
      border-2 border-white/20
      pulse-glow
    `,
    secondary: "bg-white text-pink-600 border-2 border-pink-200 hover:bg-pink-50"
  };

  return (
    <Button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <div className="flex items-center justify-center gap-2">
        <Sparkles className="h-6 w-6" />
        {children}
        <Sparkles className="h-6 w-6" />
      </div>
    </Button>
  );
};

export default ActionButton;

