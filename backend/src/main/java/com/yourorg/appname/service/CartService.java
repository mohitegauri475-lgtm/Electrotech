package com.yourorg.appname.service;

import com.yourorg.appname.dto.request.CartItemRequest;
import com.yourorg.appname.dto.response.CartItemResponse;
import com.yourorg.appname.dto.response.CartSummaryResponse;

public interface CartService {
    CartSummaryResponse getCart(String username);
    CartItemResponse addToCart(CartItemRequest request, String username);
    CartItemResponse updateQuantity(Long cartItemId, Integer quantity, String username);
    void removeFromCart(Long cartItemId, String username);
    void clearCart(String username);
}
