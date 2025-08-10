import React, { useState } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { validatePassword, getPasswordStrengthText } from '../../utils/passwordValidation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, register, loading } = useAuth();

  const passwordStrength = validatePassword(formData.password);
  const strengthInfo = getPasswordStrengthText(passwordStrength.score);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'register') {
      if (passwordStrength.score < 3) {
        setError('Password is too weak. Please meet all requirements.');
        return;
      }
    }

    const result = activeTab === 'signin' 
      ? await login({ username: formData.username, password: formData.password, key: import.meta.env.VITE_API_MASTER_KEY })
      : await register({ 
          username: formData.username, 
          password: formData.password, 
          email: formData.email || undefined,
          key: import.meta.env.VITE_API_MASTER_KEY
        });

    if (result.success) {
      onClose();
      setFormData({ username: '', password: '', email: '' });
    } else {
      setError(result.error || 'An error occurred');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'signin'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'register'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your username"
              />
            </div>

            {/* Email (Register only) */}
            {activeTab === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Password Strength (Register only) */}
            {activeTab === 'register' && formData.password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Password Strength:</span>
                  <span className={`text-sm font-medium ${strengthInfo.color}`}>
                    {strengthInfo.text}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-2 rounded-full ${
                        level <= passwordStrength.score
                          ? level <= 2 ? 'bg-red-500' : level <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                          : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <div className={passwordStrength.hasMinLength ? 'text-green-600' : ''}>
                    ✓ At least 8 characters
                  </div>
                  <div className={passwordStrength.hasUppercase ? 'text-green-600' : ''}>
                    ✓ One uppercase letter
                  </div>
                  <div className={passwordStrength.hasLowercase ? 'text-green-600' : ''}>
                    ✓ One lowercase letter
                  </div>
                  <div className={passwordStrength.hasNumber ? 'text-green-600' : ''}>
                    ✓ One number
                  </div>
                  <div className={passwordStrength.hasSymbol ? 'text-green-600' : ''}>
                    ✓ One special character
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  {activeTab === 'signin' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                activeTab === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;