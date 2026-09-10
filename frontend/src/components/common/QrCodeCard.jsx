import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export const QrCodeCard = ({
  value,
  title = 'Scan with Mobile',
  subtitle = 'Open seamlessly on your smartphone camera',
  size = 180,
  badge = 'Royal Digital Pass',
  showActions = true,
  actionUrl,
  accentColor = '#6E2334', // Burgundy
}) => {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);

  const handleCopyLink = () => {
    const textToCopy = actionUrl || value;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQr = () => {
    const svgElement = containerRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = size * 2;
    canvas.height = size * 2;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `${title.toLowerCase().replace(/\s+/g, '_')}_qr.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div
      ref={containerRef}
      className="p-5 rounded-3xl bg-surface border border-outline-variant/40 shadow-lg text-center flex flex-col items-center max-w-xs mx-auto transition-all"
    >
      {/* Top Badge */}
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed font-label-sm text-[10px] uppercase font-bold tracking-wider mb-3 border border-secondary/30">
          <span className="material-symbols-outlined text-[13px] text-secondary">qr_code_2</span>
          <span>{badge}</span>
        </span>
      )}

      {/* QR Code Container with Royal Gold Framing */}
      <div className="p-3.5 rounded-2xl bg-white border-2 border-secondary/40 shadow-inner relative group">
        <QRCodeSVG
          value={value}
          size={size}
          level="H"
          fgColor={accentColor}
          bgColor="#FFFFFF"
          includeMargin={false}
        />
        <div className="absolute inset-0 border border-secondary/20 rounded-2xl pointer-events-none"></div>
      </div>

      {/* Titles */}
      <h4 className="font-headline-sm text-base font-bold text-on-surface mt-3.5">
        {title}
      </h4>
      {subtitle && (
        <p className="font-body-sm text-xs text-on-surface-variant mt-1 leading-relaxed max-w-[220px]">
          {subtitle}
        </p>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center gap-2 mt-4 w-full">
          <button
            onClick={handleCopyLink}
            type="button"
            className="flex-1 py-2 px-3 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[15px]">
              {copied ? 'done' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={handleDownloadQr}
            type="button"
            title="Download QR Image"
            className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors flex items-center justify-center border border-primary/20"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
          </button>
        </div>
      )}
    </div>
  );
};
