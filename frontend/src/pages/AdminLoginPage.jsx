import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('admin@libnexus.com');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.role === 'admin' || res.role === 'librarian') {
        navigate('/admin');
      } else {
        setError('Access denied. This portal is restricted to Library Administrators.');
      }
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#151A2B] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1E253B] border-2 border-slate-700 rounded-2xl p-8 shadow-sharp-crimson space-y-6">

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#B93434] text-white flex items-center justify-center mx-auto shadow-sharp-subtle">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider font-heading">
            LIB<span className="text-[#B93434]">NEXUS</span> ADMIN
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Authorized Library Staff & Administration Management Portal
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#B93434]/20 border border-[#B93434] rounded-lg text-xs text-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#B93434]" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@libnexus.com"
                className="w-full pl-9 pr-3 py-2 bg-[#151A2B] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E3A72F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-[#151A2B] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E3A72F]"
              />
            </div>
          </div>

          <div className="bg-[#151A2B] p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-bold text-slate-300">Demo Admin Account:</p>
            <p className="font-mono text-amber-400">admin@libnexus.com | Admin@123</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#B93434] hover:bg-[#9B2A2A] text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-sharp-crimson transition-transform active:translate-y-0.5 disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'SIGN IN TO ADMIN PORTAL →'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider flex items-center justify-center gap-1 mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Website
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminLoginPage;
