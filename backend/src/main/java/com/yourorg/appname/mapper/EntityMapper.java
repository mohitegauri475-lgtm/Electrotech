package com.yourorg.appname.mapper;

import com.yourorg.appname.dto.response.*;
import com.yourorg.appname.entity.*;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Component
public class EntityMapper {

    public UserResponse toUserResponse(User user) {
        if (user == null) return null;
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setPhone(user.getPhone());
        response.setAvatarUrl(user.getAvatarUrl());
        response.setAddress(user.getAddress());
        response.setCity(user.getCity());
        response.setState(user.getState());
        response.setPostalCode(user.getPostalCode());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }

    public BoxOptionResponse toBoxOptionResponse(BoxOption box) {
        if (box == null) return null;
        BoxOptionResponse response = new BoxOptionResponse();
        response.setId(box.getId());
        response.setName(box.getName());
        response.setSubtitle(box.getSubtitle());
        response.setDescription(box.getDescription());
        response.setPrice(box.getPrice());
        response.setCapacity(box.getCapacity());
        response.setImageUrl(box.getImageUrl());
        response.setIsBestseller(box.getIsBestseller());
        response.setIsActive(box.getIsActive());
        return response;
    }

    public ProductResponse toProductResponse(Product product) {
        if (product == null) return null;
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setCategory(product.getCategory());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setImageUrl(product.getImageUrl());
        response.setStockQuantity(product.getStockQuantity());
        response.setIsLuxury(product.getIsLuxury());
        response.setIsActive(product.getIsActive());
        response.setOccasion(product.getOccasion());
        return response;
    }

    public HamperResponse toHamperResponse(Hamper hamper) {
        if (hamper == null) return null;
        HamperResponse response = new HamperResponse();
        response.setId(hamper.getId());
        response.setTitle(hamper.getTitle());
        response.setSubtitle(hamper.getSubtitle());
        response.setDescription(hamper.getDescription());
        response.setOccasion(hamper.getOccasion());
        response.setCategory(hamper.getCategory());
        response.setPrice(hamper.getPrice());
        response.setOriginalPrice(hamper.getOriginalPrice());
        response.setRating(hamper.getRating());
        response.setReviewsCount(hamper.getReviewsCount());
        response.setImageUrl(hamper.getImageUrl());
        response.setBadge(hamper.getBadge());
        response.setIsActive(hamper.getIsActive());
        response.setIncludedProducts(hamper.getIncludedProducts());
        return response;
    }

    public CustomHamperItemResponse toCustomHamperItemResponse(CustomHamperItem item) {
        if (item == null) return null;
        CustomHamperItemResponse response = new CustomHamperItemResponse();
        response.setId(item.getId());
        response.setProduct(toProductResponse(item.getProduct()));
        response.setQuantity(item.getQuantity());
        response.setUnitPrice(item.getUnitPrice());
        response.setTotalPrice(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        return response;
    }

    public CustomHamperResponse toCustomHamperResponse(CustomHamper customHamper) {
        if (customHamper == null) return null;
        CustomHamperResponse response = new CustomHamperResponse();
        response.setId(customHamper.getId());
        response.setUserId(customHamper.getUser() != null ? customHamper.getUser().getId() : null);
        response.setBoxOption(toBoxOptionResponse(customHamper.getBoxOption()));
        response.setRibbonColor(customHamper.getRibbonColor());
        response.setOccasionTheme(customHamper.getOccasionTheme());
        response.setCardStyle(customHamper.getCardStyle());
        response.setRecipientName(customHamper.getRecipientName());
        response.setSenderName(customHamper.getSenderName());
        response.setGiftMessage(customHamper.getGiftMessage());
        response.setPolaroidPhotoUrl(customHamper.getPolaroidPhotoUrl());
        response.setHasPolaroid(customHamper.getHasPolaroid());
        response.setBoxPrice(customHamper.getBoxPrice());
        response.setItemsPrice(customHamper.getItemsPrice());
        response.setAddonsPrice(customHamper.getAddonsPrice());
        response.setTotalPrice(customHamper.getTotalPrice());
        response.setCreatedAt(customHamper.getCreatedAt());
        if (customHamper.getItems() != null) {
            response.setItems(customHamper.getItems().stream()
                    .map(this::toCustomHamperItemResponse)
                    .collect(Collectors.toList()));
        }
        return response;
    }

    public CartItemResponse toCartItemResponse(CartItem cartItem) {
        if (cartItem == null) return null;
        CartItemResponse response = new CartItemResponse();
        response.setId(cartItem.getId());
        response.setQuantity(cartItem.getQuantity());

        if (cartItem.getHamper() != null) {
            response.setItemType("READY_MADE");
            response.setHamper(toHamperResponse(cartItem.getHamper()));
            response.setTitle(cartItem.getHamper().getTitle());
            response.setSubtitle(cartItem.getHamper().getSubtitle());
            response.setImageUrl(cartItem.getHamper().getImageUrl());
            response.setUnitPrice(cartItem.getHamper().getPrice());
            response.setTotalPrice(cartItem.getHamper().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        } else if (cartItem.getCustomHamper() != null) {
            response.setItemType("CUSTOM_BESPOKE");
            response.setCustomHamper(toCustomHamperResponse(cartItem.getCustomHamper()));
            response.setTitle("Bespoke Hamper: " + cartItem.getCustomHamper().getBoxOption().getName());
            response.setSubtitle(cartItem.getCustomHamper().getRibbonColor() + " Ribbon • " + cartItem.getCustomHamper().getCardStyle());
            response.setImageUrl(cartItem.getCustomHamper().getBoxOption().getImageUrl());
            response.setUnitPrice(cartItem.getCustomHamper().getTotalPrice());
            response.setTotalPrice(cartItem.getCustomHamper().getTotalPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        return response;
    }

    public OrderItemResponse toOrderItemResponse(OrderItem item) {
        if (item == null) return null;
        OrderItemResponse response = new OrderItemResponse();
        response.setId(item.getId());
        response.setItemType(item.getItemType());
        response.setHamperId(item.getHamper() != null ? item.getHamper().getId() : null);
        response.setCustomHamperId(item.getCustomHamper() != null ? item.getCustomHamper().getId() : null);
        response.setItemTitle(item.getItemTitle());
        response.setQuantity(item.getQuantity());
        response.setUnitPrice(item.getUnitPrice());
        response.setTotalPrice(item.getTotalPrice());
        return response;
    }

    public OrderResponse toOrderResponse(Order order) {
        if (order == null) return null;
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setUserId(order.getUser() != null ? order.getUser().getId() : null);
        response.setRecipientName(order.getRecipientName());
        response.setShippingAddress(order.getShippingAddress());
        response.setCity(order.getCity());
        response.setState(order.getState());
        response.setPostalCode(order.getPostalCode());
        response.setPhone(order.getPhone());
        response.setOrderStatus(order.getOrderStatus());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setPaymentStatus(order.getPaymentStatus());
        response.setSubtotal(order.getSubtotal());
        response.setShippingFee(order.getShippingFee());
        response.setAddonsTotal(order.getAddonsTotal());
        response.setTotalAmount(order.getTotalAmount());
        response.setTrackingNumber(order.getTrackingNumber());
        response.setCreatedAt(order.getCreatedAt());
        if (order.getItems() != null) {
            response.setItems(order.getItems().stream()
                    .map(this::toOrderItemResponse)
                    .collect(Collectors.toList()));
        }
        return response;
    }

    public ReviewResponse toReviewResponse(Review review) {
        if (review == null) return null;
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setHamperId(review.getHamper() != null ? review.getHamper().getId() : null);
        response.setAuthorName(review.getAuthorName());
        response.setRating(review.getRating());
        response.setTitle(review.getTitle());
        response.setContent(review.getContent());
        response.setLocation(review.getLocation());
        response.setVerifiedBuyer(review.getVerifiedBuyer());
        response.setCreatedAt(review.getCreatedAt());
        return response;
    }
}
