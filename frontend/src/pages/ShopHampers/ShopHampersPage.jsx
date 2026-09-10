import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { hamperService } from '../../services/hamperService';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice } from '../../utils/formatters';
import { HamperDetailModal } from '../../components/common/HamperDetailModal';

export const ShopHampersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hampers, setHampers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [toast, setToast] = useState(null);
  const [selectedHamper, setSelectedHamper] = useState(null);

  const occasionParam = searchParams.get('occasion') || 'all';

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHampers = async () => {
      try {
        setLoading(true);
        const data = await hamperService.getAllHampers({
          occasion: occasionParam !== 'all' ? occasionParam : undefined,
        });
        setHampers(data || []);
      } catch (err) {
        console.error('Failed to load hampers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHampers();
  }, [occasionParam]);

  const handleQuickAdd = async (hamper, e) => {
    if (e) e.stopPropagation();
    try {
      await addToCart({
        hamperId: hamper.id,
        hamper,
        quantity: 1,
        unitPrice: hamper.price,
      });
      setToast(`Added "${hamper.title}" to your bag!`);
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredHampers = hampers
    .filter((h) => {
      const matchSearch =
        h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.includedProducts?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
      if (sortBy === 'rating') return Number(b.rating) - Number(a.rating);
      return 0; // featured
    });

  const OCCASIONS_FILTER = [
    { label: 'All Curations', value: 'all', icon: 'auto_awesome' },
    { label: 'Festive & Diwali', value: 'festive', icon: 'celebration' },
    { label: 'Weddings & Trousseau', value: 'wedding', icon: 'favorite' },
    { label: 'Birthday Joy', value: 'birthday', icon: 'cake' },
    { label: 'Anniversaries', value: 'anniversary', icon: 'local_florist' },
    { label: 'Corporate Honors', value: 'corporate', icon: 'business_center' },
    { label: 'Self Care & Spa', value: 'wellness', icon: 'spa' },
  ];

  return (
    <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-desktop py-space-xl min-h-screen">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-5 py-3.5 rounded-2xl shadow-2xl font-label-md flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-[20px] text-secondary-fixed">check_circle</span>
          <span>{toast}</span>
          <Link to="/cart" className="ml-2 text-xs font-bold text-secondary-fixed underline">
            View Bag &rarr;
          </Link>
        </div>
      )}

      {/* Hamper Detail Modal */}
      <HamperDetailModal
        hamper={selectedHamper}
        isOpen={Boolean(selectedHamper)}
        onClose={() => setSelectedHamper(null)}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
        <div>
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em] font-bold">
            Curated Gifting Catalog
          </span>
          <h1 className="font-display text-headline-lg md:text-display text-on-surface font-semibold tracking-tight mt-1">
            Luxury Curated Hampers
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-xl">
            Heirloom wooden boxes, raw silk trunks, and velvet chests filled with royal Indian delicacies, keepsakes, and perfumes.
          </p>
        </div>

        {/* Search Bar & Sorting */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="flex items-center rounded-2xl bg-surface border border-outline-variant/40 px-4 py-2.5 shadow-sm focus-within:border-primary w-full sm:w-72">
            <span className="material-symbols-outlined text-outline text-[20px] mr-2">search</span>
            <input
              type="text"
              placeholder="Search hampers, saffron, tea..."
              className="w-full bg-transparent text-sm focus:outline-none placeholder:text-outline"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-2xl bg-surface border border-outline-variant/40 px-4 py-2.5 text-sm font-medium text-on-surface shadow-sm focus:outline-none focus:border-primary"
          >
            <option value="featured">Featured Curations</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Occasion Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-space-lg no-scrollbar">
        {OCCASIONS_FILTER.map((f) => (
          <button
            key={f.value}
            onClick={() => setSearchParams(f.value === 'all' ? {} : { occasion: f.value })}
            className={`px-4 py-2.5 rounded-full font-label-md text-xs sm:text-sm transition-all shrink-0 flex items-center gap-1.5 ${
              occasionParam === f.value
                ? 'bg-primary text-on-primary font-bold shadow-md'
                : 'bg-surface text-on-surface hover:bg-surface-container border border-outline-variant/40 shadow-sm'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{f.icon}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between mb-space-md text-xs text-on-surface-variant font-semibold">
        <span>Showing {filteredHampers.length} luxury gift curations</span>
        <span className="text-secondary font-bold">✨ All hampers include complimentary gift card &amp; wax seal</span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-desktop py-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-3xl bg-surface p-space-md h-96 animate-pulse border border-outline-variant/20"></div>
          ))}
        </div>
      ) : filteredHampers.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-3xl p-8 max-w-xl mx-auto border border-outline-variant/30 shadow-sm">
          <span className="material-symbols-outlined text-outline text-[48px]">inventory_2</span>
          <h3 className="font-headline-sm text-lg font-semibold mt-2">No hampers found</h3>
          <p className="font-body-sm text-on-surface-variant mt-1">
            Try adjusting your search query or celebration filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSearchParams({});
            }}
            className="mt-4 px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-bold"
          >
            Reset Filters
          </button>
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
                {/* Image Container with Badges */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-space-sm bg-surface-container">
                  <img
                    src={hamper.imageUrl}
                    alt={hamper.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                    <span className="bg-surface/95 backdrop-blur-md text-primary px-4 py-1.5 rounded-full font-label-md text-xs font-bold shadow-lg flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Quick View Details</span>
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
                    <span
                      className="material-symbols-outlined text-[14px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    {hamper.rating} ({hamper.reviewsCount})
                  </span>
                </div>

                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1 group-hover:text-primary transition-colors">
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
                      onClick={(e) => e.stopPropagation()}
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
    </div>
  );
};
