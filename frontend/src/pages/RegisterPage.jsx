import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import { UserPlus, User, Mail, Lock, ShieldCheck } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await register({ name, email, password, role });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F7FAF5]">
      <div className="max-w-md w-full space-y-8 bg-[#042F32] border-2 border-[#143F40] p-8 rounded-2xl shadow-sharp text-white">
        <div className="text-center">
          <div className="inline-flex p-3 rounded-full bg-[#D6FFCB] text-[#042F32] mb-3 shadow-sharp-mint">
            <UserPlus className="h-8 w-8 text-[#042F32]" />
          </div>
          <h2 className="text-3xl font-black font-heading text-white">Create an Account</h2>
          <p className="mt-2 text-xs text-[#B6C8C5]">
            Join LibNexus to discover libraries and check live seat occupancy
          </p>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-[#B6C8C5] uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#B6C8C5]">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-[#143F40] border border-[#1B4F51] rounded-lg text-white placeholder-[#B6C8C5] focus:outline-none focus:border-[#D6FFCB] text-xs"
                placeholder="Jane Doe"
              />
            </div>
          </div>

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
                placeholder="jane@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#B6C8C5] uppercase tracking-wider mb-1">
              Role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#B6C8C5]">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-[#143F40] border border-[#1B4F51] rounded-lg text-white placeholder-[#B6C8C5] focus:outline-none focus:border-[#D6FFCB] text-xs"
              >
                <option value="user">Library Member / Student</option>
                <option value="librarian">Librarian Staff</option>
              </select>
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-[#143F40] border border-[#1B4F51] rounded-lg text-white placeholder-[#B6C8C5] focus:outline-none focus:border-[#D6FFCB] text-xs"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#B6C8C5] uppercase tracking-wider mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#B6C8C5]">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-[#143F40] border border-[#1B4F51] rounded-lg text-white placeholder-[#B6C8C5] focus:outline-none focus:border-[#D6FFCB] text-xs"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 rounded-lg text-xs font-black uppercase tracking-wider text-[#042F32] bg-[#D6FFCB] hover:bg-[#BAF7AB] focus:outline-none transition-colors shadow-sharp-mint font-heading disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-xs text-[#B6C8C5] mt-4">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#D6FFCB] hover:underline uppercase tracking-wider">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

