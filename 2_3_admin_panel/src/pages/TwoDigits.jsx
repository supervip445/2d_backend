import { useState, useEffect } from 'react';
import { twoDigitAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const TwoDigits = () => {
  const { isAdmin } = useAuth();
  const [digits, setDigits] = useState([]);
  const [filter, setFilter] = useState('all'); // all, active, inactive
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchDigits();
  }, [filter]);

  const fetchDigits = async () => {
    try {
      setLoading(true);
      let response;
      
      if (filter === 'active') {
        response = await twoDigitAPI.getActive();
      } else if (filter === 'inactive') {
        response = await twoDigitAPI.getInactive();
      } else {
        response = await twoDigitAPI.getAll();
      }
      
      setDigits(response.data || []);
    } catch (error) {
      console.error('Error fetching digits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (digit, action) => {
    try {
      setActionLoading(digit);
      if (action === 'close') {
        await twoDigitAPI.closeDigit(digit);
      } else {
        await twoDigitAPI.openDigit(digit);
      }
      fetchDigits();
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    } finally {
      setActionLoading(null);
    }
  };

  // Generate all two-digit numbers (00-99) if needed
  const generateAllDigits = () => {
    const allDigits = [];
    for (let i = 0; i <= 99; i++) {
      const digitStr = i.toString().padStart(2, '0');
      const existing = digits.find((d) => d.two_digit === digitStr);
      allDigits.push({
        two_digit: digitStr,
        status: existing?.status || 0,
        id: existing?.id,
      });
    }
    return allDigits.sort((a, b) => a.two_digit.localeCompare(b.two_digit));
  };

  const displayDigits = filter === 'all' ? generateAllDigits() : digits;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Two-Digit Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View and manage two-digit numbers (00-99)
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'active'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'inactive'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Digits grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-3">
          {displayDigits.map((digit) => {
            const isActive = digit.status === 1;
            const isLoading = actionLoading === digit.two_digit;

            return (
              <div
                key={digit.two_digit}
                className={`
                  aspect-square rounded-lg p-4 flex flex-col items-center justify-center
                  border-2 transition-all
                  ${
                    isActive
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-400'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-400'
                  }
                  ${isLoading ? 'opacity-50' : 'hover:scale-105 cursor-pointer'}
                `}
              >
                <span
                  className={`text-2xl font-bold ${
                    isActive
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-red-700 dark:text-red-300'
                  }`}
                >
                  {digit.two_digit}
                </span>
                <span
                  className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                      : 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
                  }`}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </span>

                {/* Action buttons for admin */}
                {isAdmin && (
                  <div className="mt-2 flex gap-1">
                    {isActive ? (
                      <button
                        onClick={() => handleToggleStatus(digit.two_digit, 'close')}
                        disabled={isLoading}
                        className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
                        title="Close"
                      >
                        {isLoading ? '...' : '✕'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(digit.two_digit, 'open')}
                        disabled={isLoading}
                        className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
                        title="Open"
                      >
                        {isLoading ? '...' : '✓'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Digits</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {displayDigits.length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {displayDigits.filter((d) => d.status === 1).length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Inactive</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {displayDigits.filter((d) => d.status === 0).length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

