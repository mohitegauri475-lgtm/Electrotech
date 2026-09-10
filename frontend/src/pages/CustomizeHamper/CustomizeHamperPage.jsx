import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { boxService } from '../../services/boxService';
import { productService } from '../../services/productService';
import { customHamperService } from '../../services/customHamperService';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice } from '../../utils/formatters';
import { RIBBON_COLORS, GIFTING_THEMES, GREETING_CARDS } from '../../constants/themeConstants';

export const CustomizeHamperPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlOccasion = searchParams.get('occasion');

  const [boxes, setBoxes] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(2); // Step 2 active by default as in design
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeOccasion, setActiveOccasion] = useState(urlOccasion || 'All');

  // Customizer State
  const [selectedBox, setSelectedBox] = useState(null);
  const [selectedItems, setSelectedItems] = useState({}); // { productId: { product, quantity } }
  const [ribbonColor, setRibbonColor] = useState(RIBBON_COLORS[0]);
  const [occasionTheme, setOccasionTheme] = useState('Elegant');
  const [cardStyle, setCardStyle] = useState(GREETING_CARDS[0]);
  const [recipientName, setRecipientName] = useState('Ananya Sharma');
  const [senderName, setSenderName] = useState('With all our love, Kabir & Mira');
  const [giftMessage, setGiftMessage] = useState(
    'Dearest Ananya, Wishing you joy, radiance, and quiet luxury in every step ahead. May this year be as warm and sweet as this hamper!'
  );
  const [hasPolaroid, setHasPolaroid] = useState(false);
  const [polaroidUrl, setPolaroidUrl] = useState(null);
  const [hasDigitalQr, setHasDigitalQr] = useState(true);
  const [mediaWishUrl, setMediaWishUrl] = useState('');

  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [boxesData, productsData] = await Promise.all([
          boxService.getAllBoxes(),
          productService.getAllProducts(),
        ]);
        setBoxes(boxesData || []);
        setProducts(productsData || []);

        if (boxesData && boxesData.length > 0) {
          // Default select Grand Luxury Trunk (id 3 or index 2) as in design
          const defaultBox = boxesData.find((b) => b.name.includes('Grand Luxury')) || boxesData[0];
          setSelectedBox(defaultBox);
        }

        // Initialize 4 pre-packed items matching Stitch customizer design
        if (productsData && productsData.length >= 4) {
          const initialItems = {};
          productsData.slice(0, 4).forEach((p) => {
            initialItems[p.id] = { product: p, quantity: 1 };
          });
          setSelectedItems(initialItems);
        }
      } catch (err) {
        console.error('Failed to load customizer data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Compute items total & count
  const packedItemsArray = Object.values(selectedItems);
  const totalItemsCount = packedItemsArray.reduce((acc, item) => acc + item.quantity, 0);
  const itemsSubtotal = packedItemsArray.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );
  const boxPrice = selectedBox ? Number(selectedBox.price) : 0;
  const addonsPrice = hasPolaroid ? 99 : 0;
  const totalAmount = boxPrice + itemsSubtotal + addonsPrice;
  const maxCapacity = selectedBox ? selectedBox.capacity : 8;
  const capacityPercent = Math.min(100, Math.round((totalItemsCount / maxCapacity) * 100));

  // Item quantity handlers
  const handleAddItem = (product) => {
    if (totalItemsCount >= maxCapacity) {
      setNotice(`Your box has reached its maximum capacity of ${maxCapacity} items!`);
      setTimeout(() => setNotice(null), 3000);
      return;
    }

    setSelectedItems((prev) => {
      const current = prev[product.id];
      const newQty = current ? current.quantity + 1 : 1;
      return {
        ...prev,
        [product.id]: { product, quantity: newQty },
      };
    });
  };

  const handleDecreaseItem = (productId) => {
    setSelectedItems((prev) => {
      const current = prev[productId];
      if (!current) return prev;
      if (current.quantity <= 1) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return {
        ...prev,
        [productId]: { ...current, quantity: current.quantity - 1 },
      };
    });
  };

  const handleRemoveItem = (productId) => {
    setSelectedItems((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  // Save / Add Custom Hamper to Cart
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/customize-hamper');
      return;
    }

    if (!selectedBox) return;

    try {
      setSaving(true);
      const payload = {
        boxOptionId: selectedBox.id,
        ribbonColor: ribbonColor.name,
        occasionTheme,
        cardStyle: cardStyle.name,
        recipientName,
        senderName,
        giftMessage,
        polaroidPhotoUrl: polaroidUrl,
        hasPolaroid,
        items: packedItemsArray.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      };

      const customHamper = await customHamperService.createCustomHamper(payload);
      await addToCart({ customHamperId: customHamper.id, quantity: 1 });
      navigate('/cart');
    } catch (err) {
      console.error('Failed to add custom hamper to cart:', err);
      setNotice('Failed to save custom hamper. Please try again.');
      setTimeout(() => setNotice(null), 3500);
    } finally {
      setSaving(false);
    }
  };

  // Instant Checkout
  const handleInstantCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/customize-hamper');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        boxOptionId: selectedBox.id,
        ribbonColor: ribbonColor.name,
        occasionTheme,
        cardStyle: cardStyle.name,
        recipientName,
        senderName,
        giftMessage,
        polaroidPhotoUrl: polaroidUrl,
        hasPolaroid,
        items: packedItemsArray.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      };

      const customHamper = await customHamperService.createCustomHamper(payload);
      navigate(`/checkout?customHamperId=${customHamper.id}`);
    } catch (err) {
      console.error('Failed to prepare checkout:', err);
    } finally {
      setSaving(false);
    }
  };

  const OCCASIONS_LIST = [
    { id: 'All', name: 'All Celebrations', icon: 'auto_awesome' },
    { id: 'wedding', name: 'Royal Wedding', icon: 'favorite' },
    { id: 'festive', name: 'Festive & Diwali', icon: 'celebration' },
    { id: 'corporate', name: 'Corporate Honors', icon: 'business_center' },
    { id: 'birthday', name: 'Birthday Treats', icon: 'cake' },
    { id: 'anniversary', name: 'Anniversary', icon: 'local_florist' },
    { id: 'wellness', name: 'Ayurvedic Wellness', icon: 'spa' },
  ];

  const categories = [
    'All',
    'Chocolates',
    'Candles',
    'Skincare',
    'Coffee & Tea',
    'Mugs & Glassware',
    'Accessories & Trinkets',
  ];

  const handleAutoPackOccasionBundle = (occId) => {
    const targetOccasion = occId || activeOccasion;
    if (targetOccasion === 'All') return;

    const matchingProds = products.filter(
      (p) => p.occasion && p.occasion.toLowerCase().includes(targetOccasion.toLowerCase())
    );

    if (matchingProds.length === 0) return;

    const newSelected = {};
    let count = 0;
    const max = selectedBox ? selectedBox.capacity : 6;

    for (const p of matchingProds) {
      if (count >= max) break;
      newSelected[p.id] = { product: p, quantity: 1 };
      count++;
    }

    setSelectedItems(newSelected);

    if (targetOccasion === 'wedding') {
      setOccasionTheme('Romantic');
      setRibbonColor(RIBBON_COLORS.find((r) => r.id === 'champagne-gold') || RIBBON_COLORS[0]);
    } else if (targetOccasion === 'festive') {
      setOccasionTheme('Festive / Diwali');
      setRibbonColor(RIBBON_COLORS.find((r) => r.id === 'burgundy-wine') || RIBBON_COLORS[1]);
    } else if (targetOccasion === 'corporate') {
      setOccasionTheme('Corporate Honors');
      setRibbonColor(RIBBON_COLORS.find((r) => r.id === 'royal-navy') || RIBBON_COLORS[3]);
    } else if (targetOccasion === 'birthday') {
      setOccasionTheme('Birthday');
      setRibbonColor(RIBBON_COLORS.find((r) => r.id === 'rose-petal') || RIBBON_COLORS[4]);
    } else if (targetOccasion === 'anniversary') {
      setOccasionTheme('Romantic');
      setRibbonColor(RIBBON_COLORS.find((r) => r.id === 'champagne-gold') || RIBBON_COLORS[0]);
    } else if (targetOccasion === 'wellness') {
      setOccasionTheme('Elegant');
      setRibbonColor(RIBBON_COLORS.find((r) => r.id === 'forest-emerald') || RIBBON_COLORS[2]);
    }

    const occObj = OCCASIONS_LIST.find((o) => o.id === targetOccasion);
    setNotice(`✨ Auto-packed ${count} curated delicacies for ${occObj?.name || 'this celebration'}!`);
    setTimeout(() => setNotice(null), 3500);
  };

  const getOccasionBadge = (prod) => {
    if (!prod.occasion) return null;
    if (activeOccasion !== 'All' && prod.occasion.toLowerCase().includes(activeOccasion.toLowerCase())) {
      const occ = OCCASIONS_LIST.find((o) => o.id === activeOccasion);
      return occ ? `${occ.name} Pick` : 'Occasion Pick';
    }
    if (prod.occasion.includes('wedding')) return 'Wedding Curated';
    if (prod.occasion.includes('festive')) return 'Festive Special';
    if (prod.occasion.includes('corporate')) return 'Executive Gift';
    if (prod.occasion.includes('birthday')) return 'Birthday Treat';
    if (prod.occasion.includes('anniversary')) return 'Romantic Keepsake';
    if (prod.occasion.includes('wellness')) return 'Ayurvedic Ritual';
    return null;
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category?.toLowerCase() === activeCategory.toLowerCase();
    const matchesOccasion = activeOccasion === 'All' || (p.occasion && p.occasion.toLowerCase().includes(activeOccasion.toLowerCase()));
    return matchesCategory && matchesOccasion;
  });

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Toast Notice */}
      {notice && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-primary text-on-primary px-6 py-3 rounded-full shadow-2xl font-label-md flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-secondary-fixed">info</span>
          <span>{notice}</span>
        </div>
      )}

      {/* Subtle decorative ambient glow behind hero */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[360px] bg-gradient-to-b from-primary-fixed/30 via-secondary-fixed/20 to-transparent blur-3xl pointer-events-none -z-10"></div>

        {/* Breadcrumb & Studio Title Header */}
        <div className="max-w-[1360px] mx-auto px-margin-mobile md:px-margin-desktop pt-space-md pb-space-lg">
          <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs text-body-sm font-body-sm text-on-surface-variant mb-space-sm">
            <span className="cursor-pointer hover:text-primary transition-colors flex items-center gap-1" onClick={() => navigate('/')}>
              <span className="material-symbols-outlined text-[16px]">cottage</span>
              <span>Home</span>
            </span>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-semibold">Customize Hamper</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div className="space-y-space-2xs max-w-2xl">
              <div className="inline-flex items-center gap-space-2xs bg-secondary-fixed/40 px-3 py-1 rounded-full text-secondary font-label-sm text-label-sm uppercase tracking-widest">
                <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                <span>Atelier • Bespoke Builder</span>
              </div>
              <h1 className="font-display text-headline-lg md:text-display text-primary tracking-tight font-semibold">
                Hamper Studio: Bespoke Gifting
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Craft a one-of-a-kind hamper tailored to their exact taste, down to the ribbon color and personal wax seal note.
              </p>
            </div>

            {/* Trust Badges Quick Row */}
            <div className="flex items-center gap-space-md py-space-xs px-space-md rounded-2xl bg-surface-container-low shadow-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase text-on-surface font-bold">100% Curated</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Royal Artisanal Goods</span>
                </div>
              </div>
              <div className="h-8 w-px bg-outline-variant/40"></div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">local_shipping</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase text-on-surface font-bold">Express Dispatch</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Safe Pan-India Transit</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5-STEP INTERACTIVE PROGRESS BAR */}
          <div className="mt-space-xl p-space-md md:p-space-lg rounded-2xl bg-surface shadow-md">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-y-space-md gap-x-space-xs relative">
              <div className="hidden md:block absolute top-[18px] left-[10%] right-[10%] h-[2px] bg-outline-variant/50 -z-0"></div>
              <div
                className="hidden md:block absolute top-[18px] left-[10%] h-[2px] bg-secondary z-0 transition-all duration-500"
                style={{ width: `${(currentStep - 1) * 22}%` }}
              ></div>

              {[
                { step: 1, title: 'Choose Box', id: 'step-box' },
                { step: 2, title: 'Add Products', id: 'step-products' },
                { step: 3, title: 'Personalize', id: 'step-personalize' },
                { step: 4, title: 'Preview', id: 'step-preview' },
                { step: 5, title: 'Checkout', id: 'step-checkout' },
              ].map((s) => {
                const isActive = currentStep === s.step;
                const isPassed = currentStep > s.step;

                return (
                  <div
                    key={s.step}
                    onClick={() => setCurrentStep(s.step)}
                    className="flex items-center gap-3 relative z-10 cursor-pointer"
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-label-md text-label-md font-bold shadow-sm transition-all ${
                        isActive
                          ? 'bg-primary text-on-primary ring-4 ring-primary-fixed shadow-md animate-pulse'
                          : isPassed
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {isPassed ? (
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      ) : (
                        s.step
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-label-sm text-label-sm uppercase tracking-wider ${isActive ? 'text-primary font-bold' : isPassed ? 'text-secondary' : 'text-on-surface-variant'}`}>
                        {isActive ? 'Current Step' : `Step ${s.step}`}
                      </span>
                      <span className={`font-label-md text-label-md font-bold ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                        {s.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN WORKSPACE: TWO-COLUMN LAYOUT */}
      <div className="max-w-[1360px] mx-auto w-full px-margin-mobile md:px-margin-desktop py-space-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
          {/* LEFT / MAIN BUILDER WORKSPACE (Col 8) */}
          <div className="lg:col-span-8 flex flex-col gap-space-2xl">
            {/* STEP 1: CHOOSE YOUR BOX */}
            <section className="space-y-space-md" id="step-box">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-sm text-label-sm uppercase px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold">
                    Step 1 of 5
                  </span>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Choose Your Keepsake Box</h2>
                </div>
                <span className="font-body-sm text-body-sm text-secondary flex items-center gap-1 font-medium cursor-pointer hover:underline">
                  <span className="material-symbols-outlined text-[16px]">info</span> Packaging Details
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Each bespoke box is handcrafted with rigid millboard, gold-embossed metallic hardware, and plush internal shredding for an exquisite unboxing reveal.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
                {boxes.map((box) => {
                  const isSelected = selectedBox?.id === box.id;
                  return (
                    <div
                      key={box.id}
                      onClick={() => setSelectedBox(box)}
                      className={`relative rounded-2xl bg-surface p-space-md transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'shadow-lg ring-2 ring-primary bg-gradient-to-b from-primary-fixed/10 to-transparent'
                          : 'shadow-sm hover:shadow-md'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute -top-3 right-6 bg-primary text-on-primary font-label-sm text-label-sm px-3 py-1 rounded-full uppercase tracking-wider font-bold shadow-md flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          <span>Selected</span>
                        </div>
                      )}
                      <div>
                        <div className="relative w-full h-44 rounded-xl overflow-hidden mb-space-sm bg-surface-container">
                          <img
                            src={box.imageUrl}
                            alt={box.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className={`absolute top-2 left-2 font-label-sm text-label-sm px-2 py-0.5 rounded-full shadow-sm ${isSelected ? 'bg-primary text-on-primary font-semibold' : 'bg-surface/90 backdrop-blur-md text-on-surface'}`}>
                            Holds up to {box.capacity} items
                          </span>
                          {box.isBestseller && (
                            <span className="absolute bottom-2 right-2 bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold shadow-sm">
                              Bestseller
                            </span>
                          )}
                        </div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`font-headline-sm text-headline-sm font-bold ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                              {box.name}
                            </h3>
                            {box.subtitle && (
                              <span className="font-label-sm text-[11px] text-secondary font-semibold uppercase tracking-wider">
                                {box.subtitle}
                              </span>
                            )}
                          </div>
                          <span className="font-label-lg text-label-lg font-bold text-primary">
                            {formatPrice(box.price)}
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                          {box.description}
                        </p>
                      </div>

                      <div className="mt-space-md">
                        {isSelected ? (
                          <div className="w-full py-2.5 rounded-full font-label-md text-label-md bg-primary text-on-primary flex items-center justify-center gap-1.5 shadow-sm">
                            <span className="material-symbols-outlined text-[18px]">verified</span>
                            <span>Active Selection</span>
                          </div>
                        ) : (
                          <button className="w-full py-2.5 rounded-full font-label-md text-label-md text-primary bg-primary/5 hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-1.5">
                            <span>Select Box</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* STEP 2: CHOOSE PRODUCTS */}
            <section className="space-y-space-md pt-space-md" id="step-products">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                <div className="space-y-space-2xs">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-label-sm text-label-sm uppercase px-2.5 py-1 rounded-full bg-primary text-on-primary font-bold">
                      Step 2 of 5
                    </span>
                    <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                      Curate Your Delicacies &amp; Keepsakes
                    </h2>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Select from our award-winning Indian confectionery, artisanal home fragrances, and heirloom accessories.
                  </p>
                </div>

                {/* Live Counter Chip */}
                <div className="inline-flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full font-label-md text-label-md text-on-surface shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping"></span>
                  <span>Packed: <strong className="text-primary font-bold">{totalItemsCount}</strong> of {maxCapacity} items</span>
                </div>
              </div>

              {/* Occasion Filter Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-[11px] uppercase tracking-wider text-secondary font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">celebration</span>
                    <span>1. Curate for the Occasion:</span>
                  </span>
                  {activeOccasion !== 'All' && (
                    <button
                      onClick={() => setActiveOccasion('All')}
                      className="text-[11px] text-primary hover:text-secondary underline font-medium"
                    >
                      Clear occasion filter
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {OCCASIONS_LIST.map((occ) => {
                    const isOccSelected = activeOccasion.toLowerCase() === occ.id.toLowerCase();
                    return (
                      <button
                        key={occ.id}
                        onClick={() => {
                          setActiveOccasion(occ.id);
                          if (occ.id !== 'All') {
                            setSearchParams({ occasion: occ.id });
                          } else {
                            setSearchParams({});
                          }
                        }}
                        className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md shrink-0 transition-all flex items-center gap-1.5 shadow-sm border ${
                          isOccSelected
                            ? 'bg-secondary text-on-secondary border-secondary font-bold shadow-md'
                            : 'bg-surface text-on-surface border-outline-variant/50 hover:bg-surface-container'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">{occ.icon}</span>
                        <span>{occ.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 1-Click Occasion Auto-Pack Luxury Banner */}
              {activeOccasion !== 'All' && (
                <div className="bg-gradient-to-r from-secondary-fixed/50 via-secondary-fixed/20 to-surface-container border border-secondary/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-md">
                      <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
                    </span>
                    <div>
                      <h4 className="font-headline-sm text-[16px] font-bold text-primary">
                        Curating for {OCCASIONS_LIST.find((o) => o.id === activeOccasion)?.name || activeOccasion}?
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Click below to instantly auto-pack your box with our sommelier&apos;s royal delicacies &amp; keepsakes.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAutoPackOccasionBundle(activeOccasion)}
                    className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-all shadow-md flex items-center gap-1.5 shrink-0"
                  >
                    <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                    <span>Auto-Pack {OCCASIONS_LIST.find((o) => o.id === activeOccasion)?.name} Gift</span>
                  </button>
                </div>
              )}

              {/* Category Filter Pills */}
              <div className="space-y-1.5">
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                  2. Filter by Category:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 no-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md shrink-0 transition-colors shadow-sm ${
                        activeCategory === cat
                          ? 'bg-primary text-on-primary font-semibold'
                          : 'bg-surface text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-space-md">
                {filteredProducts.map((prod) => {
                  const packedItem = selectedItems[prod.id];
                  const qty = packedItem ? packedItem.quantity : 0;
                  const isAdded = qty > 0;
                  const occasionBadge = getOccasionBadge(prod);

                  return (
                    <div
                      key={prod.id}
                      className="rounded-2xl bg-surface p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative w-full h-40 rounded-xl overflow-hidden mb-space-sm bg-surface-container">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                          {isAdded && (
                            <span className="absolute top-2 right-2 bg-secondary text-on-secondary font-label-sm text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                              In Box ({qty})
                            </span>
                          )}
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {prod.isLuxury && (
                              <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                                Luxury
                              </span>
                            )}
                            {occasionBadge && (
                              <span className="bg-primary/90 text-on-primary font-label-sm text-[10px] px-2 py-0.5 rounded-full font-semibold shadow-sm">
                                {occasionBadge}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="font-label-sm text-[10px] text-secondary font-bold uppercase tracking-wider">
                          {prod.category}
                        </span>
                        <h4 className="font-headline-sm text-[17px] text-on-surface font-semibold line-clamp-1">
                          {prod.name}
                        </h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-2">
                          {prod.description}
                        </p>
                      </div>

                      <div className="mt-space-md pt-space-xs flex items-center justify-between">
                        <span className="font-label-lg text-label-lg font-bold text-primary">
                          {formatPrice(prod.price)}
                        </span>
                        {isAdded ? (
                          <div className="flex items-center rounded-full bg-surface-container-high p-1 shadow-inner">
                            <button
                              onClick={() => handleDecreaseItem(prod.id)}
                              className="w-7 h-7 rounded-full bg-surface text-on-surface flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors text-sm font-bold"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-label-md text-label-md font-bold text-primary">
                              {qty}
                            </span>
                            <button
                              onClick={() => handleAddItem(prod)}
                              className="w-7 h-7 rounded-full bg-surface text-on-surface flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors text-sm font-bold"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddItem(prod)}
                            className="px-3.5 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-all font-label-md text-label-md font-semibold flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* STEP 3: PERSONALIZE YOUR BOX */}
            <section className="space-y-space-lg pt-space-md" id="step-personalize">
              <div className="space-y-space-2xs">
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-sm text-label-sm uppercase px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold">
                    Step 3 of 5
                  </span>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Personalize &amp; Adorn</h2>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Every detail is tailored to your sentiment. Choose your double-faced satin ribbon, artisan stationery, and heartfelt message.
                </p>
              </div>

              <div className="rounded-3xl bg-surface p-space-lg md:p-space-xl shadow-md space-y-space-xl">
                {/* 1. Ribbon Color Selector */}
                <div>
                  <div className="flex items-center justify-between mb-space-xs">
                    <label className="font-label-lg text-label-lg text-on-surface font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[20px]">palette</span>
                      <span>Hand-Tied Double-Faced Satin Ribbon</span>
                    </label>
                    <span className="font-body-sm text-body-sm text-primary font-semibold">
                      Selected: {ribbonColor.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-space-sm pt-space-xs">
                    {RIBBON_COLORS.map((rib) => {
                      const isRibSelected = ribbonColor.id === rib.id;
                      return (
                        <button
                          key={rib.id}
                          onClick={() => setRibbonColor(rib)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                            isRibSelected
                              ? 'bg-secondary-fixed/20 ring-2 ring-secondary'
                              : 'bg-surface-container hover:bg-surface-container-high'
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-full shadow-inner ring-2 ring-surface"
                            style={{ backgroundColor: rib.hex }}
                          ></div>
                          <span className="font-label-sm text-label-sm font-bold text-on-surface">{rib.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Gifting Theme Chips */}
                <div>
                  <label className="block font-label-lg text-label-lg text-on-surface font-bold mb-space-xs">
                    Occasion Theme Accent
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {GIFTING_THEMES.map((thm) => (
                      <button
                        key={thm}
                        onClick={() => setOccasionTheme(thm)}
                        className={`px-4 py-2 rounded-full font-label-md text-label-md transition-colors ${
                          occasionTheme === thm
                            ? 'bg-primary text-on-primary font-bold shadow-sm'
                            : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        {thm}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Greeting Card Choice */}
                <div>
                  <label className="block font-label-lg text-label-lg text-on-surface font-bold mb-space-xs">
                    Stationery &amp; Card Style (Complimentary)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-sm">
                    {GREETING_CARDS.map((card) => {
                      const isCardSelected = cardStyle.id === card.id;
                      return (
                        <div
                          key={card.id}
                          onClick={() => setCardStyle(card)}
                          className={`p-space-md rounded-2xl cursor-pointer relative transition-all ${
                            isCardSelected
                              ? 'bg-surface-container-low ring-2 ring-secondary shadow-sm'
                              : 'bg-surface-container hover:bg-surface-container-high'
                          }`}
                        >
                          <span className={`material-symbols-outlined text-[22px] mb-1 ${isCardSelected ? 'text-secondary' : 'text-on-surface-variant'}`}>
                            {card.icon}
                          </span>
                          <div className="font-headline-sm text-[16px] text-on-surface font-semibold">{card.name}</div>
                          <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">{card.description}</p>
                          {isCardSelected && (
                            <span className="absolute top-3 right-3 text-secondary material-symbols-outlined text-[18px]">
                              check_circle
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Recipient Name & Sign-off Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div className="space-y-space-2xs">
                    <label className="block font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold">
                      Recipient Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">person</span>
                      <input
                        className="w-full bg-surface-container-lowest pl-12 pr-4 py-3 rounded-xl text-on-surface font-body-md text-body-md shadow-inner focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        type="text"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="e.g. Ananya Sharma"
                      />
                    </div>
                    <span className="font-label-sm text-[11px] text-on-surface-variant">Printed elegantly on the greeting card envelope.</span>
                  </div>

                  <div className="space-y-space-2xs">
                    <label className="block font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold">
                      Sender Name / Sign-off
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">edit</span>
                      <input
                        className="w-full bg-surface-container-lowest pl-12 pr-4 py-3 rounded-xl text-on-surface font-body-md text-body-md shadow-inner focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="e.g. With love, Kabir & Mira"
                      />
                    </div>
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="space-y-space-2xs">
                  <div className="flex items-center justify-between">
                    <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider font-semibold">
                      Personal Gift Message (Hand-Inscribed or Calligraphy)
                    </label>
                    <span className="font-label-sm text-[11px] text-on-surface-variant">
                      {giftMessage.length} / 250 characters
                    </span>
                  </div>
                  <textarea
                    className="w-full bg-surface-container-lowest p-4 rounded-xl text-on-surface font-headline-sm text-[16px] italic leading-relaxed shadow-inner focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                    rows="4"
                    maxLength={250}
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                  ></textarea>
                  <div className="flex items-center justify-between text-on-surface-variant text-body-sm pt-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                      <span>Complimentary gold wax seal applied to envelope.</span>
                    </span>
                  </div>
                </div>

                {/* 5. Photo Attachment Option */}
                <div className="p-space-md rounded-2xl bg-surface-container-low shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                  <div className="flex items-start gap-space-md">
                    <div className="w-14 h-16 rounded-xl bg-surface-container-lowest p-1 shadow-sm flex flex-col items-center justify-center shrink-0">
                      <div className="w-12 h-10 bg-primary-fixed/40 rounded flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[20px]">photo_camera</span>
                      </div>
                      <span className="font-label-sm text-[8px] text-outline mt-0.5">POLAROID</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-headline-sm text-[17px] text-on-surface font-semibold">Add a Mini Polaroid Keepsake Print</h4>
                        <span className="bg-secondary text-on-secondary font-label-sm text-[10px] px-2 py-0.5 rounded-full font-bold">+ ₹99</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        We print your cherished photo on authentic matte archival paper and tuck it into the velvet ribbon sash.
                      </p>
                    </div>
                  </div>
                  <label className="cursor-pointer bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-full shadow-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2 shrink-0">
                    <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                    <span>{hasPolaroid ? 'Photo Attached ✓' : 'Upload Photograph'}</span>
                    <input
                      className="hidden"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setHasPolaroid(true);
                          setPolaroidUrl(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                    />
                  </label>
                </div>

                {/* 6. Digital QR Greeting & Voice/Video Unboxing Card */}
                <div className="p-space-md rounded-2xl bg-surface-container-low shadow-sm border border-secondary/30 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-secondary-fixed/50 text-secondary flex items-center justify-center shrink-0 border border-secondary/30">
                        <span className="material-symbols-outlined text-[26px]">qr_code_2</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-headline-sm text-[17px] text-on-surface font-semibold">
                            Digital QR Greeting &amp; Video Reveal Card
                          </h4>
                          <span className="bg-secondary text-on-secondary font-label-sm text-[10px] px-2 py-0.5 rounded-full font-bold">
                            Complimentary
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          We affix a scannable golden QR seal to the physical greeting card envelope. When your recipient scans it with their phone camera, it reveals an interactive unboxing letter and your personal media wishes!
                        </p>
                      </div>
                    </div>

                    {/* Toggle button */}
                    <button
                      type="button"
                      onClick={() => setHasDigitalQr(!hasDigitalQr)}
                      className={`px-4 py-2 rounded-full font-label-md text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 ${
                        hasDigitalQr
                          ? 'bg-secondary text-on-secondary shadow-sm'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {hasDigitalQr ? 'check_circle' : 'add_circle'}
                      </span>
                      <span>{hasDigitalQr ? 'QR Seal Enabled' : 'Enable QR Seal'}</span>
                    </button>
                  </div>

                  {hasDigitalQr && (
                    <div className="pt-3 border-t border-outline-variant/30 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-8 space-y-3">
                        <div className="space-y-1">
                          <label className="block font-label-md text-xs uppercase font-bold text-on-surface">
                            Optional Video or Audio Wish Link (YouTube / Vimeo / Cloud Link)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[18px]">
                              video_camera_front
                            </span>
                            <input
                              type="url"
                              value={mediaWishUrl}
                              onChange={(e) => setMediaWishUrl(e.target.value)}
                              placeholder="https://youtu.be/... or drive.google.com/..."
                              className="w-full bg-surface-container-lowest pl-10 pr-3 py-2 rounded-xl text-xs border border-outline-variant/40 focus:border-primary focus:outline-none"
                            />
                          </div>
                          <span className="text-[11px] text-on-surface-variant block">
                            Attach a personalized video wish or recorded voice note to play during recipient unboxing.
                          </span>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <a
                            href={`${typeof window !== 'undefined' ? window.location.origin : ''}/greeting-card?to=${encodeURIComponent(recipientName || 'Recipient')}&from=${encodeURIComponent(senderName || 'Sender')}&msg=${encodeURIComponent(giftMessage || '')}&theme=${encodeURIComponent(occasionTheme || 'Royal')}${mediaWishUrl ? `&media=${encodeURIComponent(mediaWishUrl)}` : ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary font-label-sm text-xs font-semibold transition-colors border border-primary/20"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                            <span>Preview Recipient Unboxing Experience in New Tab</span>
                            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                          </a>
                        </div>
                      </div>

                      {/* Mini QR Preview Card */}
                      <div className="md:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-surface border border-secondary/30 text-center">
                        <div className="p-2 rounded-xl bg-white border border-secondary/30 shadow-sm">
                          <QRCodeSVG
                            value={`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'}/greeting-card?to=${encodeURIComponent(recipientName || 'Recipient')}&from=${encodeURIComponent(senderName || 'Sender')}&msg=${encodeURIComponent(giftMessage || '')}&theme=${encodeURIComponent(occasionTheme || 'Royal')}${mediaWishUrl ? `&media=${encodeURIComponent(mediaWishUrl)}` : ''}`}
                            size={90}
                            level="M"
                            fgColor="#6E2334"
                            bgColor="#FFFFFF"
                          />
                        </div>
                        <span className="font-label-sm text-[10px] uppercase font-bold text-secondary mt-2 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">qr_code</span>
                          <span>Envelope Golden Seal</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* STEP 4: REAL-TIME STAGING PREVIEW CARD */}
            <section className="space-y-space-md pt-space-md" id="step-preview">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-sm text-label-sm uppercase px-2.5 py-1 rounded-full bg-secondary text-on-secondary font-bold">
                    Step 4 • Visualizer
                  </span>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Real-Time Hamper Staging</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    Interactive Staging
                  </span>
                </div>
              </div>

              {/* Staged Unboxing Hero Preview */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl bg-surface-container">
                <div className="relative w-full h-[460px] md:h-[520px]">
                  <img
                    className="w-full h-full object-cover"
                    alt="Staged bespoke hamper box"
                    src={selectedBox?.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDW75ooPNedcpflUEwu9EGlgZl4sCQv6dkqPifFNdLCyX0XFrnDItV07idDk9vAjq9ZAMefYcB4pIk5esGs4o3lq0On4IHHgn28Ja_UeQ1kOHgqFUl96dF08u0kE4Zj8CnB1N0AFPAJKdW_uvdTcmiqcOf7WyapJQoDwte_IbtxGsrL-1g_FhS_OPf2RskgRMJxejkj6yD_QZiHUNHx9aslsDnvDOgC3gXomwqhAjysfdB2Di8aKODF-g"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>

                  {/* Top Left Tag */}
                  <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md rounded-2xl p-3 shadow-md max-w-xs">
                    <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-widest block">Staged Hamper</span>
                    <p className="font-headline-sm text-[16px] text-on-surface font-semibold">{selectedBox?.name}</p>
                    <div className="flex items-center gap-2 mt-1 text-[12px] font-body-sm text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ribbonColor.hex }}></span>
                        {ribbonColor.name} Ribbon
                      </span>
                      <span>•</span>
                      <span>{totalItemsCount} Selected Items</span>
                    </div>
                  </div>

                  {/* Floating Live Greeting Card Card with QR Pass */}
                  <div className="absolute bottom-4 left-4 right-4 md:right-auto md:max-w-md bg-surface/95 backdrop-blur-xl rounded-2xl p-space-md shadow-2xl space-y-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-[10px] text-secondary font-bold uppercase tracking-widest flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">local_activity</span>
                        {cardStyle.name} Note
                      </span>
                      {hasDigitalQr && (
                        <span className="flex items-center gap-1 text-[10px] text-primary font-bold bg-secondary-fixed/50 px-2 py-0.5 rounded-full">
                          <span className="material-symbols-outlined text-[12px]">qr_code</span>
                          <span>Digital QR Seal Attached</span>
                        </span>
                      )}
                    </div>
                    <div className="bg-surface-container-low p-3 rounded-xl shadow-inner flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-label-md text-[13px] text-primary font-bold">To: {recipientName || 'Your Recipient'}</p>
                        <p className="font-headline-sm text-[14px] italic text-on-surface-variant mt-1 leading-relaxed">
                          "{giftMessage || 'Warmest regards and celebrations!'}"
                        </p>
                        <p className="font-label-sm text-[11px] text-secondary text-right mt-1 font-semibold">
                          — {senderName || 'Sender'}
                        </p>
                      </div>

                      {hasDigitalQr && (
                        <div className="shrink-0 p-1.5 rounded-lg bg-white border border-secondary/40 shadow-sm text-center">
                          <QRCodeSVG
                            value={`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'}/greeting-card?to=${encodeURIComponent(recipientName || 'Recipient')}&from=${encodeURIComponent(senderName || 'Sender')}&msg=${encodeURIComponent(giftMessage || '')}&theme=${encodeURIComponent(occasionTheme || 'Royal')}`}
                            size={56}
                            level="M"
                            fgColor="#6E2334"
                            bgColor="#FFFFFF"
                          />
                          <span className="font-label-sm text-[8px] text-secondary font-bold block mt-0.5">SCAN</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: STICKY HAMPER SUMMARY DRAWER (Col 4) */}
          <aside className="lg:col-span-4 sticky top-[136px] space-y-space-md">
            <div className="rounded-3xl bg-surface p-space-md md:p-space-lg shadow-xl space-y-space-md">
              {/* Header */}
              <div className="flex items-center justify-between pb-space-xs">
                <div>
                  <span className="font-label-sm text-[10px] text-secondary uppercase tracking-widest font-bold">Your Custom Edit</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Bespoke Hamper</h3>
                </div>
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                </span>
              </div>

              {/* Capacity Bar & Indicator */}
              <div className="space-y-space-2xs p-3 rounded-2xl bg-surface-container-low">
                <div className="flex items-center justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface-variant font-semibold">Trunk Capacity</span>
                  <span className="text-primary font-bold">{totalItemsCount} of {maxCapacity} Items Packed ({capacityPercent}%)</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-500"
                    style={{ width: `${capacityPercent}%` }}
                  ></div>
                </div>
                <p className="font-body-sm text-[11px] text-on-surface-variant">
                  {maxCapacity - totalItemsCount > 0
                    ? `You can still pack up to ${maxCapacity - totalItemsCount} more items!`
                    : 'Hamper is filled to capacity!'}
                </p>
              </div>

              {/* Selected Box Choice */}
              {selectedBox && (
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-surface-container shadow-sm">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container-high shrink-0">
                      <img src={selectedBox.imageUrl} alt={selectedBox.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate">
                      <span className="font-label-sm text-[10px] text-secondary uppercase font-bold tracking-wider">Base Box</span>
                      <h4 className="font-label-md text-label-md text-on-surface font-bold truncate">{selectedBox.name}</h4>
                      <span className="font-body-sm text-[11px] text-on-surface-variant">{selectedBox.subtitle}</span>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md font-bold text-primary shrink-0">
                    {formatPrice(selectedBox.price)}
                  </span>
                </div>
              )}

              {/* Packed Items List */}
              <div className="space-y-space-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface font-bold">
                    Selected Items ({totalItemsCount})
                  </span>
                  <span className="font-label-sm text-[11px] text-secondary font-semibold">
                    Subtotal: {formatPrice(itemsSubtotal)}
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 no-scrollbar">
                  {packedItemsArray.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-surface-container-high overflow-hidden shrink-0">
                          <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="truncate">
                          <p className="font-label-md text-[13px] text-on-surface truncate">{item.product.name}</p>
                          <span className="font-body-sm text-[11px] text-on-surface-variant">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-label-sm text-label-sm text-primary font-bold">
                          {formatPrice(Number(item.product.price) * item.quantity)}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="text-outline hover:text-error transition-colors p-1"
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  {packedItemsArray.length === 0 && (
                    <p className="font-body-sm text-xs text-on-surface-variant italic py-3 text-center">
                      No items packed yet. Click "Add" on delicacies above!
                    </p>
                  )}
                </div>
              </div>

              {/* Add-ons & Inclusions */}
              <div className="p-3 rounded-2xl bg-surface-container-low space-y-2 text-[12px]">
                {hasPolaroid && (
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-secondary">photo_camera</span>
                      <span>Mini Polaroid Keepsake</span>
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface font-semibold">₹99</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-secondary">card_giftcard</span>
                    <span>{cardStyle.name}</span>
                  </span>
                  <span className="text-secondary font-label-sm text-[10px] font-bold uppercase tracking-wider">Free</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-secondary">loyalty</span>
                    <span>{ribbonColor.name} Ribbon</span>
                  </span>
                  <span className="text-secondary font-label-sm text-[10px] font-bold uppercase tracking-wider">Free</span>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-1.5 pt-2 font-body-sm text-body-sm">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Box &amp; Keepsake Trunk:</span>
                  <span>{formatPrice(boxPrice)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Selected Items ({totalItemsCount}):</span>
                  <span>{formatPrice(itemsSubtotal)}</span>
                </div>
                {hasPolaroid && (
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Personalization Add-on:</span>
                    <span>₹99</span>
                  </div>
                )}
                <div className="flex justify-between text-on-surface-variant">
                  <span>Express Delivery:</span>
                  <span className="text-secondary font-semibold">
                    {totalAmount >= 2999 ? 'FREE (Order > ₹2,999)' : '₹199'}
                  </span>
                </div>
                <div className="h-px bg-outline-variant/50 my-2"></div>
                <div className="flex justify-between items-baseline">
                  <span className="font-headline-sm text-[18px] font-bold text-on-surface">Total Amount:</span>
                  <div className="text-right">
                    <span className="font-headline-md text-headline-md font-bold text-primary">
                      {formatPrice(totalAmount)}
                    </span>
                    <span className="block font-label-sm text-[10px] text-on-surface-variant">Inclusive of all taxes</span>
                  </div>
                </div>
              </div>

              {/* Shipping ETA badge */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary-fixed/20 text-on-secondary-fixed font-label-sm text-[11px]">
                <span className="material-symbols-outlined text-[16px] text-secondary">timer</span>
                <span>Estimated delivery in <strong>2-3 business days</strong> with live tracking.</span>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-space-xs pt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={saving || totalItemsCount === 0}
                  className="w-full py-3.5 px-6 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-md hover:bg-primary-container disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>{saving ? 'Saving...' : 'Add Custom Hamper to Cart'}</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                    shopping_bag
                  </span>
                </button>

                <button
                  onClick={handleInstantCheckout}
                  disabled={saving || totalItemsCount === 0}
                  className="w-full py-2.5 px-6 rounded-full bg-surface text-primary border border-primary/30 hover:bg-surface-container font-label-md text-label-md font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  <span>Instant Checkout</span>
                </button>
              </div>

              {/* Guarantee micro-icons */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-center text-on-surface-variant text-[11px]">
                <div className="flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-secondary">verified_user</span>
                  <span>Damage-free Transit</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-secondary">edit_note</span>
                  <span>Calligraphy Proofing</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
