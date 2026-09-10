package com.yourorg.appname.controller;

import com.yourorg.appname.dto.request.CartItemRequest;
import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.CartItemResponse;
import com.yourorg.appname.dto.response.CartSummaryResponse;
import com.yourorg.appname.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartSummaryResponse>> getCart(
            @AuthenticationPrincipal UserDetails userDetails) {
        CartSummaryResponse cart = cartService.getCart(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(cart));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CartItemResponse>> addToCart(
            @Valid @RequestBody CartItemRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        CartItemResponse item = cartService.addToCart(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Item added to cart", item));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CartItemResponse>> updateQuantity(
            @PathVariable Long id,
            @RequestParam Integer quantity,
            @AuthenticationPrincipal UserDetails userDetails) {
        CartItemResponse item = cartService.updateQuantity(id, quantity, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Cart updated", item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> removeFromCart(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        cartService.removeFromCart(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Item removed from cart", null));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart(
            @AuthenticationPrincipal UserDetails userDetails) {
        cartService.clearCart(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Cart cleared", null));
    }
}
