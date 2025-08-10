import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthButton from './AuthButton';
import UserDropdown from '../Auth/UserDropdown';
import AuthModal from '../Auth/AuthModal';
import EditProfileModal from '../Profile/EditProfileModal';

const ThemeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Check if user has a preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-20 flex items-center space-x-3">
        {!loading && (
          <>
            {isAuthenticated ? (
              <UserDropdown 
                onEditProfile={() => setShowEditProfile(true)}
                onPremium={() => setShowPremiumModal(true)}
              />
            ) : (
              <AuthButton onClick={() => setShowAuthModal(true)} />
            )}
          </>
        )}
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      <EditProfileModal 
        isOpen={showEditProfile} 
        onClose={() => setShowEditProfile(false)} 
      />
      
      <EditProfileModal 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
      />
    </>
  );
};

export default ThemeToggle;