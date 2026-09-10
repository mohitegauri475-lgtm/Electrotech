package com.yourorg.appname.dto.response;

import java.math.BigDecimal;

public class OrderItemResponse {
    private Long id;
    private String itemType;
    private Long hamperId;
    private Long customHamperId;
    private String itemTitle;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;

    public OrderItemResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getItemType() { return itemType; }
    public void setItemType(String itemType) { this.itemType = itemType; }

    public Long getHamperId() { return hamperId; }
    public void setHamperId(Long hamperId) { this.hamperId = hamperId; }

    public Long getCustomHamperId() { return customHamperId; }
    public void setCustomHamperId(Long customHamperId) { this.customHamperId = customHamperId; }

    public String getItemTitle() { return itemTitle; }
    public void setItemTitle(String itemTitle) { this.itemTitle = itemTitle; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
}
