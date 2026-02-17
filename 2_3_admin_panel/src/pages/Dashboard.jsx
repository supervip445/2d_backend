import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI, twoDigitAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDigits: 0,
    inactiveDigits: 0,
    totalBalance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [usersRes, activeRes, inactiveRes] = await Promise.all([
        userAPI.getUsers().catch(() => ({ data: { agents: [], subAgents: [], players: [] } })),
        twoDigitAPI.getActive().catch(() => ({ data: [] })),
        twoDigitAPI.getInactive().catch(() => ({ data: [] })),
      ]);

      // Calculate total users based on role
      let totalUsers = 0;
      if (usersRes.data.agents) {
        usersRes.data.agents.forEach((agent) => {
          totalUsers += 1; // Agent
          if (agent.users) {
            agent.users.forEach((subAgent) => {
              totalUsers += 1; // Sub_Agent
              if (subAgent.users) {
                totalUsers += subAgent.users.length; // Players under Sub_Agent
              }
            });
            // Players directly under Agent
            const directPlayers = agent.users.filter((u) => u.role === 'Player');
            totalUsers += directPlayers.length;
          }
        });
      } else if (usersRes.data.subAgents) {
        totalUsers = usersRes.data.subAgents.length;
        if (usersRes.data.players) {
          totalUsers += usersRes.data.players.length;
        }
      } else if (usersRes.data.players) {
        totalUsers = usersRes.data.players.length;
      }

      // Calculate total balance
      let totalBalance = 0;
      const calculateBalance = (users) => {
        if (Array.isArray(users)) {
          users.forEach((u) => {
            totalBalance += parseFloat(u.balance || 0);
            if (u.users) {
              calculateBalance(u.users);
            }
          });
        }
      };
      if (usersRes.data.agents) {
        calculateBalance(usersRes.data.agents);
      } else if (usersRes.data.subAgents) {
        calculateBalance(usersRes.data.subAgents);
      } else if (usersRes.data.players) {
        calculateBalance(usersRes.data.players);
      }

      setStats({
        totalUsers,
        activeDigits: activeRes.data?.length || 0,
        inactiveDigits: inactiveRes.data?.length || 0,
        totalBalance,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Active Digits',
      value: stats.activeDigits,
      icon: '✅',
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Inactive Digits',
      value: stats.inactiveDigits,
      icon: '❌',
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Total Balance',
      value: `$${stats.totalBalance.toFixed(2)}`,
      icon: '💰',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back, {user?.name || user?.user_name || 'Admin'}!
        </p>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p
                    className={`text-2xl font-bold ${stat.textColor} dark:text-white mt-2`}
                  >
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/users"
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">👥</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Manage Users
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  View and manage all users
                </p>
              </div>
            </div>
          </Link>
          <Link
            to="/two-digits"
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎲</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Manage Two Digits
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Open and close digits
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

