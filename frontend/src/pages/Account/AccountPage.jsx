import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import { customHamperService } from '../../services/customHamperService';
import { formatPrice, formatDate } from '../../utils/formatters';
import { EditProfileModal } from '../../components/common/EditProfileModal';

export const AccountPage = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [customHampers, setCustomHampers] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [selectedQrOrder, setSelectedQrOrder] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  useEffect(() => {
    const loadAccountData = async () => {
      try {
        setLoading(true);
        const [ordersData, hampersData] = await Promise.all([
          orderService.getUserOrders(),
          customHamperService.getMyCustomHampers(),
        ]);
        setOrders(ordersData || []);
        setCustomHampers(hampersData || []);
      } catch (err) {
        console.error('Failed to load account data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAccountData();
  }, []);

  return (
    <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-desktop py-space-xl min-h-screen">
      {/* Profile Header */}
      <div className="rounded-3xl bg-surface border border-outline-variant/30 p-space-lg shadow-sm mb-space-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          {/* Avatar with Clickable Camera Overlay */}
          <div
            onClick={() => setIsEditProfileOpen(true)}
            className="relative group cursor-pointer shrink-0"
            title="Click to change profile photo"
          >
            <img
              src={user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDe48OuaNKIDxBM4Q7nZU-R6bzdk39Vkd-n9epOo6zEkJOZwMGfgg1KvMBFnKyW3RSIZw24bZj_H-VKpNmGHm0U7nymWlalammN0ng0drgaPOnOJEbxNP7-tv-vPWkDTbAhd_BoSGKn2WbHjExryue2Dtg8dW41wsuzgD6oUA8OO_akzv80hQ0YOYrbLBPPZ3h0UlXJtDtGhQZijBMYI8CBjdfe1771QzxLPcRduRNDhLPb6lCWPultow"}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-secondary/40 shadow-sm"
            />
            <div className="absolute inset-0 rounded-full bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
              <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              <span className="text-[9px] font-bold uppercase tracking-tight">Edit</span>
            </div>
          </div>

          <div>
            <span className="font-label-sm text-xs text-secondary uppercase font-bold tracking-widest block">
              Patron Profile
            </span>
            <h1 className="font-headline-sm text-2xl font-bold text-on-surface">{user?.fullName}</h1>
            <p className="font-body-sm text-xs text-on-surface-variant">
              {user?.email} • {user?.phone || 'No phone provided'}
            </p>
            {user?.city && (
              <span className="inline-flex items-center gap-1 text-[11px] text-secondary font-medium mt-1">
                <span className="material-symbols-outlined text-[13px]">location_on</span>
                <span>{user.address ? `${user.address}, ` : ''}{user.city}{user.state ? `, ${user.state}` : ''}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="px-5 py-2.5 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
            <span>Edit Profile &amp; Photo</span>
          </button>

          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-full border border-error text-error hover:bg-error-container/20 font-label-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/30 mb-space-lg">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 font-label-md text-sm transition-all border-b-2 ${
            activeTab === 'orders'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          Order History ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`pb-3 px-4 font-label-md text-sm transition-all border-b-2 ${
            activeTab === 'custom'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-on-surface-variant hover:text-primary'
          }`}
        >
          My Saved Bespoke Hampers ({customHampers.length})
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : activeTab === 'orders' ? (
        orders.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-3xl p-8">
            <span className="material-symbols-outlined text-outline text-[48px]">local_shipping</span>
            <h3 className="font-headline-sm text-lg font-semibold mt-2">No orders yet</h3>
            <p className="font-body-sm text-on-surface-variant mt-1">Your placed hamper orders will appear here.</p>
          </div>
        ) : (
          <div className="space-y-space-md">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl bg-surface border border-outline-variant/30 p-space-md shadow-sm space-y-space-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-xs border-b border-outline-variant/20 gap-2">
                  <div>
                    <span className="font-label-md text-sm font-bold text-primary block">
                      Order #{order.orderNumber}
                    </span>
                    <span className="font-body-sm text-xs text-on-surface-variant">
                      Placed on {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-secondary-fixed/40 text-on-secondary-fixed font-label-sm text-xs px-3 py-1 rounded-full font-bold">
                      {order.orderStatus}
                    </span>
                    <span className="font-headline-sm text-base font-bold text-primary">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items?.map((it) => (
                    <div key={it.id} className="flex justify-between items-center text-sm">
                      <span className="text-on-surface">
                        {it.itemTitle} <span className="text-on-surface-variant text-xs">x {it.quantity}</span>
                      </span>
                      <span className="font-semibold text-on-surface">{formatPrice(it.totalPrice)}</span>
                    </div>
                  ))}
                </div>

                {/* Tracking & Delivery */}
                <div className="pt-2 border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-on-surface-variant">
                  <span>Shipping to: <strong>{order.recipientName}</strong>, {order.shippingAddress}, {order.city}</span>
                  <div className="flex items-center gap-2">
                    {order.trackingNumber && (
                      <span className="font-mono bg-surface-container px-2 py-1 rounded">
                        Tracking: {order.trackingNumber}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedQrOrder(order)}
                      className="px-3 py-1 rounded-full bg-secondary-fixed/50 hover:bg-secondary-fixed text-primary font-label-sm text-xs font-semibold flex items-center gap-1 border border-secondary/30 transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[15px] text-secondary">qr_code_2</span>
                      <span>View QR Pass</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        customHampers.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-3xl p-8">
            <span className="material-symbols-outlined text-outline text-[48px]">inventory_2</span>
            <h3 className="font-headline-sm text-lg font-semibold mt-2">No saved custom hampers</h3>
            <p className="font-body-sm text-on-surface-variant mt-1">Design your own bespoke hamper in our studio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {customHampers.map((ch) => (
              <div
                key={ch.id}
                className="rounded-3xl bg-surface border border-outline-variant/30 p-space-md shadow-sm space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={ch.boxOption?.imageUrl}
                    alt={ch.boxOption?.name}
                    className="w-16 h-16 rounded-xl object-cover bg-surface-container"
                  />
                  <div>
                    <span className="font-label-sm text-[10px] text-secondary uppercase font-bold">
                      {ch.occasionTheme} Hamper
                    </span>
                    <h4 className="font-headline-sm text-base font-bold">{ch.boxOption?.name}</h4>
                    <span className="font-body-sm text-xs text-on-surface-variant block">
                      {ch.ribbonColor} Ribbon • {ch.cardStyle}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-surface-container-low rounded-xl text-xs space-y-1">
                  <p><strong>To:</strong> {ch.recipientName}</p>
                  <p className="italic text-on-surface-variant">"{ch.giftMessage}"</p>
                  <p className="text-right"><strong>— {ch.senderName}</strong></p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                  <span className="font-headline-sm text-base font-bold text-primary">
                    {formatPrice(ch.totalPrice)}
                  </span>
                  <span className="font-body-sm text-xs text-on-surface-variant">
                    {ch.items?.length || 0} items packed
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Order QR Pass Modal */}
      {selectedQrOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedQrOrder(null)}
            className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm"
          ></div>

          <div className="relative w-full max-w-md bg-surface rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-secondary/40 z-10 text-center animate-scaleIn">
            <button
              onClick={() => setSelectedQrOrder(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed/50 text-secondary font-label-sm text-[10px] uppercase font-bold tracking-widest mb-3 border border-secondary/30">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              <span>Official Verification Pass</span>
            </span>

            <h3 className="font-headline-sm text-xl font-bold text-primary">
              Order #{selectedQrOrder.orderNumber}
            </h3>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1">
              Recipient: <strong className="text-on-surface">{selectedQrOrder.recipientName}</strong> &bull; {formatPrice(selectedQrOrder.totalAmount)}
            </p>

            {/* High-Contrast Luxury QR Code */}
            <div className="my-5 flex flex-col items-center">
              <div className="p-3.5 rounded-2xl bg-white border-2 border-secondary/40 shadow-inner relative">
                <QRCodeSVG
                  value={typeof window !== 'undefined' ? `${window.location.origin}/account?order=${selectedQrOrder.orderNumber}` : `https://thegiftedit.com/account?order=${selectedQrOrder.orderNumber}`}
                  size={160}
                  level="H"
                  fgColor="#6E2334"
                  bgColor="#FFFFFF"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-7 h-7 rounded-full bg-white/95 border border-secondary shadow-sm flex items-center justify-center">
                    <span className="material-symbols-outlined text-[15px] text-primary">local_shipping</span>
                  </div>
                </div>
              </div>
              <span className="font-label-sm text-[11px] text-secondary font-bold uppercase tracking-wider mt-2.5">
                Scan with Phone Camera to Track
              </span>
              <p className="font-body-sm text-[11px] text-on-surface-variant max-w-[240px] mt-0.5">
                Couriers &amp; patrons can scan to verify delivery dispatch in real time.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-on-primary font-label-md text-xs font-bold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Print Pass</span>
              </button>
              <button
                onClick={() => setSelectedQrOrder(null)}
                className="py-2.5 px-5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs font-semibold transition-colors border border-outline-variant/30"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile & Photo Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
};
