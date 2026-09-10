package com.yourorg.appname.dto.response;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class CartSummaryResponse {
    private List<CartItemResponse> items = new ArrayList<>();
    private Integer totalItems = 0;
    private BigDecimal subtotal = BigDecimal.ZERO;
    private BigDecimal shippingFee = BigDecimal.ZERO;
    private BigDecimal totalAmount = BigDecimal.ZERO;
    private Boolean qualifiesForFreeShipping = false;

    public CartSummaryResponse() {}

    public List<CartItemResponse> getItems() { return items; }
    public void setItems(List<CartItemResponse> items) { this.items = items; }

    public Integer getTotalItems() { return totalItems; }
    public void setTotalItems(Integer totalItems) { this.totalItems = totalItems; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getShippingFee() { return shippingFee; }
    public void setShippingFee(BigDecimal shippingFee) { this.shippingFee = shippingFee; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public Boolean getQualifiesForFreeShipping() { return qualifiesForFreeShipping; }
    public void setQualifiesForFreeShipping(Boolean qualifiesForFreeShipping) { this.qualifiesForFreeShipping = qualifiesForFreeShipping; }
}
