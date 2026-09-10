package com.yourorg.appname.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "item_type", nullable = false, length = 30)
    private String itemType; // 'READY_MADE' or 'CUSTOM_BESPOKE'

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hamper_id")
    private Hamper hamper;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "custom_hamper_id")
    private CustomHamper customHamper;

    @Column(name = "item_title", nullable = false, length = 200)
    private String itemTitle;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    public OrderItem() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public String getItemType() { return itemType; }
    public void setItemType(String itemType) { this.itemType = itemType; }

    public Hamper getHamper() { return hamper; }
    public void setHamper(Hamper hamper) { this.hamper = hamper; }

    public CustomHamper getCustomHamper() { return customHamper; }
    public void setCustomHamper(CustomHamper customHamper) { this.customHamper = customHamper; }

    public String getItemTitle() { return itemTitle; }
    public void setItemTitle(String itemTitle) { this.itemTitle = itemTitle; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
}
