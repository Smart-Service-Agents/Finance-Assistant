import React, { useState } from 'react';
import { X, Loader2, Crown, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, togglePremium, loading } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage('');

    const result = await updateProfile({
      username: formData.username,
      email: formData.email || undefined
    });

    if (result.success) {
      setMessage('Profile updated successfully!');
    } else {
      setMessage(result.error || 'Failed to update profile');
    }
    setIsUpdating(false);
  };

  const handlePremiumToggle = async () => {
    const result = await togglePremium();
    if (result.success) {
      setMessage(user?.isPremium ? 'Successfully unsubscribed from Premium' : 'Welcome to Premium!');
    } else {
      setMessage(result.error || 'Failed to update subscription');
    }
    setShowConfirmDialog(false);
  };

  if (!isOpen || !user) return null;

  const premiumBenefits = [
    'Unlimited conversations',
    'Priority support',
    'Advanced financial analysis',
    'Custom investment recommendations',
    'Export conversation history'
  ];

  const standardBenefits = [
    '10 conversations per day',
    'Basic financial advice',
    'Standard support'
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {user.email ? 'Change Email' : 'Add Email'}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  placeholder={user.email ? user.email : 'Enter your email'}
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                {isUpdating ? (
                  <>
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update Profile'
                )}
              </button>
            </form>

            {/* Status Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Account Status</h3>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.isPremium 
                    ? 'bg-gold-100 text-gold-800 dark:bg-gold-900/20 dark:text-gold-400' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {user.isPremium ? (
                    <div className="flex items-center">
                      <Crown size={16} className="mr-1" />
                      Premium User
                    </div>
                  ) : (
                    'Standard User'
                  )}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {user.isPremium ? 'Premium Benefits' : 'Standard Benefits'}
                </h4>
                <ul className="space-y-1">
                  {(user.isPremium ? premiumBenefits : standardBenefits).map((benefit, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Check size={16} className="mr-2 text-green-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setShowConfirmDialog(true)}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  user.isPremium
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gold-600 hover:bg-gold-700 text-white'
                }`}
              >
                {user.isPremium ? 'Unsubscribe from Premium' : 'Subscribe to Premium'}
              </button>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-3 rounded-lg ${
                message.includes('success') || message.includes('Welcome')
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
              }`}>
                <p className="text-sm">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {user.isPremium ? 'Unsubscribe from Premium?' : 'Subscribe to Premium?'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {user.isPremium 
                  ? 'You will lose access to premium features immediately.'
                  : 'You will gain access to all premium features instantly.'
                }
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePremiumToggle}
                  disabled={loading}
                  className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors flex items-center justify-center ${
                    user.isPremium
                      ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
                      : 'bg-gold-600 hover:bg-gold-700 disabled:bg-gold-400'
                  }`}
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    user.isPremium ? 'Unsubscribe' : 'Subscribe'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfileModal;