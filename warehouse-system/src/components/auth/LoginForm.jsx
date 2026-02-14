import React, { useState } from 'react';
import { Warehouse, User, Lock } from 'lucide-react';

const LoginForm = ({ onLogin, loginError, loading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Warehouse className="w-12 h-12 text-blue-400" />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Warehouse System</h1>
            <p className="text-slate-400 text-sm">Login to continue</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              placeholder="Enter username"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              placeholder="Enter password"
              required
              disabled={loading}
            />
          </div>

          {loginError && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-2 rounded-lg text-sm">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-700">
          <p className="text-slate-400 text-xs text-center mb-2">Demo Credentials:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-900 p-2 rounded">
              <p className="text-blue-400 font-medium">Admin</p>
              <p className="text-slate-400">admin / admin123</p>
            </div>
            <div className="bg-slate-900 p-2 rounded">
              <p className="text-green-400 font-medium">Employee</p>
              <p className="text-slate-400">employee / emp123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;