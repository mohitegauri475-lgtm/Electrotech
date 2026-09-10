import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { WebsiteQrModal } from './WebsiteQrModal';

export const Footer = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/40 pt-space-3xl pb-space-xl">
      <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter-desktop mb-space-2xl">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-space-md">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-md text-headline-md text-primary font-semibold">THE GIFT EDIT</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm leading-relaxed">
              Artisanal Hampers for Unforgettable Moments. Hand-poured fragrances, heirloom confections, and bespoke celebratory keepsakes honoring Indian craftsmanship.
            </p>
            <div className="inline-flex items-center gap-space-2xs bg-surface border border-secondary/30 px-space-sm py-1.5 rounded-full text-secondary font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Handcrafted with Indian Heritage</span>
            </div>
            <div className="flex items-center gap-space-sm pt-space-xs">
              <a aria-label="Instagram" className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface transition-colors shadow-sm" href="#instagram">
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              </a>
              <a aria-label="Pinterest" className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface transition-colors shadow-sm" href="#pinterest">
                <span className="material-symbols-outlined text-[18px]">push_pin</span>
              </a>
              <a aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface transition-colors shadow-sm" href="#linkedin">
                <span className="material-symbols-outlined text-[18px]">work</span>
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div className="lg:col-span-2 space-y-space-sm">
            <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider font-semibold">Shop &amp; Occasions</h3>
            <ul className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
              <li className="hover:text-primary transition-colors"><Link to="/shop-hampers">Bestsellers Edit</Link></li>
              <li className="hover:text-primary transition-colors"><Link to="/occasions">Birthday Luxuries</Link></li>
              <li className="hover:text-primary transition-colors"><Link to="/occasions">Wedding &amp; Trousseau</Link></li>
              <li className="hover:text-primary transition-colors"><Link to="/occasions">Anniversary Keepsakes</Link></li>
              <li className="hover:text-primary transition-colors"><Link to="/occasions">Festivals &amp; Diwali</Link></li>
              <li className="hover:text-primary transition-colors"><Link to="/corporate-gifting">Corporate Gifting</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="lg:col-span-3 space-y-space-sm">
            <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider font-semibold">The Experience</h3>
            <ul className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
              <li className="hover:text-primary transition-colors"><Link to="/customize-hamper">Build Your Own Hamper</Link></li>
              <li className="hover:text-primary transition-colors"><Link to="/shop-hampers">Artisanal Gift Packaging</Link></li>
              <li className="hover:text-primary transition-colors"><Link to="/corporate-gifting">Bespoke Concierge</Link></li>
              <li className="hover:text-primary transition-colors"><Link to="/account">Track Shipment</Link></li>
              <li className="hover:text-primary transition-colors"><Link to="/about-us">About Our Craft</Link></li>
              <li className="hover:text-primary transition-colors"><Link to="/about-us">Connect With Stylist</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="lg:col-span-3 space-y-space-sm">
            <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider font-semibold">Join The Connoisseur Club</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Receive intimate previews of limited festival capsules, private trunk sales, and bespoke gifting catalogs.
            </p>
            {subscribed ? (
              <div className="p-3 bg-secondary-fixed/30 rounded-xl text-secondary font-label-md text-sm font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Welcome to the Connoisseur Club!</span>
              </div>
            ) : (
              <form className="space-y-space-xs" onSubmit={handleSubscribe}>
                <div className="flex items-center rounded-xl bg-surface border border-outline-variant/50 p-1 focus-within:border-primary">
                  <input
                    className="w-full bg-transparent px-space-xs text-on-surface text-body-sm placeholder:text-outline focus:outline-none"
                    placeholder="Enter your email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    className="bg-secondary text-on-secondary px-space-md py-2 rounded-lg font-label-sm text-label-sm font-semibold hover:bg-secondary/90 transition-all flex items-center justify-center shrink-0"
                    type="submit"
                  >
                    <span className="material-symbols-outlined text-[16px]">send</span>
                  </button>
                </div>
                <span className="font-label-sm text-[10px] text-on-surface-variant/70 block">
                  Complimentary wax-sealed gift tag on your first order.
                </span>
              </form>
            )}

            {/* Mobile QR Companion Card */}
            <div 
              onClick={() => setIsQrModalOpen(true)}
              className="mt-4 p-3 rounded-2xl bg-surface border border-secondary/30 shadow-sm flex items-center gap-3 cursor-pointer hover:border-primary transition-all group"
            >
              <div className="p-1.5 rounded-xl bg-white border border-secondary/30 shrink-0">
                <QRCodeSVG
                  value="http://localhost:5173"
                  size={48}
                  level="M"
                  fgColor="#6E2334"
                  bgColor="#FFFFFF"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-label-sm text-xs font-bold text-primary group-hover:text-secondary transition-colors">
                    Mobile Web QR
                  </span>
                  <span className="material-symbols-outlined text-secondary text-[14px]">open_in_new</span>
                </div>
                <p className="font-body-sm text-[11px] text-on-surface-variant leading-tight mt-0.5">
                  Scan with smartphone camera to shop on the go.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-outline-variant/30 pt-space-lg flex flex-col md:flex-row items-center justify-between gap-space-sm text-center md:text-left">
          <p className="font-body-sm text-body-sm text-on-surface-variant">© 2025 THE GIFT EDIT. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-space-md font-label-sm text-label-sm text-on-surface-variant">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center gap-1 text-primary hover:text-secondary font-semibold"
            >
              <span className="material-symbols-outlined text-[15px]">qr_code_scanner</span>
              <span>Scan QR Code</span>
            </button>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-secondary">lock</span>
              100% Secure Payments
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-secondary">handshake</span>
              Handcrafted in India
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-secondary">eco</span>
              Climate Conscious Delivery
            </span>
          </div>
        </div>
      </div>

      <WebsiteQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </footer>
  );
};
