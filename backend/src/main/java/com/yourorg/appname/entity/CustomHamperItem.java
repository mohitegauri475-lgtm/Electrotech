package com.yourorg.appname.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "custom_hamper_items")
public class CustomHamperItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "custom_hamper_id", nullable = false)
    private CustomHamper customHamper;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    public CustomHamperItem() {}

    public CustomHamperItem(CustomHamper customHamper, Product product, Integer quantity, BigDecimal unitPrice) {
        this.customHamper = customHamper;
        this.product = product;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CustomHamper getCustomHamper() { return customHamper; }
    public void setCustomHamper(CustomHamper customHamper) { this.customHamper = customHamper; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
}
