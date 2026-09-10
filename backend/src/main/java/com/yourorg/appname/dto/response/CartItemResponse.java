package com.yourorg.appname.dto.response;

import java.math.BigDecimal;

public class CartItemResponse {
    private Long id;
    private String itemType; // 'READY_MADE' or 'CUSTOM_BESPOKE'
    private HamperResponse hamper;
    private CustomHamperResponse customHamper;
    private String title;
    private String subtitle;
    private String imageUrl;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;

    public CartItemResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getItemType() { return itemType; }
    public void setItemType(String itemType) { this.itemType = itemType; }

    public HamperResponse getHamper() { return hamper; }
    public void setHamper(HamperResponse hamper) { this.hamper = hamper; }

    public CustomHamperResponse getCustomHamper() { return customHamper; }
    public void setCustomHamper(CustomHamperResponse customHamper) { this.customHamper = customHamper; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
}
