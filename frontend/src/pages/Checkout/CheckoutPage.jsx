import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import { customHamperService } from '../../services/customHamperService';
import { formatPrice } from '../../utils/formatters';

export const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const directCustomHamperId = searchParams.get('customHamperId');

  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [directHamper, setDirectHamper] = useState(null);
  const [loadingDirect, setLoadingDirect] = useState(false);

  // Form State
  const [recipientName, setRecipientName] = useState(user?.fullName || 'Ananya Sharma');
  const [shippingAddress, setShippingAddress] = useState(user?.address || '42 Heritage Boulevard, Off MG Road');
  const [city, setCity] = useState(user?.city || 'Bengaluru');
  const [state, setState] = useState(user?.state || 'Karnataka');
  const [postalCode, setPostalCode] = useState(user?.postalCode || '560001');
  const [phone, setPhone] = useState(user?.phone || '+91 9876543210');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [utrNumber, setUtrNumber] = useState('');
  const [upiCopied, setUpiCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);
  const [error, setError] = useState(null);

  // Countdown timer for UPI QR Code
  useEffect(() => {
    if (paymentMethod !== 'UPI') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentMethod]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (user) {
      if (user.fullName) setRecipientName(user.fullName);
      if (user.phone) setPhone(user.phone);
      if (user.address) setShippingAddress(user.address);
      if (user.city) setCity(user.city);
      if (user.state) setState(user.state);
      if (user.postalCode) setPostalCode(user.postalCode);
    }
  }, [user]);

  useEffect(() => {
    if (directCustomHamperId) {
      const loadDirectHamper = async () => {
        try {
          setLoadingDirect(true);
          const data = await customHamperService.getCustomHamperById(directCustomHamperId);
          setDirectHamper(data);
          if (data.recipientName) setRecipientName(data.recipientName);
        } catch (err) {
          console.error('Failed to load direct hamper:', err);
        } finally {
          setLoadingDirect(false);
        }
      };
      loadDirectHamper();
    }
  }, [directCustomHamperId]);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        recipientName,
        shippingAddress,
        city,
        state,
        postalCode,
        phone,
        paymentMethod,
        directCustomHamperId: directCustomHamperId ? Number(directCustomHamperId) : null,
      };

      const placedOrder = await orderService.createOrder(payload);
      setOrderComplete(placedOrder);
      await fetchCart();
    } catch (err) {
      console.error('Failed to place order:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please check details.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  if (orderComplete) {
    const trackingQrValue = typeof window !== 'undefined'
      ? `${window.location.origin}/account?order=${orderComplete.orderNumber}`
      : `https://thegiftedit.com/track/${orderComplete.orderNumber}`;

    return (
      <div className="max-w-[760px] mx-auto px-4 py-16 text-center print:py-0 print:px-0">
        {/* Printable Gifting Pass Header */}
        <div className="w-20 h-20 rounded-full bg-secondary-fixed/40 text-secondary flex items-center justify-center mx-auto mb-4 print:hidden">
          <span className="material-symbols-outlined text-[48px]">verified</span>
        </div>
        <span className="font-label-sm text-secondary uppercase font-bold tracking-widest block">
          Royal Order Confirmed
        </span>
        <h1 className="font-display text-headline-lg text-primary font-bold mt-1">
          Thank You For Your Patronage
        </h1>
        <p className="font-body-lg text-on-surface-variant mt-2 max-w-md mx-auto print:text-sm">
          Your bespoke luxury hamper has entered our royal studio for artisanal packing and wax-sealing.
        </p>

        {/* The Luxury Gifting Slip with Embedded QR Code */}
        <div className="my-8 p-6 sm:p-8 rounded-3xl bg-surface border-2 border-secondary/40 text-left max-w-lg mx-auto shadow-xl relative overflow-hidden print:shadow-none print:border-black print:my-4">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-fixed/20 rounded-bl-full pointer-events-none print:hidden"></div>
          
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 mb-4">
            <div>
              <span className="font-label-sm text-[10px] text-secondary uppercase tracking-widest font-bold block">
                Official Tracking Pass
              </span>
              <h3 className="font-headline-sm text-xl font-bold text-primary">
                Order #{orderComplete.orderNumber}
              </h3>
            </div>
            <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full font-label-sm text-xs font-bold">
              {orderComplete.orderStatus || 'CONFIRMED'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Left: Details */}
            <div className="space-y-2.5 font-label-md text-xs">
              <div>
                <span className="text-on-surface-variant block text-[11px]">Recipient Name:</span>
                <span className="font-bold text-on-surface text-sm">{orderComplete.recipientName}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block text-[11px]">Destination:</span>
                <span className="font-semibold text-on-surface">{orderComplete.city}, {orderComplete.state}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block text-[11px]">Total Paid:</span>
                <span className="font-bold text-primary text-base">{formatPrice(orderComplete.totalAmount)}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block text-[11px]">Payment Method:</span>
                <span className="font-semibold text-secondary">{orderComplete.paymentMethod || 'UPI QR Instant'}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block text-[11px]">Estimated Delivery:</span>
                <span className="font-semibold text-on-surface">2-3 Business Days</span>
              </div>
            </div>

            {/* Right: Dynamic Tracking & Invoice QR Code */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-container-low border border-secondary/30 text-center">
              <div className="p-2.5 rounded-xl bg-white border border-secondary/40 shadow-sm relative">
                <QRCodeSVG
                  value={trackingQrValue}
                  size={120}
                  level="H"
                  fgColor="#6E2334"
                  bgColor="#FFFFFF"
                />
              </div>
              <span className="font-label-sm text-[10px] uppercase font-bold text-secondary tracking-wider mt-2.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">qr_code_scanner</span>
                <span>Scan to Track</span>
              </span>
              <p className="font-body-sm text-[10px] text-on-surface-variant mt-0.5">
                Scan with smartphone camera for real-time dispatch updates
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
          <button
            onClick={() => navigate('/account')}
            className="bg-primary text-on-primary px-7 py-3 rounded-full font-label-md font-bold hover:bg-primary-container transition-all flex items-center gap-2 shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
            <span>Track Order Status</span>
          </button>
          <button
            onClick={handlePrintSlip}
            className="bg-surface text-primary border border-secondary/50 px-6 py-3 rounded-full font-label-md font-semibold hover:bg-surface-container transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print Gifting Slip</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-surface text-on-surface-variant px-6 py-3 rounded-full font-label-md font-semibold hover:bg-surface-container transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const handleSimulateUpiPayment = async () => {
    setSubmitting(true);
    setError(null);
    try {
      // Simulate real-time UPI bank verification delay
      await new Promise((res) => setTimeout(res, 1200));

      const payload = {
        recipientName,
        shippingAddress,
        city,
        state,
        postalCode,
        phone,
        paymentMethod: 'UPI QR (Instant Verified)',
        directCustomHamperId: directCustomHamperId ? Number(directCustomHamperId) : null,
      };

      const placedOrder = await orderService.createOrder(payload);
      setOrderComplete(placedOrder);
      await fetchCart();
    } catch (err) {
      console.error('Failed to complete UPI order:', err);
      setError(err.response?.data?.message || 'Failed to verify UPI payment. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText('luxurygiftedit@okhdfcbank');
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2500);
  };

  const subtotal = directHamper ? Number(directHamper.totalPrice) : Number(cart.subtotal);
  const freeShipping = subtotal >= 2999;
  const shippingFee = freeShipping ? 0 : 199;
  const totalAmount = subtotal + shippingFee;
  const upiUri = `upi://pay?pa=luxurygiftedit@okhdfcbank&pn=The%20Gift%20Edit&am=${totalAmount}&tn=Order%20Payment&cu=INR`;

  return (
    <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-desktop py-space-xl min-h-screen">
      <div className="mb-space-xl">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em] font-bold">
          Instant Checkout
        </span>
        <h1 className="font-display text-headline-lg text-on-surface font-semibold tracking-tight mt-1">
          Complete Your Gifting Order
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-error-container text-on-error-container font-body-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">error</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
        {/* Left Col: Address & Payment Form */}
        <div className="lg:col-span-8 space-y-space-lg">
          {/* Recipient & Shipping Address */}
          <div className="rounded-3xl bg-surface border border-outline-variant/30 p-space-lg shadow-sm space-y-space-md">
            <h3 className="font-headline-sm text-xl font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">local_shipping</span>
              <span>1. Delivery & Recipient Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="space-y-1">
                <label className="block font-label-md text-xs uppercase font-bold text-on-surface">Recipient Name *</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-surface-container-lowest px-4 py-3 rounded-xl border border-outline-variant/50 focus:border-primary focus:outline-none"
                  placeholder="Full name of recipient"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-label-md text-xs uppercase font-bold text-on-surface">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-surface-container-lowest px-4 py-3 rounded-xl border border-outline-variant/50 focus:border-primary focus:outline-none"
                  placeholder="Recipient or sender mobile"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block font-label-md text-xs uppercase font-bold text-on-surface">Shipping Address *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-surface-container-lowest px-4 py-3 rounded-xl border border-outline-variant/50 focus:border-primary focus:outline-none"
                  placeholder="Street, apartment, suite"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-label-md text-xs uppercase font-bold text-on-surface">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-surface-container-lowest px-4 py-3 rounded-xl border border-outline-variant/50 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block font-label-md text-xs uppercase font-bold text-on-surface">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-surface-container-lowest px-4 py-3 rounded-xl border border-outline-variant/50 focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-label-md text-xs uppercase font-bold text-on-surface">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-surface-container-lowest px-4 py-3 rounded-xl border border-outline-variant/50 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-3xl bg-surface border border-outline-variant/30 p-space-lg shadow-sm space-y-space-md">
            <h3 className="font-headline-sm text-xl font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">payment</span>
              <span>2. Payment Option</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
              {[
                { id: 'UPI', label: 'UPI / QR Code', icon: 'qr_code_scanner' },
                { id: 'CARD', label: 'Credit / Debit Card', icon: 'credit_card' },
                { id: 'NETBANKING', label: 'Net Banking', icon: 'account_balance' },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-4 rounded-2xl cursor-pointer border flex items-center gap-3 transition-all ${
                    paymentMethod === m.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-outline-variant/40 bg-surface-container-low hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-primary text-[24px]">{m.icon}</span>
                  <span className="font-label-md text-sm font-bold text-on-surface">{m.label}</span>
                </div>
              ))}
            </div>

            {/* Dynamic UPI Payment QR Code Card */}
            {paymentMethod === 'UPI' && (
              <div className="mt-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-surface via-surface-container-lowest to-surface border-2 border-secondary/40 shadow-md">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Left: Scannable QR Code */}
                  <div className="p-3.5 rounded-2xl bg-white border-2 border-secondary/40 shadow-inner shrink-0 relative text-center">
                    <QRCodeSVG
                      value={upiUri}
                      size={160}
                      level="H"
                      fgColor="#6E2334"
                      bgColor="#FFFFFF"
                      includeMargin={false}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-7 h-7 rounded-full bg-white/95 border border-secondary shadow-sm flex items-center justify-center">
                        <span className="material-symbols-outlined text-[15px] text-primary">qr_code_2</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Payment Instructions & Actions */}
                  <div className="flex-1 space-y-3 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed/50 text-secondary font-label-sm text-[11px] font-bold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                        <span>Live UPI QR</span>
                      </span>
                      <span className="font-mono text-xs text-on-surface-variant font-semibold">
                        ⏳ Valid for: <strong className="text-primary">{formatTimer(timeLeft)}</strong>
                      </span>
                    </div>

                    <div>
                      <h4 className="font-headline-sm text-lg font-bold text-primary">
                        Scan to Pay {formatPrice(totalAmount)}
                      </h4>
                      <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                        Scan using Google Pay, PhonePe, Paytm, BHIM, CRED, or any banking app.
                      </p>
                    </div>

                    {/* Merchant UPI ID & Copy */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-surface-container border border-outline-variant/30">
                      <span className="font-label-sm text-[11px] text-on-surface-variant shrink-0">UPI ID:</span>
                      <span className="font-mono font-bold text-xs text-on-surface truncate flex-1">
                        luxurygiftedit@okhdfcbank
                      </span>
                      <button
                        type="button"
                        onClick={copyUpiId}
                        className="px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-container-high text-primary font-label-sm text-[11px] font-semibold border border-primary/20 transition-colors shrink-0"
                      >
                        {upiCopied ? 'Copied ✓' : 'Copy'}
                      </button>
                    </div>

                    {/* Supported Apps Pills */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
                      {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'CRED'].map((app) => (
                        <span
                          key={app}
                          className="px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant font-label-sm text-[10px] font-semibold"
                        >
                          {app}
                        </span>
                      ))}
                    </div>

                    {/* Simulation & Instant Verification CTA */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleSimulateUpiPayment}
                        disabled={submitting}
                        className="w-full py-2.5 px-4 rounded-xl bg-secondary text-on-secondary font-label-md text-xs font-bold hover:bg-secondary/90 shadow-sm transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>{submitting ? 'Verifying Bank Payment...' : 'Simulate Instant UPI Verification & Complete'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Order Summary & Place Order Button */}
        <div className="lg:col-span-4 rounded-3xl bg-surface border border-outline-variant/30 p-space-lg shadow-lg space-y-space-md sticky top-[136px]">
          <h3 className="font-headline-sm text-xl font-semibold pb-space-xs border-b border-outline-variant/20">
            Order Review
          </h3>

          {/* Items breakdown */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1 no-scrollbar">
            {directHamper ? (
              <div className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low">
                <img src={directHamper.boxOption?.imageUrl} alt="Custom Hamper" className="w-12 h-12 rounded-lg object-cover" />
                <div className="truncate flex-1">
                  <h4 className="font-label-md text-xs font-bold truncate">Bespoke: {directHamper.boxOption?.name}</h4>
                  <span className="font-body-sm text-[11px] text-on-surface-variant block">{directHamper.ribbonColor} Ribbon</span>
                </div>
                <span className="font-label-md text-sm font-bold text-primary">{formatPrice(directHamper.totalPrice)}</span>
              </div>
            ) : (
              cart.items?.map((it) => (
                <div key={it.id} className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low">
                  <img src={it.imageUrl} alt={it.title} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="truncate flex-1">
                    <h4 className="font-label-md text-xs font-bold truncate">{it.title}</h4>
                    <span className="font-body-sm text-[11px] text-on-surface-variant block">Qty: {it.quantity}</span>
                  </div>
                  <span className="font-label-md text-sm font-bold text-primary">{formatPrice(it.totalPrice)}</span>
                </div>
              ))
            )}
          </div>

          <div className="space-y-space-xs font-body-sm text-body-sm pt-2 border-t border-outline-variant/20">
            <div className="flex justify-between text-on-surface-variant">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Express Delivery:</span>
              <span className={freeShipping ? 'text-secondary font-semibold' : ''}>
                {freeShipping ? 'FREE' : formatPrice(shippingFee)}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-outline-variant/20">
              <span className="font-headline-sm text-lg font-bold text-on-surface">Total:</span>
              <span className="font-headline-md text-2xl font-bold text-primary">{formatPrice(totalAmount)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || subtotal === 0}
            className="w-full py-3.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-md hover:bg-primary-container disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <span>{submitting ? 'Placing Order...' : 'Pay & Confirm Order'}</span>
            <span className="material-symbols-outlined text-[18px]">lock</span>
          </button>
        </div>
      </form>
    </div>
  );
};
