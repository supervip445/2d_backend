import { useState, useEffect } from 'react';
import { adminBetAPI } from '../services/api';

export const BetDetails = () => {
  const [betDetails, setBetDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBet, setEditingBet] = useState(null);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    slipId: '',
    userId: '',
    betNumber: '',
    session: '',
    date: '',
  });

  const [formData, setFormData] = useState({
    bet_amount: '',
    win_lose: false,
    bet_status: false,
    bet_result: '',
    potential_payout: '',
  });

  useEffect(() => {
    fetchBetDetails();
  }, [filters]);

  const fetchBetDetails = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.slipId) params.slipId = filters.slipId;
      if (filters.userId) params.userId = filters.userId;
      if (filters.betNumber) params.betNumber = filters.betNumber;
      if (filters.session) params.session = filters.session;
      if (filters.date) params.date = filters.date;

      const response = await adminBetAPI.getBetDetails(params);
      setBetDetails(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bet details:', error);
      setError('Failed to fetch bet details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bet) => {
    setEditingBet(bet);
    setFormData({
      bet_amount: bet.bet_amount?.toString() || '',
      win_lose: bet.win_lose || false,
      bet_status: bet.bet_status || false,
      bet_result: bet.bet_result || '',
      potential_payout: bet.potential_payout?.toString() || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminBetAPI.updateBetDetail(editingBet.id, formData);
      setShowModal(false);
      fetchBetDetails();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update bet detail');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this bet detail?')) return;
    try {
      await adminBetAPI.deleteBetDetail(id);
      fetchBetDetails();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete bet detail');
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Bet Details
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Manage individual bet records</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slip ID</label>
            <input
              type="number"
              value={filters.slipId}
              onChange={(e) => setFilters({ ...filters, slipId: e.target.value })}
              placeholder="Filter by slip ID"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User ID</label>
            <input
              type="number"
              value={filters.userId}
              onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
              placeholder="Filter by user ID"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bet Number</label>
            <input
              type="text"
              value={filters.betNumber}
              onChange={(e) => setFilters({ ...filters, betNumber: e.target.value })}
              placeholder="00-99"
              maxLength={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Session</label>
            <select
              value={filters.session}
              onChange={(e) => setFilters({ ...filters, session: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All</option>
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Player</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Bet Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Session</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Win/Lose</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {betDetails.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No bet details found
                    </td>
                  </tr>
                ) : (
                  betDetails.map((bet) => (
                    <tr key={bet.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{bet.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {bet.member_name || bet.user?.user_name || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">{bet.bet_number}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        ${parseFloat(bet.bet_amount || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white capitalize">{bet.session}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={bet.win_lose ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                          {bet.win_lose ? 'Win' : 'Lose'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={bet.bet_status ? 'text-green-600' : 'text-yellow-600'}>
                          {bet.bet_status ? 'Settled' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(bet)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(bet.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && editingBet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Bet Detail</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bet Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.bet_amount}
                    onChange={(e) => setFormData({ ...formData, bet_amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.win_lose}
                      onChange={(e) => setFormData({ ...formData, win_lose: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Win/Lose</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.bet_status}
                      onChange={(e) => setFormData({ ...formData, bet_status: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bet Status (Settled)</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bet Result
                  </label>
                  <input
                    type="text"
                    value={formData.bet_result}
                    onChange={(e) => setFormData({ ...formData, bet_result: e.target.value })}
                    placeholder="Winning number or result"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Potential Payout
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.potential_payout}
                    onChange={(e) => setFormData({ ...formData, potential_payout: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

