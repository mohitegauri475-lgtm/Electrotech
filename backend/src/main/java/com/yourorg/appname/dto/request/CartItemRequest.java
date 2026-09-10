package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CartItemRequest {

    private Long hamperId;
    private Long customHamperId;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be greater than 0")
    private Integer quantity = 1;

    public CartItemRequest() {}

    public Long getHamperId() { return hamperId; }
    public void setHamperId(Long hamperId) { this.hamperId = hamperId; }

    public Long getCustomHamperId() { return customHamperId; }
    public void setCustomHamperId(Long customHamperId) { this.customHamperId = customHamperId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
