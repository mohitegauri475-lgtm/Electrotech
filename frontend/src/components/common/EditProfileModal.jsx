import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const PRESET_AVATARS = [
  {
    id: 'royal-heritage',
    name: 'Royal Heritage',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDe48OuaNKIDxBM4Q7nZU-R6bzdk39Vkd-n9epOo6zEkJOZwMGfgg1KvMBFnKyW3RSIZw24bZj_H-VKpNmGHm0U7nymWlalammN0ng0drgaPOnOJEbxNP7-tv-vPWkDTbAhd_BoSGKn2WbHjExryue2Dtg8dW41wsuzgD6oUA8OO_akzv80hQ0YOYrbLBPPZ3h0UlXJtDtGhQZijBMYI8CBjdfe1771QzxLPcRduRNDhLPb6lCWPultow',
  },
  {
    id: 'festive-bloom',
    name: 'Festive Bloom',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'silk-portrait',
    name: 'Silk Portrait',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'classic-gentleman',
    name: 'Connoisseur',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'royal-curator',
    name: 'Atelier Lead',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
  },
  {
    id: 'modern-patron',
    name: 'Modern Patron',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
  },
];

export const EditProfileModal = ({ isOpen, onClose, onUpdated }) => {
  const { user, updateUserProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const [activePhotoTab, setActivePhotoTab] = useState('presets'); // 'presets' | 'upload' | 'url'
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setAvatarUrl(user.avatarUrl || PRESET_AVATARS[0].url);
      setAddress(user.address || '');
      setCity(user.city || '');
      setState(user.state || '');
      setPostalCode(user.postalCode || '');
      setCustomUrlInput(user.avatarUrl || '');
      setError(null);
      setSuccess(false);
    }
  }, [user, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Photo file size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (customUrlInput && customUrlInput.startsWith('http')) {
      setAvatarUrl(customUrlInput);
      setError(null);
    } else {
      setError('Please enter a valid HTTP/HTTPS image URL');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        avatarUrl,
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
      };

      const updatedUser = await updateUserProfile(payload);
      setSuccess(true);
      if (onUpdated) onUpdated(updatedUser);

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-secondary/40 z-10 no-scrollbar animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-secondary-fixed/50 text-secondary flex items-center justify-center border border-secondary/30">
            <span className="material-symbols-outlined text-[26px]">manage_accounts</span>
          </div>
          <div>
            <span className="font-label-sm text-[10px] text-secondary uppercase tracking-widest font-bold block">
              Profile Management
            </span>
            <h2 className="font-display text-2xl font-bold text-primary">
              Edit Patron Profile &amp; Photo
            </h2>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-error-container text-on-error-container font-body-sm text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3.5 rounded-2xl bg-secondary-fixed text-on-secondary-fixed font-body-sm text-xs flex items-center gap-2 animate-fadeIn font-bold">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Profile and photo updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: PROFILE PHOTO CUSTOMIZATION */}
          <div className="p-5 rounded-3xl bg-surface-container-low border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-xs uppercase font-bold text-primary tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-secondary">photo_camera</span>
                <span>1. Profile Avatar</span>
              </span>
              <span className="font-label-sm text-[11px] text-secondary font-semibold">
                Live Preview
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Avatar Live Preview */}
              <div className="relative group shrink-0">
                <img
                  src={avatarUrl || PRESET_AVATARS[0].url}
                  alt="Avatar Preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-secondary/40 shadow-md bg-surface-container"
                />
                <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md border-2 border-surface">
                  <span className="material-symbols-outlined text-[14px]">brush</span>
                </span>
              </div>

              {/* Photo Source Selector */}
              <div className="flex-1 w-full space-y-3">
                <div className="flex rounded-full bg-surface p-1 border border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setActivePhotoTab('presets')}
                    className={`flex-1 py-1.5 rounded-full font-label-sm text-xs transition-all ${
                      activePhotoTab === 'presets'
                        ? 'bg-secondary text-on-secondary font-bold shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Preset Avatars
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePhotoTab('upload')}
                    className={`flex-1 py-1.5 rounded-full font-label-sm text-xs transition-all ${
                      activePhotoTab === 'upload'
                        ? 'bg-secondary text-on-secondary font-bold shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Upload Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePhotoTab('url')}
                    className={`flex-1 py-1.5 rounded-full font-label-sm text-xs transition-all ${
                      activePhotoTab === 'url'
                        ? 'bg-secondary text-on-secondary font-bold shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Image Link
                  </button>
                </div>

                {/* Tab: Preset Avatars */}
                {activePhotoTab === 'presets' && (
                  <div className="grid grid-cols-6 gap-2 pt-1">
                    {PRESET_AVATARS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setAvatarUrl(av.url)}
                        className={`relative rounded-full p-0.5 transition-all ${
                          avatarUrl === av.url
                            ? 'ring-2 ring-primary ring-offset-2 scale-105'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        title={av.name}
                      >
                        <img
                          src={av.url}
                          alt={av.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Tab: File Upload */}
                {activePhotoTab === 'upload' && (
                  <div className="pt-1">
                    <label className="cursor-pointer bg-surface hover:bg-surface-container text-primary font-label-sm text-xs py-2.5 px-4 rounded-xl border border-secondary/40 flex items-center justify-center gap-2 transition-all shadow-sm">
                      <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                      <span>Choose Image from Device (JPG, PNG, WebP)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* Tab: Direct Image URL */}
                {activePhotoTab === 'url' && (
                  <div className="flex gap-2 pt-1">
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      className="flex-1 bg-surface px-3 py-2 rounded-xl text-xs border border-outline-variant/40 focus:border-primary focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="px-3.5 py-2 rounded-xl bg-primary text-on-primary font-label-sm text-xs font-semibold hover:bg-primary-container shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: PERSONAL & SHIPPING INFORMATION */}
          <div className="p-5 rounded-3xl bg-surface border border-outline-variant/30 space-y-4">
            <span className="font-label-sm text-xs uppercase font-bold text-primary tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">badge</span>
              <span>2. Personal &amp; Delivery Details</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block font-label-md text-xs uppercase font-bold text-on-surface">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-surface-container-lowest px-4 py-2.5 rounded-xl border border-outline-variant/50 focus:border-primary focus:outline-none text-sm"
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-label-md text-xs uppercase font-bold text-on-surface">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-surface-container-lowest px-4 py-2.5 rounded-xl border border-outline-variant/50 focus:border-primary focus:outline-none text-sm"
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="block font-label-md text-xs uppercase font-bold text-on-surface">
                  Default Shipping Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-surface-container-lowest px-4 py-2.5 rounded-xl border border-outline-variant/50 focus:border-primary focus:outline-none text-sm"
                  placeholder="Street, suite, building"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-label-md text-xs uppercase font-bold text-on-surface">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-surface-container-lowest px-4 py-2.5 rounded-xl border border-outline-variant/50 focus:border-primary focus:outline-none text-sm"
                  placeholder="e.g. Bengaluru"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block font-label-md text-xs uppercase font-bold text-on-surface">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-surface-container-lowest px-3 py-2.5 rounded-xl border border-outline-variant/50 focus:border-primary focus:outline-none text-sm"
                    placeholder="Karnataka"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-label-md text-xs uppercase font-bold text-on-surface">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-surface-container-lowest px-3 py-2.5 rounded-xl border border-outline-variant/50 focus:border-primary focus:outline-none text-sm"
                    placeholder="560001"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs font-semibold transition-colors border border-outline-variant/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-7 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-xs font-bold hover:bg-primary-container shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
