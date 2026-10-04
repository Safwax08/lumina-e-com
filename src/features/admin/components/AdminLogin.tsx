import React, { useState } from 'react';
import { loginAdminService } from '../../../services/auth';

interface AdminLoginProps {
  onLogin: () => void;
  onCancel: () => void;
}

export function AdminLogin({ onLogin, onCancel }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter Admin ID and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await loginAdminService(username, password);
      if (success) {
        onLogin();
      } else {
        setError('Invalid admin credentials. (Minimum 4 characters required for dev access)');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3E6D0] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold font-serif text-[#3B2A1A]">
          Lumina Admin Authentication
        </h2>
        <p className="mt-2 text-center text-xs text-[#6B5842] font-mono uppercase tracking-widest">
          Secure Administrative Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FFFDF8] py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-[#D8C5A8]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 text-xs font-medium text-red-700 rounded-r-md">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2A1A] mb-1">
                Admin Email / Username
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  placeholder="admin@lumina.com"
                  className="appearance-none block w-full px-3.5 py-2.5 border border-[#D8C5A8] rounded-xl bg-[#FAF4E8] text-[#3B2A1A] placeholder-[#8C7A6B] focus:outline-none focus:border-[#C99A2E] focus:ring-1 focus:ring-[#C99A2E] text-xs transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3B2A1A] mb-1">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                  className="appearance-none block w-full px-3.5 py-2.5 border border-[#D8C5A8] rounded-xl bg-[#FAF4E8] text-[#3B2A1A] placeholder-[#8C7A6B] focus:outline-none focus:border-[#C99A2E] focus:ring-1 focus:ring-[#C99A2E] text-xs transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-[#C99A2E] rounded-xl shadow-md text-xs font-bold uppercase tracking-widest text-[#FFFDF8] bg-[#C99A2E] hover:bg-[#A87918] focus:outline-none transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Authenticating...' : 'Sign in'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="w-full flex justify-center py-3 px-4 border border-[#D8C5A8] rounded-xl text-xs font-bold uppercase tracking-widest text-[#3B2A1A] bg-[#FAF4E8] hover:bg-[#F3E6D0] focus:outline-none transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
