import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';

export const HamperDetailModal = ({ hamper, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [showQrShare, setShowQrShare] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setQuantity(1);
    setAddedNotice(false);
  }, [hamper]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !hamper) return null;

  const handleAddToCart = async () => {
    try {
      await addToCart({
        hamperId: hamper.id,
        hamper,
        quantity,
        unitPrice: hamper.price,
      });
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart({
        hamperId: hamper.id,
        hamper,
        quantity,
        unitPrice: hamper.price,
      });
      onClose();
      navigate('/checkout');
    } catch (err) {
      console.error(err);
    }
  };

  const discountPercent = hamper.originalPrice
    ? Math.round(((hamper.originalPrice - hamper.price) / hamper.originalPrice) * 100)
    : 0;

  const includedItems = hamper.includedProducts
    ? hamper.includedProducts.split(',').map((s) => s.trim())
    : [
        'Single-Origin Belgian Truffles',
        'Hand-poured Amber Soy Candle',
        'Kashmiri Saffron Infuser Tin',
        'Handcrafted Brass Bookmark',
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-surface rounded-3xl shadow-2xl border border-outline-variant/40 z-10 no-scrollbar">
        {/* Top Actions: QR Share & Close */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => setShowQrShare(!showQrShare)}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors ${
              showQrShare
                ? 'bg-secondary text-on-secondary'
                : 'bg-surface/90 text-on-surface hover:bg-surface-container'
            }`}
            aria-label="Share via QR"
            title="Scan or Share via QR Code"
          >
            <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface/90 text-on-surface hover:bg-surface-container flex items-center justify-center shadow-md transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Visual Presentation */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-surface-container overflow-hidden rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl">
            <img
              src={hamper.imageUrl}
              alt={hamper.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/40 via-transparent to-transparent"></div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {hamper.badge && (
                <span className="bg-surface/95 backdrop-blur-md text-primary border border-secondary/40 font-label-sm text-[11px] px-3 py-1 rounded-full uppercase tracking-wider font-bold shadow-sm">
                  {hamper.badge}
                </span>
              )}
              <span className="bg-secondary text-on-secondary font-label-sm text-[11px] px-3 py-1 rounded-full uppercase tracking-wider font-bold shadow-sm">
                {hamper.category}
              </span>
            </div>

            {discountPercent > 0 && (
              <div className="absolute bottom-4 left-4 bg-primary text-on-primary font-label-sm text-[11px] px-3 py-1 rounded-full font-bold shadow-md">
                Save {discountPercent}% Special Curation
              </div>
            )}
          </div>

          {/* Right Column: Hamper Details & Shopping Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Occasion & Rating */}
              <div className="flex items-center justify-between text-secondary text-sm">
                <span className="uppercase tracking-widest font-bold text-[11px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">celebration</span>
                  <span>{hamper.occasion} Celebration</span>
                </span>
                <span className="flex items-center gap-1 font-semibold text-xs text-on-surface-variant">
                  <span
                    className="material-symbols-outlined text-secondary text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <strong className="text-on-surface">{hamper.rating}</strong> ({hamper.reviewsCount} verified patrons)
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="font-display text-2xl sm:text-3xl text-primary font-bold tracking-tight">
                  {hamper.title}
                </h2>
                {hamper.subtitle && (
                  <p className="font-body-md text-sm text-secondary font-medium mt-1">
                    {hamper.subtitle}
                  </p>
                )}
              </div>

              {/* Price & Free Shipping */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="font-headline-lg text-3xl font-bold text-primary">
                  {formatPrice(hamper.price)}
                </span>
                {hamper.originalPrice && (
                  <span className="text-sm line-through text-on-surface-variant">
                    {formatPrice(hamper.originalPrice)}
                  </span>
                )}
                <span className="text-xs text-secondary font-bold bg-secondary-fixed/30 px-2 py-0.5 rounded-md">
                  Taxes Included
                </span>
              </div>

              {/* Description */}
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                {hamper.description}
              </p>

              {/* Included Products List */}
              <div className="rounded-2xl bg-surface-container-low p-4 border border-outline-variant/30 space-y-2.5">
                <h4 className="font-label-sm text-[12px] uppercase tracking-wider text-secondary font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                  <span>Curated Delicacies &amp; Keepsakes Inside:</span>
                </h4>
                <ul className="space-y-1.5">
                  {includedItems.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs text-on-surface">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Complimentary Perks */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-on-surface-variant">
                <div className="flex items-center gap-1.5 bg-surface-container/50 px-2.5 py-1.5 rounded-lg">
                  <span className="material-symbols-outlined text-secondary text-[16px]">local_shipping</span>
                  <span>Free Royal Courier</span>
                </div>
                <div className="flex items-center gap-1.5 bg-surface-container/50 px-2.5 py-1.5 rounded-lg">
                  <span className="material-symbols-outlined text-secondary text-[16px]">mail</span>
                  <span>Monogram Greeting Card</span>
                </div>
              </div>
            </div>

            {/* QR Share Card */}
            {showQrShare && (
              <div className="p-4 rounded-2xl bg-surface-container-low border border-secondary/40 shadow-inner flex flex-col sm:flex-row items-center gap-4 animate-fadeIn">
                <div className="p-2 rounded-xl bg-white border border-secondary/30 shadow-sm shrink-0">
                  <QRCodeSVG
                    value={typeof window !== 'undefined' ? `${window.location.origin}/shop-hampers?hamperId=${hamper.id}` : `https://thegiftedit.com/shop-hampers?hamperId=${hamper.id}`}
                    size={88}
                    level="H"
                    fgColor="#6E2334"
                    bgColor="#FFFFFF"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-label-md text-xs font-bold text-primary flex items-center justify-center sm:justify-start gap-1">
                    <span className="material-symbols-outlined text-[15px] text-secondary">smartphone</span>
                    <span>Scan to View on Mobile</span>
                  </h4>
                  <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5 leading-tight">
                    Scan with your smartphone camera to browse this hamper on mobile or share with family.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        navigator.clipboard.writeText(`${window.location.origin}/shop-hampers?hamperId=${hamper.id}`);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }
                    }}
                    className="mt-2 px-3 py-1 rounded-full bg-surface hover:bg-surface-container text-primary font-label-sm text-[11px] font-semibold border border-outline-variant/30 transition-colors inline-flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {copiedLink ? 'done' : 'content_copy'}
                    </span>
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Hamper Link'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Shopping Controls */}
            <div className="pt-4 border-t border-outline-variant/30 space-y-3">
              {addedNotice && (
                <div className="bg-secondary text-on-secondary text-xs font-bold py-2 px-4 rounded-xl text-center flex items-center justify-center gap-1.5 animate-fadeIn">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Added &quot;{hamper.title}&quot; to your bag!</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                {/* Quantity Control */}
                <div className="flex items-center rounded-full bg-surface-container p-1 shadow-inner shrink-0">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-full bg-surface text-on-surface flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="w-9 text-center font-label-md text-sm font-bold text-primary">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-full bg-surface text-on-surface flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 rounded-full bg-primary text-on-primary font-label-md text-sm font-bold hover:bg-primary-container shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                  <span>Add to Bag &bull; {formatPrice(hamper.price * quantity)}</span>
                </button>
              </div>

              {/* Buy Now / Direct Checkout */}
              <button
                onClick={handleBuyNow}
                className="w-full py-3 px-4 rounded-full bg-secondary text-on-secondary font-label-md text-sm font-bold hover:bg-secondary-fixed transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">flash_on</span>
                <span>Instant Buy Now &rarr;</span>
              </button>

              {/* Customize Link */}
              <div className="text-center pt-1">
                <Link
                  to={`/customize-hamper?occasion=${hamper.occasion}`}
                  onClick={onClose}
                  className="text-xs text-primary hover:text-secondary font-semibold underline inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                  <span>Want to personalize this hamper? Open in Atelier Studio</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
