import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({ username, email, password, fullName, phone });
      navigate(redirect);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[480px] mx-auto px-4 py-16">
      <div className="bg-surface border border-outline-variant/30 rounded-3xl p-space-xl shadow-xl space-y-space-lg">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
            <span className="material-symbols-outlined text-[24px]">person_add</span>
          </div>
          <span className="font-label-sm text-secondary uppercase tracking-[0.2em] font-bold">
            Join The Atelier
          </span>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            Create Your Account
          </h1>
          <p className="font-body-sm text-xs text-on-surface-variant">
            Save custom bespoke hampers and unlock private connoisseur previews.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-error-container text-on-error-container rounded-xl font-body-sm text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-space-md">
          <div className="space-y-1">
            <label className="block font-label-md text-xs uppercase font-bold text-on-surface">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-surface-container-lowest px-4 py-3 rounded-xl border border-outline-variant/50 focus:border-primary focus:outline-none text-sm"
              placeholder="e.g. Radhika Singhania"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-label-md text-xs uppercase font-bold text-on-surface">
              Username *
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-surface-container-lowest px-4 py-3 rounded-xl border border-outline-variant/50 focus:border-primary focus:outline-none text-sm"
              placeholder="Unique username"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-label-md text-xs uppercase font-bold text-on-surface">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-lowest px-4 py-3 rounded-xl border border-outline-variant/50 focus:border-primary focus:outline-none text-sm"
              placeholder="you@domain.com"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-label-md text-xs uppercase font-bold text-on-surface">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-surface-container-lowest px-4 py-3 rounded-xl border border-outline-variant/50 focus:border-primary focus:outline-none text-sm"
              placeholder="+91 9876543210"
            />
          </div>

          <div className="space-y-1">
            <label className="block font-label-md text-xs uppercase font-bold text-on-surface">
              Password (min 6 characters) *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-lowest px-4 py-3 rounded-xl border border-outline-variant/50 focus:border-primary focus:outline-none text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-primary text-on-primary font-label-md font-bold shadow-md hover:bg-primary-container disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>

        <div className="text-center font-body-sm text-xs text-on-surface-variant">
          Already have an account?{' '}
          <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-primary font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
