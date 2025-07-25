import React from 'react';
import { Button } from './ui/button';

const ActionButton = ({ onClick, children, variant = "default", className = "" }) => {
  const baseClasses = "w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-200";
  
  const variantClasses = {
    default: "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600",
    secondary: "bg-white text-pink-600 border-2 border-pink-200 hover:bg-pink-50"
  };

  return (
    <Button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Button>
  );
};

export default ActionButton;

