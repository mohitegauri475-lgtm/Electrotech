import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice } from '../../utils/formatters';

export const CartPage = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoNotice, setPromoNotice] = useState(null);

  const items = cart.items || [];

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ROYAL10') {
      setDiscountPercent(10);
      setPromoNotice({ type: 'success', msg: 'Royal 10% discount applied to your order!' });
    } else if (promoCode.trim().toUpperCase() === 'FIRSTGIFT') {
      setDiscountPercent(15);
      setPromoNotice({ type: 'success', msg: '15% First-time Gifting discount applied!' });
    } else {
      setPromoNotice({ type: 'error', msg: 'Invalid promo code. Try "ROYAL10"' });
    }
  };

  const discountAmount = discountPercent > 0 ? (cart.subtotal * discountPercent) / 100 : 0;
  const finalTotal = Math.max(0, cart.totalAmount - discountAmount);

  return (
    <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-desktop py-space-xl min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-space-xl">
        <div>
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em] font-bold">
            Online Shopping Bag
          </span>
          <h1 className="font-display text-headline-lg text-on-surface font-semibold tracking-tight mt-1">
            Your Gifting Edit ({cart.totalItems || 0})
          </h1>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="font-body-sm text-xs text-error hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
            Clear Bag
          </button>
        )}
      </div>

      {/* Guest Notice (if not logged in) */}
      {!isAuthenticated && items.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-secondary-fixed/20 border border-secondary/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-on-surface">
            <span className="material-symbols-outlined text-secondary text-[20px]">account_circle</span>
            <span>
              Shopping as our esteemed guest. You can checkout directly or{' '}
              <Link to="/login?redirect=/cart" className="text-primary font-bold underline">
                Sign in
              </Link>{' '}
              to save your order history.
            </span>
          </div>
          <Link
            to="/login?redirect=/cart"
            className="hidden sm:inline-block px-3 py-1 rounded-full bg-surface text-primary border border-primary/20 text-xs font-bold hover:bg-surface-container"
          >
            Sign In
          </Link>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-24 bg-surface rounded-3xl p-8 max-w-xl mx-auto shadow-sm border border-outline-variant/30">
          <span className="material-symbols-outlined text-secondary text-[64px]">shopping_bag</span>
          <h3 className="font-headline-sm text-2xl font-bold mt-3 text-primary">Your Shopping Bag is Empty</h3>
          <p className="font-body-md text-on-surface-variant mt-2 mb-6">
            Explore our bestselling royal curations or build your custom bespoke hamper in the studio.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/shop-hampers"
              className="bg-primary text-on-primary font-label-md px-6 py-3 rounded-full font-bold hover:bg-primary-container transition-all shadow-md flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              <span>Shop Ready Hampers</span>
            </Link>
            <Link
              to="/customize-hamper"
              className="bg-surface text-primary border border-primary/30 font-label-md px-6 py-3 rounded-full font-bold hover:bg-surface-container transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
              <span>Build Custom Gift</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-space-md">
            {/* Free Shipping Progress Indicator */}
            <div className="p-4 rounded-2xl bg-surface border border-outline-variant/30 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[16px] text-secondary">local_shipping</span>
                  {cart.qualifiesForFreeShipping
                    ? '🎉 You unlocked Complimentary Royal Express Shipping!'
                    : `Add ${formatPrice(2000 - cart.subtotal)} more to unlock FREE Royal Courier Shipping`}
                </span>
                <span className="text-secondary font-bold">
                  {cart.qualifiesForFreeShipping ? 'FREE' : '₹199'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, Math.round((cart.subtotal / 2000) * 100))}%` }}
                ></div>
              </div>
            </div>

            {items.map((item) => {
              const isCustom = Boolean(item.customHamperId || item.customHamper);
              const title = isCustom
                ? `Bespoke ${item.customHamper?.boxOption?.name || 'Hamper'} (${item.customHamper?.occasionTheme || 'Custom'})`
                : item.hamper?.title || 'Signature Hamper';
              const imageUrl = isCustom
                ? item.customHamper?.boxOption?.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuADhih6ec4Z-9axIBoZGzdCBt8qNdYBXERSODdB6zbEaLcrTOXMD_dUlo5ocVBFvFKMzGaxV_Wirg_P_BiCPbPDumMmOncwiaadzBKe9geXkPl6Lk4MHhiQL-80gHA63QCXOPCpMot-7xxwNT7tb11a3ET7Ig_1qwmIIDG4Rrq2vj5y1mynr7rwcC0dv3S6TiIgmtrNpIY0BXheWGY2kfI7wfiuuWutA5Dh-PWHIkLkNzGwD30DCDLmmQ'
                : item.hamper?.imageUrl;
              const unitPrice = item.unitPrice || item.hamper?.price || item.customHamper?.totalPrice || 0;
              const totalPrice = item.totalPrice || unitPrice * item.quantity;

              return (
                <div
                  key={item.id}
                  className="rounded-3xl bg-surface border border-outline-variant/30 p-space-md shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md"
                >
                  <div className="flex items-center gap-space-md">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-24 h-24 rounded-2xl object-cover bg-surface-container shrink-0 border border-outline-variant/30"
                    />
                    <div>
                      <div className="inline-flex items-center gap-1 bg-secondary-fixed/40 text-on-secondary-fixed px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
                        {isCustom ? 'Custom Atelier Hamper' : item.hamper?.category || 'Signature Gift'}
                      </div>
                      <h3 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface">
                        {title}
                      </h3>
                      <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                        Unit Price: {formatPrice(unitPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-space-lg">
                    {/* Quantity Selector */}
                    <div className="flex items-center rounded-full bg-surface-container p-1 shadow-inner">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-surface text-on-surface flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors text-sm font-bold"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-label-md text-sm font-bold text-primary">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-surface text-on-surface flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors text-sm font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[100px]">
                      <span className="font-headline-sm text-lg font-bold text-primary block">
                        {formatPrice(totalPrice)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-outline hover:text-error transition-colors mt-0.5 underline font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Drawer */}
          <div className="lg:col-span-4 rounded-3xl bg-surface border border-outline-variant/30 p-space-lg shadow-xl space-y-space-md sticky top-24">
            <h3 className="font-headline-sm text-xl font-bold text-primary pb-space-xs border-b border-outline-variant/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">receipt_long</span>
              <span>Order Summary</span>
            </h3>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold block">
                Promotional Code:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter ROYAL10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary uppercase font-bold"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:bg-secondary-fixed transition-colors shadow-sm"
                >
                  Apply
                </button>
              </div>
              {promoNotice && (
                <p
                  className={`text-[11px] font-semibold ${
                    promoNotice.type === 'success' ? 'text-green-700' : 'text-error'
                  }`}
                >
                  {promoNotice.msg}
                </p>
              )}
            </form>

            <div className="space-y-space-xs font-body-sm text-body-sm pt-2 border-t border-outline-variant/20">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal ({cart.totalItems} items):</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Royal Discount ({discountPercent}%):</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-on-surface-variant">
                <span>Royal Courier Delivery:</span>
                <span className={cart.qualifiesForFreeShipping ? 'text-secondary font-bold' : ''}>
                  {cart.qualifiesForFreeShipping ? 'COMPLIMENTARY' : formatPrice(cart.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Wax Monogram Seal &amp; Note:</span>
                <span className="text-secondary font-semibold">COMPLIMENTARY</span>
              </div>

              <div className="h-px bg-outline-variant/30 my-3"></div>

              <div className="flex justify-between items-baseline">
                <span className="font-headline-sm text-lg font-bold text-on-surface">Grand Total:</span>
                <div className="text-right">
                  <span className="font-headline-md text-2xl font-bold text-primary">
                    {formatPrice(finalTotal)}
                  </span>
                  <span className="block font-label-sm text-[10px] text-on-surface-variant">
                    All taxes &amp; duties included
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-full bg-primary text-on-primary font-label-md text-sm font-bold shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Express Checkout</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>

            <Link
              to="/shop-hampers"
              className="w-full py-2.5 rounded-full bg-surface text-primary border border-primary/30 font-label-md text-xs font-bold hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Continue Exploring Hampers</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
