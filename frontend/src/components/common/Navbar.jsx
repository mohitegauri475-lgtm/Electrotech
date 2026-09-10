import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { WebsiteQrModal } from './WebsiteQrModal';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 shadow-[0_1px_12px_rgba(41,37,37,0.05)]">
      {/* Announcement Bar */}
      <div className="bg-primary text-secondary-fixed py-space-xs px-margin-mobile md:px-margin-desktop text-center font-label-sm text-label-sm tracking-widest flex items-center justify-center gap-space-xs">
        <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
        <span>Free Express Delivery on Hampers above ₹2,999 | Handcrafted with Love Across India</span>
        <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
      </div>

      {/* Main Glassmorphic Header */}
      <div className="bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30">
        <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-desktop h-20 flex items-center justify-between gap-space-md">
          {/* Brand Logo */}
          <div className="flex items-center gap-space-sm">
            <Link to="/" className="flex items-center gap-space-sm group">
              <img
                src="/logo.svg"
                alt="THE GIFT EDIT Logo"
                className="h-10 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold leading-none group-hover:text-primary-container transition-colors">
                  THE GIFT EDIT
                </span>
                <span className="font-label-sm text-[9px] uppercase tracking-[0.2em] text-secondary">
                  Royal Indian Bespoke
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-space-lg">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary after:origin-center after:transition-transform ${
                  isActive
                    ? 'text-primary font-bold after:scale-x-100'
                    : 'font-label-lg text-label-lg text-on-surface-variant hover:text-primary after:scale-x-0'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/shop-hampers"
              className={({ isActive }) =>
                `transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary after:origin-center after:transition-transform ${
                  isActive
                    ? 'text-primary font-bold after:scale-x-100'
                    : 'font-label-lg text-label-lg text-on-surface-variant hover:text-primary after:scale-x-0'
                }`
              }
            >
              Shop Hampers
            </NavLink>

            <NavLink
              to="/customize-hamper"
              className={({ isActive }) =>
                `transition-colors relative py-1 flex items-center gap-1.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary after:origin-center after:transition-transform ${
                  isActive
                    ? 'text-primary font-bold after:scale-x-100'
                    : 'font-label-lg text-label-lg text-on-surface-variant hover:text-primary after:scale-x-0'
                }`
              }
            >
              <span>Customize Hamper</span>
              <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold border border-secondary/30">
                Popular
              </span>
            </NavLink>

            <NavLink
              to="/occasions"
              className={({ isActive }) =>
                `transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary after:origin-center after:transition-transform ${
                  isActive
                    ? 'text-primary font-bold after:scale-x-100'
                    : 'font-label-lg text-label-lg text-on-surface-variant hover:text-primary after:scale-x-0'
                }`
              }
            >
              Occasions
            </NavLink>

            <NavLink
              to="/corporate-gifting"
              className={({ isActive }) =>
                `transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary after:origin-center after:transition-transform ${
                  isActive
                    ? 'text-primary font-bold after:scale-x-100'
                    : 'font-label-lg text-label-lg text-on-surface-variant hover:text-primary after:scale-x-0'
                }`
              }
            >
              Corporate Gifting
            </NavLink>

            <NavLink
              to="/about-us"
              className={({ isActive }) =>
                `transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary after:origin-center after:transition-transform ${
                  isActive
                    ? 'text-primary font-bold after:scale-x-100'
                    : 'font-label-lg text-label-lg text-on-surface-variant hover:text-primary after:scale-x-0'
                }`
              }
            >
              About Us
            </NavLink>
          </nav>

          {/* Action Icons & CTAs */}
          <div className="flex items-center gap-space-xs sm:gap-space-sm">
            {/* QR Mobile Companion */}
            <button
              onClick={() => setIsQrModalOpen(true)}
              aria-label="Scan QR Code"
              title="Scan to open on Mobile"
              className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-secondary-fixed/40 transition-all flex items-center justify-center relative group"
            >
              <span className="material-symbols-outlined text-[22px] text-secondary group-hover:text-primary transition-colors">qr_code_2</span>
            </button>

            {/* Search */}
            <Link
              to="/shop-hampers"
              aria-label="Search Hampers"
              className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="relative p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-secondary text-on-secondary font-label-sm text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Profile / Account / Login */}
            {isAuthenticated ? (
              <div className="relative group">
                <Link
                  to="/account"
                  className="p-1 rounded-full hover:ring-2 hover:ring-secondary/40 transition-all flex items-center gap-1.5"
                  title={user?.fullName || user?.username}
                >
                  <img
                    src={user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDe48OuaNKIDxBM4Q7nZU-R6bzdk39Vkd-n9epOo6zEkJOZwMGfgg1KvMBFnKyW3RSIZw24bZj_H-VKpNmGHm0U7nymWlalammN0ng0drgaPOnOJEbxNP7-tv-vPWkDTbAhd_BoSGKn2WbHjExryue2Dtg8dW41wsuzgD6oUA8OO_akzv80hQ0YOYrbLBPPZ3h0UlXJtDtGhQZijBMYI8CBjdfe1771QzxLPcRduRNDhLPb6lCWPultow"}
                    alt={user?.fullName || 'Profile'}
                    className="w-8 h-8 rounded-full object-cover border border-outline-variant/50"
                  />
                </Link>
                <div className="absolute right-0 mt-2 w-48 bg-surface rounded-2xl shadow-xl border border-outline-variant/40 py-2 hidden group-hover:block transition-all">
                  <div className="px-4 py-2 border-b border-outline-variant/20">
                    <p className="font-label-md text-label-md font-bold text-on-surface truncate">{user?.fullName}</p>
                    <p className="font-body-sm text-[11px] text-on-surface-variant truncate">{user?.email}</p>
                  </div>
                  <Link to="/account" className="block px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container hover:text-primary">
                    My Account &amp; Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-container/20 flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all flex items-center justify-center"
                title="Login / Register"
              >
                <span className="material-symbols-outlined text-[22px]">person</span>
              </Link>
            )}

            {/* Build Your Hamper Button */}
            <Link
              to="/customize-hamper"
              className="hidden sm:inline-flex items-center gap-space-2xs bg-primary text-on-primary font-label-md text-label-md px-space-md py-2.5 rounded-full hover:bg-primary-container shadow-[0_4px_16px_rgba(110,35,52,0.2)] border border-secondary-fixed/40 transition-all transform hover:-translate-y-0.5"
            >
              <span>Build Your Hamper</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Website QR Modal */}
      <WebsiteQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </header>
  );
};
