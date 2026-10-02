import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import { LogIn, Mail, Lock, UserCheck, Shield, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError(null);

    try {
      await login(demoEmail, demoPassword);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F7FAF5]">
      <div className="max-w-md w-full space-y-8 bg-[#042F32] border-2 border-[#143F40] p-8 rounded-2xl shadow-sharp text-white">
        <div className="text-center">
          <div className="inline-flex p-3 rounded-full bg-[#D6FFCB] text-[#042F32] mb-3 shadow-sharp-mint">
            <LogIn className="h-8 w-8 text-[#042F32]" />
          </div>
          <h2 className="text-3xl font-black font-heading text-white">Welcome Back</h2>
          <p className="mt-2 text-xs text-[#B6C8C5]">
            Sign in to access your LibNexus account
          </p>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#B6C8C5] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#B6C8C5]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-[#143F40] border border-[#1B4F51] rounded-lg text-white placeholder-[#B6C8C5] focus:outline-none focus:border-[#D6FFCB] text-xs"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#B6C8C5] uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#B6C8C5]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-[#143F40] border border-[#1B4F51] rounded-lg text-white placeholder-[#B6C8C5] focus:outline-none focus:border-[#D6FFCB] text-xs"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 rounded-lg text-xs font-black uppercase tracking-wider text-[#042F32] bg-[#D6FFCB] hover:bg-[#BAF7AB] focus:outline-none transition-colors shadow-sharp-mint font-heading disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Login Section */}
        <div className="mt-6 pt-6 border-t border-[#143F40]">
          <p className="text-xs font-bold text-[#D6FFCB] uppercase tracking-wider mb-3 flex items-center gap-1.5 font-heading">
            <Sparkles className="h-3.5 w-3.5 text-[#D6FFCB]" />
            Quick Demo Login (1-Click)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoLogin('user@libnexus.com', 'User@123')}
              disabled={loading}
              className="flex flex-col items-center justify-center p-2.5 bg-[#143F40] hover:bg-[#1B4F51] border border-[#1B4F51] rounded-lg transition-colors text-xs text-[#B6C8C5] font-bold hover:text-white"
            >
              <UserCheck className="h-4 w-4 mb-1 text-[#D6FFCB]" />
              Demo User
            </button>
            <button
              onClick={() => handleDemoLogin('librarian@libnexus.com', 'Librarian@123')}
              disabled={loading}
              className="flex flex-col items-center justify-center p-2.5 bg-[#143F40] hover:bg-[#1B4F51] border border-[#1B4F51] rounded-lg transition-colors text-xs text-[#B6C8C5] font-bold hover:text-white"
            >
              <UserCheck className="h-4 w-4 mb-1 text-[#D6FFCB]" />
              Librarian
            </button>
            <button
              onClick={() => handleDemoLogin('admin@libnexus.com', 'Admin@123')}
              disabled={loading}
              className="flex flex-col items-center justify-center p-2.5 bg-[#143F40] hover:bg-[#1B4F51] border border-[#1B4F51] rounded-lg transition-colors text-xs text-[#B6C8C5] font-bold hover:text-white"
            >
              <Shield className="h-4 w-4 mb-1 text-[#D6FFCB]" />
              Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-[#B6C8C5] mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#D6FFCB] hover:underline uppercase tracking-wider">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

