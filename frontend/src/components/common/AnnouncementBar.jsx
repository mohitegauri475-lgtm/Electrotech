import React from 'react';

export const AnnouncementBar = () => {
  return (
    <div className="bg-primary text-secondary-fixed py-space-xs px-margin-mobile md:px-margin-desktop text-center font-label-sm text-label-sm tracking-widest flex items-center justify-center gap-space-xs">
      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
      <span>Free Express Delivery on Hampers above ₹2,999 | Handcrafted with Love Across India</span>
      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
    </div>
  );
};
