import { useState } from 'react';

export const UserCredentialsModal = ({ isOpen, onClose, credentials }) => {
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen || !credentials) return null;

  const { user_name, password, amount, role } = credentials;
  
  // Determine login link based on role
  // You can customize these URLs in your .env file
  const playerLoginUrl = import.meta.env.VITE_PLAYER_LOGIN_URL || `${window.location.origin}/player/login`;
  const adminLoginUrl = import.meta.env.VITE_ADMIN_LOGIN_URL || `${window.location.origin}/admin/login`;
  
  const loginLink = role === 'Player' ? playerLoginUrl : adminLoginUrl;

  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const copyAll = () => {
    const allText = `Username: ${user_name}\nPassword: ${password}\nAmount: ${amount}\nLogin Link: ${loginLink}`;
    copyToClipboard(allText, 'all');
  };

  const CopyButton = ({ text, fieldName, label }) => (
    <button
      onClick={() => copyToClipboard(text, fieldName)}
      className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
      title="Copy to clipboard"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
      {copiedField === fieldName ? (
        <span className="text-xs">Copied!</span>
      ) : (
        <span className="text-xs">Copy {label}</span>
      )}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                User Created Successfully! ✅
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Save these credentials for the new {role}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Credentials Box */}
          <div className="space-y-4 mb-6">
            {/* Username */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <CopyButton text={user_name} fieldName="username" label="Username" />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={user_name}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <CopyButton text={password} fieldName="password" label="Password" />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={password}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
                />
              </div>
            </div>

            {/* Amount */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Initial Amount
                </label>
                <CopyButton text={amount} fieldName="amount" label="Amount" />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={amount}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
                />
              </div>
            </div>

            {/* Login Link */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Login Link
                </label>
                <CopyButton text={loginLink} fieldName="loginLink" label="Link" />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={loginLink}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-xs break-all"
                />
              </div>
            </div>
          </div>

          {/* Copy All Button */}
          <div className="flex gap-3">
            <button
              onClick={copyAll}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              {copiedField === 'all' ? 'All Copied!' : 'Copy All Credentials'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Done
            </button>
          </div>

          {/* Warning */}
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-300">
              ⚠️ <strong>Important:</strong> Save these credentials securely. The password cannot be retrieved later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

