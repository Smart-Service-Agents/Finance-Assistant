import React from 'react';
import { LogIn } from 'lucide-react';

interface AuthButtonProps {
  onClick: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
    >
      <LogIn size={18} />
      <span>Sign In</span>
    </button>
  );
};

export default AuthButton;