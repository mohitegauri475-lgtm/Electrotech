import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

export const GreetingCardPage = () => {
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audio] = useState(
    typeof Audio !== 'undefined'
      ? new Audio('https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3')
      : null
  );

  const recipient = searchParams.get('to') || 'Cherished Recipient';
  const sender = searchParams.get('from') || 'With warmest regards, Your Loved One';
  const message =
    searchParams.get('msg') ||
    'May your days be filled with royal warmth, boundless celebrations, and sweet memories. Handcrafted especially for you with our deepest love and best wishes.';
  const theme = searchParams.get('theme') || 'Royal Celebration';
  const mediaUrl = searchParams.get('media');

  useEffect(() => {
    // Auto scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenEnvelope = () => {
    setIsOpen(true);
    if (audio) {
      audio.play().catch(() => {});
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://thegiftedit.com';

  return (
    <div className="min-h-screen bg-[#FDF9F6] py-12 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Decorative Gold Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-secondary-fixed/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-2xl w-full mx-auto relative z-10 text-center">
        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-secondary-fixed/40 border border-secondary/30 text-secondary font-label-sm text-xs font-bold uppercase tracking-widest mb-6">
          <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
          <span>Bespoke Gifting Experience • {theme}</span>
        </div>

        {!isOpen ? (
          /* State 1: Sealed Velvet Envelope */
          <div className="relative mx-auto max-w-md bg-[#6E2334] rounded-3xl p-8 sm:p-12 shadow-2xl border-4 border-[#EFBF73]/40 text-center transition-all transform hover:scale-[1.01]">
            {/* Envelope Stitch Details */}
            <div className="absolute inset-3 border border-dashed border-[#EFBF73]/30 rounded-2xl pointer-events-none"></div>

            <span className="material-symbols-outlined text-[48px] text-[#EFBF73] animate-bounce mb-3">
              mail
            </span>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#FFF8F7] tracking-tight">
              A Bespoke Gift Awaits
            </h2>
            <p className="font-body-md text-sm text-[#EFBF73]/90 mt-2">
              Presented exclusively for <strong className="text-white font-bold">{recipient}</strong>
            </p>

            {/* Interactive Gold Wax Seal Button */}
            <div className="mt-8 flex flex-col items-center">
              <button
                onClick={handleOpenEnvelope}
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#B3873F] via-[#EFBF73] to-[#FCE6BD] shadow-[0_8px_30px_rgba(239,191,115,0.4)] border-2 border-white/60 flex flex-col items-center justify-center text-primary group hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Click to Break Wax Seal"
              >
                <span className="material-symbols-outlined text-[32px] text-primary group-hover:rotate-12 transition-transform">
                  verified
                </span>
                <span className="font-label-sm text-[9px] uppercase font-bold tracking-tighter text-primary mt-0.5">
                  BREAK SEAL
                </span>
              </button>
              <span className="font-label-sm text-[11px] text-[#EFBF73]/80 uppercase tracking-wider font-semibold mt-3">
                Tap seal to reveal card
              </span>
            </div>
          </div>
        ) : (
          /* State 2: Unboxed Greeting Letter & Keepsake Card */
          <div className="space-y-6 animate-fadeIn">
            {/* The Handwritten Gifting Letter */}
            <div className="bg-[#FFFDFB] rounded-3xl border-2 border-[#EFBF73]/50 p-8 sm:p-12 shadow-2xl text-left relative overflow-hidden">
              {/* Corner Watermark */}
              <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
                <span className="font-display text-5xl font-bold text-secondary">TGE</span>
              </div>

              {/* Salutation */}
              <div className="border-b border-[#EFBF73]/30 pb-4 mb-6">
                <span className="font-label-sm text-[11px] text-secondary uppercase tracking-widest font-bold block">
                  A Special Message For You
                </span>
                <h1 className="font-display text-3xl sm:text-4xl text-primary font-bold mt-1">
                  Dearest {recipient},
                </h1>
              </div>

              {/* Letter Body in Playfair Style */}
              <div className="my-6">
                <p className="font-display text-lg sm:text-xl text-[#3D262A] italic leading-relaxed whitespace-pre-line">
                  &ldquo;{message}&rdquo;
                </p>
              </div>

              {/* Sign-off */}
              <div className="pt-4 border-t border-[#EFBF73]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="font-label-sm text-[11px] text-secondary uppercase tracking-wider font-semibold block">
                    Sent With Heartfelt Warmth
                  </span>
                  <p className="font-headline-sm text-lg font-bold text-primary mt-0.5">
                    {sender}
                  </p>
                </div>

                {/* Wax Seal Stamp */}
                <div className="flex items-center gap-2 bg-secondary-fixed/40 px-3.5 py-1.5 rounded-full border border-secondary/30 text-secondary">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span className="font-label-sm text-xs font-bold uppercase tracking-wider">
                    Authentic Wax Seal
                  </span>
                </div>
              </div>
            </div>

            {/* Media Attachment if provided */}
            {mediaUrl && (
              <div className="p-6 rounded-3xl bg-surface border border-secondary/30 shadow-md text-left">
                <h4 className="font-headline-sm text-base font-bold text-primary flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">movie</span>
                  <span>Personal Video Greeting Attached</span>
                </h4>
                <a
                  href={mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-xs font-semibold hover:bg-primary-container transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">play_circle</span>
                  <span>Watch Personal Video Wish</span>
                </a>
              </div>
            )}

            {/* Keepsake & Certificate of Heritage */}
            <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-outline-variant/40 shadow-sm text-left grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              <div className="sm:col-span-2 space-y-2">
                <span className="font-label-sm text-[10px] text-secondary uppercase tracking-widest font-bold block">
                  Certificate of Craftsmanship
                </span>
                <h4 className="font-headline-sm text-lg font-bold text-primary">
                  The Gift Edit Artisan Guarantee
                </h4>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  Every keepsake, confection, and aroma in this hamper was carefully hand-packed, curated, and sealed with traditional Indian artisanal pride.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="px-2.5 py-1 rounded-full bg-surface-container font-label-sm text-[10px] text-on-surface-variant">
                    100% Handcrafted
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container font-label-sm text-[10px] text-on-surface-variant">
                    Single-Estate &amp; Pure
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container font-label-sm text-[10px] text-on-surface-variant">
                    Eco-Conscious Keepsake Box
                  </span>
                </div>
              </div>

              {/* QR Verification Badge */}
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-container-low border border-secondary/20 text-center">
                <div className="p-2 rounded-xl bg-white border border-secondary/30 shadow-sm">
                  <QRCodeSVG
                    value={shareUrl}
                    size={90}
                    level="M"
                    fgColor="#6E2334"
                    bgColor="#FFFFFF"
                  />
                </div>
                <span className="font-label-sm text-[9px] uppercase font-bold text-secondary mt-1.5">
                  Verified Gift Pass
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                to="/customize-hamper"
                className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-md text-xs font-bold hover:bg-primary-container transition-all flex items-center gap-2 shadow-md"
              >
                <span className="material-symbols-outlined text-[16px]">redeem</span>
                <span>Send a Hamper in Return</span>
              </Link>
              <Link
                to="/"
                className="bg-surface text-primary border border-secondary/40 px-6 py-3 rounded-full font-label-md text-xs font-semibold hover:bg-surface-container transition-all"
              >
                Visit The Gift Edit Store
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
