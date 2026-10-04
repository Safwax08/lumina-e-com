import React, { useState } from 'react';
import { X } from 'lucide-react';
import { loginCustomerService } from '../../../services/auth';

interface CustomerLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => void;
}

export function CustomerLogin({ isOpen, onClose, onLogin }: CustomerLoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide email and password.');
      return;
    }

    if (isSignUp && !fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }

    try {
      setIsSubmitting(true);
      await loginCustomerService(email, fullName);
      onLogin(email);
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#3B2A1A]/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 font-sans">
      <div className="bg-[#FAF4E8] border border-[#D8C5A8] text-[#3B2A1A] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#6B5842] hover:text-[#3B2A1A] hover:bg-black/5 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <span className="text-xs uppercase font-mono tracking-widest text-[#C99A2E] font-bold block mb-1">URBAN MAN ACCOUNT</span>
            <h2 className="text-2xl font-bold font-serif text-[#3B2A1A] mb-2">
              {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-[#6B5842]">
              {isSignUp 
                ? 'Sign up to manage your orders and get exclusive drops.' 
                : 'Sign in to access your saved items and order history.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700 text-xs rounded-r-lg">
                {error}
              </div>
            )}

            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-[#6B5842] uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#FFFDF8] border border-[#D8C5A8] text-[#3B2A1A] placeholder-[#6B5842] rounded-xl focus:outline-none focus:border-[#C99A2E] transition-all text-xs"
                  placeholder="Alexander Wright"
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-[#6B5842] uppercase tracking-wider mb-2">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#FFFDF8] border border-[#D8C5A8] text-[#3B2A1A] placeholder-[#6B5842] rounded-xl focus:outline-none focus:border-[#C99A2E] transition-all text-xs"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-[#6B5842] uppercase tracking-wider mb-2">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#FFFDF8] border border-[#D8C5A8] text-[#3B2A1A] placeholder-[#6B5842] rounded-xl focus:outline-none focus:border-[#C99A2E] transition-all text-xs"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] font-bold py-4 rounded-xl mt-4 transition-all shadow-lg uppercase tracking-wider text-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Authenticating...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-[#6B5842]">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="font-bold text-[#C99A2E] hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
