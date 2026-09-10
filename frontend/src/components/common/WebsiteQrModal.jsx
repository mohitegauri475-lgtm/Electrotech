import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export const WebsiteQrModal = ({ isOpen, onClose, initialUrl }) => {
  const [activeTab, setActiveTab] = useState('current');
  const [copied, setCopied] = useState(false);

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

  const currentUrl = initialUrl || (typeof window !== 'undefined' ? window.location.href : 'https://thegiftedit.com');
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

  const qrOptions = {
    current: {
      url: currentUrl,
      title: 'Current Page',
      desc: 'Continue reading or exploring this exact screen on your smartphone camera.',
    },
    studio: {
      url: `${origin}/customize-hamper`,
      title: 'Bespoke Studio',
      desc: 'Design and preview your custom celebratory hamper with tactile touch controls.',
    },
    catalog: {
      url: `${origin}/shop-hampers`,
      title: 'Signature Hampers',
      desc: 'Browse our complete catalog of 14 royal hampers curated for every occasion.',
    },
  };

  const selectedTarget = qrOptions[activeTab] || qrOptions.current;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedTarget.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    const svgElement = document.getElementById('website-qr-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 400;
    canvas.height = 400;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 400, 400);
        ctx.drawImage(img, 0, 0, 400, 400);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `giftedit_${activeTab}_qr.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-surface rounded-3xl shadow-2xl border border-outline-variant/40 z-10 p-6 sm:p-8 animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed/50 text-secondary font-label-sm text-[11px] uppercase tracking-wider font-bold mb-2">
            <span className="material-symbols-outlined text-[14px]">smartphone</span>
            <span>Mobile Companion</span>
          </span>
          <h3 className="font-display text-2xl font-bold text-primary">
            Scan to Shop on Mobile
          </h3>
          <p className="font-body-sm text-xs text-on-surface-variant mt-1">
            Point your smartphone camera at the QR code below for instant mobile access.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex rounded-full bg-surface-container-low p-1 mb-5 border border-outline-variant/30">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-1.5 rounded-full font-label-sm text-xs transition-all ${
              activeTab === 'current'
                ? 'bg-surface text-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            This Page
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex-1 py-1.5 rounded-full font-label-sm text-xs transition-all ${
              activeTab === 'studio'
                ? 'bg-surface text-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Hamper Studio
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 py-1.5 rounded-full font-label-sm text-xs transition-all ${
              activeTab === 'catalog'
                ? 'bg-surface text-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            All Hampers
          </button>
        </div>

        {/* High-Contrast Luxury QR Frame */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-2xl bg-white border-2 border-secondary/40 shadow-md relative">
            <QRCodeSVG
              id="website-qr-svg"
              value={selectedTarget.url}
              size={180}
              level="H"
              fgColor="#6E2334"
              bgColor="#FFFFFF"
              includeMargin={false}
            />
            {/* Center Monogram Emblem */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-white/95 border border-secondary shadow-sm flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px] text-primary">redeem</span>
              </div>
            </div>
          </div>

          <p className="font-body-sm text-xs text-on-surface-variant text-center mt-3 max-w-[260px]">
            {selectedTarget.desc}
          </p>

          <div className="mt-2 text-center">
            <span className="font-mono text-[10px] text-outline truncate max-w-xs block px-2">
              {selectedTarget.url}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-outline-variant/20">
          <button
            onClick={handleCopy}
            className="py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? 'done' : 'content_copy'}
            </span>
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={handleDownloadQr}
            className="py-2.5 px-4 rounded-xl bg-primary text-on-primary font-label-sm text-xs font-semibold hover:bg-primary-container flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Download QR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
