import React, { createContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from '../hooks/useAuth';

export const CartContext = createContext(null);

const GUEST_CART_KEY = 'giftedit_guest_cart';

const getStoredGuestCart = () => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const calculateCartSummary = (items) => {
  const totalItems = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const subtotal = items.reduce((acc, item) => {
    const unitPrice = item.unitPrice || item.hamper?.price || item.customHamper?.totalPrice || 0;
    return acc + Number(unitPrice) * (item.quantity || 1);
  }, 0);
  const qualifiesForFreeShipping = subtotal >= 2000;
  const shippingFee = subtotal > 0 && !qualifiesForFreeShipping ? 199 : 0;
  const totalAmount = subtotal + shippingFee;

  return {
    items,
    totalItems,
    subtotal,
    shippingFee,
    totalAmount,
    qualifiesForFreeShipping,
  };
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(() => calculateCartSummary(getStoredGuestCart()));
  const [loading, setLoading] = useState(false);

  // Sync guest cart to backend upon authentication
  const syncGuestCartToServer = useCallback(async () => {
    const guestItems = getStoredGuestCart();
    if (guestItems.length > 0) {
      try {
        for (const item of guestItems) {
          if (item.hamper?.id || item.hamperId) {
            await cartService.addToCart({
              hamperId: item.hamper?.id || item.hamperId,
              quantity: item.quantity || 1,
            });
          } else if (item.customHamper?.id || item.customHamperId) {
            await cartService.addToCart({
              customHamperId: item.customHamper?.id || item.customHamperId,
              quantity: item.quantity || 1,
            });
          }
        }
        localStorage.removeItem(GUEST_CART_KEY);
      } catch (err) {
        console.warn('Guest cart sync warning:', err);
      }
    }
  }, []);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      const guestItems = getStoredGuestCart();
      setCart(calculateCartSummary(guestItems));
      return;
    }

    try {
      setLoading(true);
      await syncGuestCartToServer();
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, syncGuestCartToServer]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (itemData) => {
    if (isAuthenticated) {
      await cartService.addToCart(itemData);
      await fetchCart();
      return;
    }

    // Guest Cart Operation
    const currentItems = getStoredGuestCart();
    const hamperId = itemData.hamperId || itemData.hamper?.id;
    const customHamperId = itemData.customHamperId || itemData.customHamper?.id;
    const qty = itemData.quantity || 1;

    let updatedItems = [...currentItems];
    const existingIndex = updatedItems.findIndex((i) => {
      if (hamperId && (i.hamperId === hamperId || i.hamper?.id === hamperId)) return true;
      if (customHamperId && (i.customHamperId === customHamperId || i.customHamper?.id === customHamperId)) return true;
      return false;
    });

    if (existingIndex >= 0) {
      updatedItems[existingIndex].quantity = (updatedItems[existingIndex].quantity || 1) + qty;
      updatedItems[existingIndex].totalPrice =
        updatedItems[existingIndex].quantity * (updatedItems[existingIndex].unitPrice || 0);
    } else {
      const newItem = {
        id: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        hamperId,
        customHamperId,
        hamper: itemData.hamper || (hamperId ? { id: hamperId, ...itemData } : null),
        customHamper: itemData.customHamper || (customHamperId ? { id: customHamperId, ...itemData } : null),
        quantity: qty,
        unitPrice: itemData.unitPrice || itemData.hamper?.price || itemData.price || 0,
        totalPrice: (itemData.unitPrice || itemData.hamper?.price || itemData.price || 0) * qty,
      };
      updatedItems.push(newItem);
    }

    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedItems));
    setCart(calculateCartSummary(updatedItems));
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (isAuthenticated) {
      await cartService.updateQuantity(cartItemId, quantity);
      await fetchCart();
      return;
    }

    let updatedItems = getStoredGuestCart();
    if (quantity <= 0) {
      updatedItems = updatedItems.filter((i) => i.id !== cartItemId);
    } else {
      updatedItems = updatedItems.map((i) => {
        if (i.id === cartItemId) {
          const newQty = quantity;
          return {
            ...i,
            quantity: newQty,
            totalPrice: newQty * (i.unitPrice || 0),
          };
        }
        return i;
      });
    }

    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedItems));
    setCart(calculateCartSummary(updatedItems));
  };

  const removeFromCart = async (cartItemId) => {
    if (isAuthenticated) {
      await cartService.removeFromCart(cartItemId);
      await fetchCart();
      return;
    }

    const updatedItems = getStoredGuestCart().filter((i) => i.id !== cartItemId);
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedItems));
    setCart(calculateCartSummary(updatedItems));
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      await cartService.clearCart();
      await fetchCart();
      return;
    }

    localStorage.removeItem(GUEST_CART_KEY);
    setCart(calculateCartSummary([]));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount: cart.totalItems || 0,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
