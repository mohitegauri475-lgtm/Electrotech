package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.CartItemRequest;
import com.yourorg.appname.dto.response.CartItemResponse;
import com.yourorg.appname.dto.response.CartSummaryResponse;
import com.yourorg.appname.entity.CartItem;
import com.yourorg.appname.entity.CustomHamper;
import com.yourorg.appname.entity.Hamper;
import com.yourorg.appname.entity.User;
import com.yourorg.appname.exception.BadRequestException;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.exception.UnauthorizedException;
import com.yourorg.appname.mapper.EntityMapper;
import com.yourorg.appname.repository.CartItemRepository;
import com.yourorg.appname.repository.CustomHamperRepository;
import com.yourorg.appname.repository.HamperRepository;
import com.yourorg.appname.repository.UserRepository;
import com.yourorg.appname.service.CartService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final HamperRepository hamperRepository;
    private final CustomHamperRepository customHamperRepository;
    private final EntityMapper mapper;

    public CartServiceImpl(CartItemRepository cartItemRepository,
                           UserRepository userRepository,
                           HamperRepository hamperRepository,
                           CustomHamperRepository customHamperRepository,
                           EntityMapper mapper) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.hamperRepository = hamperRepository;
        this.customHamperRepository = customHamperRepository;
        this.mapper = mapper;
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }

    @Override
    @Transactional(readOnly = true)
    public CartSummaryResponse getCart(String username) {
        User user = getUser(username);
        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());

        List<CartItemResponse> itemResponses = cartItems.stream()
                .map(mapper::toCartItemResponse)
                .collect(Collectors.toList());

        BigDecimal subtotal = BigDecimal.ZERO;
        int totalCount = 0;

        for (CartItemResponse item : itemResponses) {
            subtotal = subtotal.add(item.getTotalPrice());
            totalCount += item.getQuantity();
        }

        boolean freeShipping = subtotal.compareTo(new BigDecimal("2999.00")) >= 0;
        BigDecimal shippingFee = (freeShipping || subtotal.compareTo(BigDecimal.ZERO) == 0) ? BigDecimal.ZERO : new BigDecimal("199.00");
        BigDecimal totalAmount = subtotal.add(shippingFee);

        CartSummaryResponse summary = new CartSummaryResponse();
        summary.setItems(itemResponses);
        summary.setTotalItems(totalCount);
        summary.setSubtotal(subtotal);
        summary.setShippingFee(shippingFee);
        summary.setTotalAmount(totalAmount);
        summary.setQualifiesForFreeShipping(freeShipping);

        return summary;
    }

    @Override
    @Transactional
    public CartItemResponse addToCart(CartItemRequest request, String username) {
        User user = getUser(username);

        if (request.getHamperId() == null && request.getCustomHamperId() == null) {
            throw new BadRequestException("Either hamperId or customHamperId must be provided");
        }

        CartItem cartItem;

        if (request.getHamperId() != null) {
            Hamper hamper = hamperRepository.findById(request.getHamperId())
                    .orElseThrow(() -> new ResourceNotFoundException("Hamper not found with id: " + request.getHamperId()));

            Optional<CartItem> existing = cartItemRepository.findByUserIdAndHamperId(user.getId(), hamper.getId());
            if (existing.isPresent()) {
                cartItem = existing.get();
                cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
            } else {
                cartItem = new CartItem();
                cartItem.setUser(user);
                cartItem.setHamper(hamper);
                cartItem.setQuantity(request.getQuantity());
            }
        } else {
            CustomHamper customHamper = customHamperRepository.findById(request.getCustomHamperId())
                    .orElseThrow(() -> new ResourceNotFoundException("Custom hamper not found with id: " + request.getCustomHamperId()));

            cartItem = new CartItem();
            cartItem.setUser(user);
            cartItem.setCustomHamper(customHamper);
            cartItem.setQuantity(request.getQuantity());
        }

        CartItem saved = cartItemRepository.save(cartItem);
        return mapper.toCartItemResponse(saved);
    }

    @Override
    @Transactional
    public CartItemResponse updateQuantity(Long cartItemId, Integer quantity, String username) {
        User user = getUser(username);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Cannot update another user's cart item");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return null;
        }

        cartItem.setQuantity(quantity);
        CartItem saved = cartItemRepository.save(cartItem);
        return mapper.toCartItemResponse(saved);
    }

    @Override
    @Transactional
    public void removeFromCart(Long cartItemId, String username) {
        User user = getUser(username);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Cannot remove another user's cart item");
        }

        cartItemRepository.delete(cartItem);
    }

    @Override
    @Transactional
    public void clearCart(String username) {
        User user = getUser(username);
        cartItemRepository.deleteByUserId(user.getId());
    }
}
