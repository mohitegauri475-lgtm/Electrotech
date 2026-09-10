package com.yourorg.appname.dto.response;

import java.math.BigDecimal;

public class CustomHamperItemResponse {
    private Long id;
    private ProductResponse product;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;

    public CustomHamperItemResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProductResponse getProduct() { return product; }
    public void setProduct(ProductResponse product) { this.product = product; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
}
