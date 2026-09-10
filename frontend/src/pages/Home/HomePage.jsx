import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hamperService } from '../../services/hamperService';
import { reviewService } from '../../services/reviewService';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice } from '../../utils/formatters';
import { OCCASIONS } from '../../constants/themeConstants';
import { HamperDetailModal } from '../../components/common/HamperDetailModal';

export const HomePage = () => {
  const [hampers, setHampers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [addedItemNotice, setAddedItemNotice] = useState(null);
  const [selectedHamper, setSelectedHamper] = useState(null);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [hampersData, reviewsData] = await Promise.all([
          hamperService.getAllHampers(),
          reviewService.getAllReviews(),
        ]);
        setHampers(hampersData || []);
        setReviews(reviewsData || []);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQuickAdd = async (hamper, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      await addToCart({
        hamperId: hamper.id,
        hamper,
        quantity: 1,
        unitPrice: hamper.price,
      });
      setAddedItemNotice(`Added "${hamper.title}" to your shopping bag!`);
      setTimeout(() => setAddedItemNotice(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredHampers = hampers.filter((h) => {
    if (activeFilter === 'all') return true;
    return h.occasion?.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="flex flex-col w-full">
      {/* Toast Notification */}
      {addedItemNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-5 py-3 rounded-2xl shadow-2xl font-label-md flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[20px] text-secondary-fixed">check_circle</span>
          <span>{addedItemNotice}</span>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-surface-container-low pt-space-xl pb-space-3xl lg:pt-space-2xl lg:pb-[96px]">
        <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 flex flex-col items-start space-y-space-md z-10">
              {/* Trust Badges Pill */}
              <div className="inline-flex items-center gap-2 bg-surface-container-lowest px-space-sm py-1.5 rounded-full shadow-sm text-on-surface">
                <span className="flex items-center text-secondary font-bold text-[13px]">
                  <span className="material-symbols-outlined text-[15px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  4.9/5
                </span>
                <span className="text-outline text-xs">•</span>
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">12,000+ Happy Recipients</span>
                <span className="text-outline text-xs">•</span>
                <span className="font-label-md text-label-md text-primary font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">local_shipping</span> Same Day Dispatch
                </span>
              </div>

              {/* Main Title */}
              <h1 className="font-display text-display-mobile md:text-display text-on-surface tracking-tight leading-[1.08] font-bold">
                Make Every Gift Feel <span className="text-primary italic font-normal">Personal.</span>
              </h1>

              {/* Subtitle */}
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                Thoughtfully curated gift hampers, beautifully packed and personalized just for them. Unbox heirloom-quality confections, rare botanicals, and bespoke keepsakes.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-space-sm pt-space-xs w-full sm:w-auto">
                <Link
                  to="/customize-hamper"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs bg-primary text-on-primary font-label-lg text-label-lg px-space-xl py-3.5 rounded-full shadow-lg hover:bg-primary-container shadow-primary/20 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Build Your Hamper</span>
                  <span className="material-symbols-outlined text-[18px]">magic_button</span>
                </Link>
                <a
                  href="#bestsellers"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs bg-surface-container-lowest text-primary font-label-lg text-label-lg px-space-xl py-3.5 rounded-full shadow-sm hover:bg-surface-container-high transition-all"
                >
                  <span>Shop Ready-Made Hampers</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_outward</span>
                </a>
              </div>

              {/* Micro Highlight Row */}
              <div className="pt-space-md flex items-center gap-space-lg text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                  <span>Bespoke Wax Seals</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[18px]">nest_eco_leaf</span>
                  <span>100% Eco-Rigid Keepsake Boxes</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-6 relative mt-space-lg lg:mt-0">
              <div className="relative rounded-[28px] overflow-hidden shadow-2xl bg-surface-container-highest">
                <img
                  className="w-full aspect-[4/3] object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  alt="Editorial overhead lifestyle photograph of a luxurious open bespoke hamper box with gold foil lettering."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMAdJy-oni6PRYsnCmUCJT3HJOgWPZLRCAWibrT2HaDasVWD6QwNxvVG_ofuPJFQg-r4SW7TA9BGhT4AI0FLJeBqrxJ1Kit3bUh6jpJqzgJFv9YBMfpr6Nv1_DzbjagiWfmyF-xU2x5LiCqZVuY_dPViaGrBfZb_tUe-adxRKOJS5HXL7nsogPpJWmKtsS0grMmOfd9Mr9Cuaqo62keiR9S0Y7drMAKQJiAccElKxKPU79EjCQunO3DA"
                />
                {/* Luxury Floating Badges */}
                <div className="absolute top-6 left-6 backdrop-blur-md bg-surface-container-lowest/90 px-3.5 py-2 rounded-full shadow-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-widest font-bold">Hand-poured candle</span>
                </div>
                <div className="absolute bottom-8 left-8 backdrop-blur-md bg-surface-container-lowest/90 px-3.5 py-2 rounded-full shadow-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-primary">eco</span>
                  <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-widest font-bold">Single-origin cocoa</span>
                </div>
                <div className="absolute top-1/3 right-6 backdrop-blur-md bg-primary/95 text-on-primary px-3.5 py-2 rounded-full shadow-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-secondary-fixed">bookmark</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-widest font-semibold">Satin keepsake ribbon</span>
                </div>
              </div>
              {/* Decorative Ambient Layer */}
              <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full bg-secondary-fixed-dim/30 blur-3xl -z-10 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY OCCASION */}
      <section className="w-full py-space-3xl bg-surface">
        <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-xs">
            <div>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em] font-bold">Thoughtful Curation</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-semibold tracking-tight mt-1">
                Gift for the Occasion
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Curated collections crafted for life’s most cherished milestones, festivals, and unforgettable celebrations.
            </p>
          </div>

          {/* 8 Visual Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">
            {OCCASIONS.map((occ) => (
              <div
                key={occ.id}
                className="group relative rounded-2xl overflow-hidden bg-surface-container shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={occ.title}
                    src={occ.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/95 via-inverse-surface/40 to-transparent"></div>
                  <div className="absolute inset-x-0 bottom-0 p-space-md text-inverse-on-surface">
                    <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary-fixed font-bold">
                      {occ.badge}
                    </span>
                    <h3 className="font-headline-sm text-headline-sm font-semibold tracking-tight mt-0.5">
                      {occ.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-inverse-on-surface/80 mt-1">
                      {occ.subtitle}
                    </p>

                    <div className="mt-3 flex items-center gap-2 pt-2 border-t border-inverse-surface/40">
                      <Link
                        to={`/customize-hamper?occasion=${occ.id}`}
                        className="flex-1 py-1.5 px-2.5 rounded-full bg-secondary text-on-secondary font-label-sm text-[11px] font-bold text-center hover:bg-secondary-fixed transition-colors flex items-center justify-center gap-1 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[13px]">auto_fix_high</span>
                        <span>Build Gift</span>
                      </Link>
                      <Link
                        to={`/shop-hampers?occasion=${occ.id}`}
                        className="flex-1 py-1.5 px-2.5 rounded-full bg-inverse-surface/80 text-inverse-on-surface border border-outline-variant/40 font-label-sm text-[11px] font-semibold text-center hover:bg-inverse-surface transition-colors"
                      >
                        <span>Shop ({occ.title})</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BESTSELLING HAMPERS GRID */}
      <section className="w-full py-space-3xl bg-surface-container-low" id="bestsellers">
        <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-sm">
            <div>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em] font-bold">Signature Curations</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-semibold tracking-tight mt-1">
                Bestselling Gift Hampers
              </h2>
            </div>
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                { label: 'All Curations', value: 'all' },
                { label: 'Festive', value: 'festive' },
                { label: 'Wedding', value: 'wedding' },
                { label: 'Corporate', value: 'corporate' },
                { label: 'Wellness', value: 'wellness' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveFilter(tab.value)}
                  className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all shrink-0 ${
                    activeFilter === tab.value
                      ? 'bg-primary text-on-primary shadow-sm font-semibold'
                      : 'bg-surface text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-desktop py-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-3xl bg-surface p-space-md h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-desktop">
              {filteredHampers.map((hamper) => (
                <div
                  key={hamper.id}
                  onClick={() => setSelectedHamper(hamper)}
                  className="rounded-3xl bg-surface border border-outline-variant/30 p-space-md shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Image Container with Badge */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-space-sm bg-surface-container">
                      <img
                        src={hamper.imageUrl}
                        alt={hamper.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                        <span className="bg-surface/95 backdrop-blur-md text-primary px-3.5 py-1 rounded-full font-label-md text-[11px] font-bold shadow-md flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">visibility</span>
                          <span>Quick View</span>
                        </span>
                      </div>
                      {hamper.badge && (
                        <span className="absolute top-3 left-3 bg-surface/95 backdrop-blur-md text-primary border border-secondary/40 font-label-sm text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold shadow-sm">
                          {hamper.badge}
                        </span>
                      )}
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/90 backdrop-blur-md text-primary flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">favorite</span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-secondary font-label-sm text-label-sm">
                      <span className="uppercase tracking-wider font-bold">{hamper.category}</span>
                      <span className="flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        {hamper.rating} ({hamper.reviewsCount})
                      </span>
                    </div>

                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">
                      {hamper.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                      {hamper.description}
                    </p>

                    {/* Included Products in this Gift */}
                    {hamper.includedProducts && (
                      <div className="mt-3 pt-2.5 border-t border-dashed border-outline-variant/50">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-secondary uppercase tracking-wider mb-1.5">
                          <span className="material-symbols-outlined text-[14px]">featured_seasonal_and_gifts</span>
                          <span>Gift Includes:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {hamper.includedProducts.split(',').map((item, idx) => (
                            <span
                              key={idx}
                              className="bg-secondary-fixed/40 text-on-secondary-fixed text-[10.5px] px-2 py-0.5 rounded-md font-medium"
                            >
                              {item.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-space-md border-t border-outline-variant/30 mt-space-md flex items-center justify-between">
                    <div>
                      <span className="font-headline-sm text-headline-sm font-bold text-primary">
                        {formatPrice(hamper.price)}
                      </span>
                      {hamper.originalPrice && (
                        <span className="ml-2 text-xs line-through text-on-surface-variant">
                          {formatPrice(hamper.originalPrice)}
                        </span>
                      )}
                      <div className="mt-0.5">
                        <Link
                          to={`/customize-hamper?occasion=${hamper.occasion}`}
                          className="text-[11px] text-primary hover:text-secondary font-semibold underline"
                        >
                          Customize Similar Gift &rarr;
                        </Link>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleQuickAdd(hamper, e)}
                      className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                      <span>Quick Add</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Button */}
          <div className="mt-space-2xl text-center">
            <Link
              to="/shop-hampers"
              className="inline-flex items-center gap-space-xs bg-surface text-primary border border-primary/30 px-space-xl py-3 rounded-full font-label-md text-label-md font-bold hover:bg-primary hover:text-on-primary transition-all shadow-sm"
            >
              <span>Explore All 24+ Luxury Curations</span>
              <span className="material-symbols-outlined text-[18px]">east</span>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="w-full py-space-3xl bg-surface">
        <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="text-center max-w-2xl mx-auto mb-space-2xl">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em] font-bold">The Royal Standard</span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-semibold tracking-tight mt-1">
              Crafted Beyond Compare
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Every detail honors centuries-old Indian celebratory customs, reimagined with contemporary luxury.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-space-md">
            {[
              { icon: 'verified', title: 'Single-Origin Goods', text: 'Estate chocolates, Kashmiri saffron, and cold-pressed oils.' },
              { icon: 'auto_awesome', title: 'Rigid Velvet Boxes', text: 'Sturdy keepsake boxes with gold debossed hardware.' },
              { icon: 'history_edu', title: 'Hand-Wax Sealed', text: 'Complimentary calligraphy note with pure wax monogram.' },
              { icon: 'local_shipping', title: 'Pan-India Express', text: 'Thermal bubble-safe transit with live tracking.' },
              { icon: 'nest_eco_leaf', title: 'Climate Conscious', text: 'Biodegradable wood wool filling & reusable chests.' },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col items-center text-center space-y-space-xs"
              >
                <div className="w-12 h-12 rounded-full bg-surface text-secondary flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">{feature.icon}</span>
                </div>
                <h4 className="font-headline-sm text-[16px] text-on-surface font-semibold">{feature.title}</h4>
                <p className="font-body-sm text-[12px] text-on-surface-variant">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / BUILDER TEASER */}
      <section className="w-full py-space-3xl bg-surface-container-low relative overflow-hidden">
        <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-xl">
            <div className="lg:max-w-xl space-y-space-md">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em] font-bold">Bespoke Gifting Studio</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-semibold tracking-tight">
                Build Your Hamper in 4 Simple Steps
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Choose the heirloom trunk, curate artisanal delicacies, personalize with double-faced satin ribbon and a wax-sealed calligraphy card.
              </p>
              <div className="pt-space-xs">
                <Link
                  to="/customize-hamper"
                  className="inline-flex items-center gap-space-xs bg-primary text-on-primary px-space-xl py-3.5 rounded-full font-label-md text-label-md font-bold shadow-lg hover:bg-primary-container transition-all transform hover:-translate-y-0.5"
                >
                  <span>Launch Customizer Studio</span>
                  <span className="material-symbols-outlined text-[18px]">magic_button</span>
                </Link>
              </div>
            </div>

            {/* 4 Step Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              {[
                { step: '01', title: 'Choose Keepsake Box', desc: 'Select from Blush Pink, Ivory Linen, or Grand Velvet Trunk.' },
                { step: '02', title: 'Curate Delicacies', desc: 'Pick single-origin truffles, oud candles, teas, and mists.' },
                { step: '03', title: 'Personalize & Adorn', desc: 'Select satin ribbon color, card stationery, and custom message.' },
                { step: '04', title: 'Real-Time Preview', desc: 'See live visual unboxing staging before effortless checkout.' },
              ].map((s) => (
                <div key={s.step} className="p-space-md rounded-2xl bg-surface shadow-sm border border-outline-variant/30 space-y-1">
                  <span className="font-label-sm text-secondary text-sm font-bold tracking-widest">{s.step}</span>
                  <h4 className="font-headline-sm text-[16px] text-on-surface font-semibold">{s.title}</h4>
                  <p className="font-body-sm text-[12px] text-on-surface-variant">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="w-full py-space-3xl bg-surface">
        <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="text-center max-w-2xl mx-auto mb-space-2xl">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em] font-bold">Unboxing Stories</span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-semibold tracking-tight mt-1">
              Words From Our Patrons
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-space-lg rounded-3xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center text-secondary mb-space-xs">
                    {[...Array(rev.rating)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <h4 className="font-headline-sm text-[18px] text-on-surface font-semibold">"{rev.title}"</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed italic">
                    "{rev.content}"
                  </p>
                </div>
                <div className="pt-space-md border-t border-outline-variant/30 mt-space-md flex items-center justify-between">
                  <div>
                    <span className="font-label-md text-label-md text-on-surface font-bold block">{rev.authorName}</span>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">{rev.location}</span>
                  </div>
                  {rev.verifiedBuyer && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-label-sm text-primary bg-primary/5 px-2.5 py-1 rounded-full font-semibold">
                      <span className="material-symbols-outlined text-[14px]">verified</span> Verified Buyer
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL INVITATION BANNER */}
      <section className="w-full bg-primary text-on-primary py-space-3xl relative overflow-hidden">
        <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10 space-y-space-md">
          <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-[0.2em] font-bold">
            Celebrate In Grandeur
          </span>
          <h2 className="font-display text-headline-lg md:text-display font-semibold tracking-tight">
            Ready to Create an Heirloom Gift?
          </h2>
          <p className="font-body-lg text-body-lg text-primary-fixed max-w-xl mx-auto">
            Design a personalized hamper crafted with authentic Indian confections, aromatics, and personalized wax seals.
          </p>
          <div className="pt-space-xs flex flex-wrap items-center justify-center gap-space-sm">
            <Link
              to="/customize-hamper"
              className="bg-secondary text-on-secondary px-space-xl py-3.5 rounded-full font-label-md text-label-md font-bold hover:bg-secondary/90 shadow-lg transition-all"
            >
              Build Your Custom Hamper
            </Link>
            <Link
              to="/shop-hampers"
              className="bg-white/10 hover:bg-white/20 text-on-primary px-space-xl py-3.5 rounded-full font-label-md text-label-md font-bold transition-all"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Hamper Detail Quick-View Modal */}
      <HamperDetailModal
        hamper={selectedHamper}
        isOpen={Boolean(selectedHamper)}
        onClose={() => setSelectedHamper(null)}
      />
    </div>
  );
};
