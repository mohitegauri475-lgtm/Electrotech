import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('demo_user');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';
  const isExpired = searchParams.get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ usernameOrEmail, password });
      navigate(redirect);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[480px] mx-auto px-4 py-16">
      <div className="bg-surface border border-outline-variant/30 rounded-3xl p-space-xl shadow-xl space-y-space-lg">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
            <span className="material-symbols-outlined text-[24px]">lock_open</span>
          </div>
          <span className="font-label-sm text-secondary uppercase tracking-[0.2em] font-bold">
            The Connoisseur Portal
          </span>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            Sign In to Your Account
          </h1>
          <p className="font-body-sm text-xs text-on-surface-variant">
            Access your bespoke hampers, tracked deliveries, and curated wishlists.
          </p>
        </div>

        {isExpired && (
          <div className="p-3 bg-secondary-fixed/30 rounded-xl text-secondary font-label-md text-xs">
            Your session expired. Please sign in again.
          </div>
        )}

        {error && (
          <div className="p-3 bg-error-container text-on-error-container rounded-xl font-body-sm text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-space-md">
          <div className="space-y-1">
            <label className="block font-label-md text-xs uppercase font-bold text-on-surface">
              Username or Email
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">
                person
              </span>
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                className="w-full bg-surface-container-lowest pl-12 pr-4 py-3 rounded-xl border border-outline-variant/50 focus:border-primary focus:outline-none text-sm"
                placeholder="demo_user or email"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block font-label-md text-xs uppercase font-bold text-on-surface">
                Password
              </label>
              <span className="font-label-sm text-[11px] text-secondary cursor-pointer hover:underline">
                Forgot?
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">
                key
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-lowest pl-12 pr-4 py-3 rounded-xl border border-outline-variant/50 focus:border-primary focus:outline-none text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-primary text-on-primary font-label-md font-bold shadow-md hover:bg-primary-container disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="p-3.5 rounded-2xl bg-surface-container-low text-xs text-on-surface-variant space-y-1">
          <span className="font-label-sm uppercase font-bold text-secondary block">Preloaded Demo Account</span>
          <p>Username: <strong className="text-on-surface">demo_user</strong></p>
          <p>Password: <strong className="text-on-surface">password123</strong></p>
        </div>

        <div className="text-center font-body-sm text-xs text-on-surface-variant">
          Don't have an account yet?{' '}
          <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-primary font-bold hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};
