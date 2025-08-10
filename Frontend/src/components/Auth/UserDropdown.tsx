import React, { useState, useRef, useEffect } from 'react';
import { Crown, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface UserDropdownProps {
  onEditProfile: () => void;
  onPremium: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ onEditProfile, onPremium }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const userInitial = user.username.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-emerald-600 text-white font-medium flex items-center justify-center hover:bg-emerald-700 transition-colors"
      >
        {userInitial}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.isPremium ? 'Premium User' : 'Standard User'}
            </p>
          </div>
          
          <button
            onClick={() => {
              onEditProfile();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <Settings size={16} className="mr-3" />
            Edit Profile
          </button>
          
          <button
            onClick={() => {
              onPremium();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <Crown size={16} className="mr-3" />
            Premium
          </button>
          
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <LogOut size={16} className="mr-3" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;