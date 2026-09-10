package com.yourorg.appname.dto.response;

import java.math.BigDecimal;

public class ProductResponse {
    private Long id;
    private String name;
    private String category;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private Integer stockQuantity;
    private Boolean isLuxury;
    private Boolean isActive;
    private String occasion;

    public ProductResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public Boolean getIsLuxury() { return isLuxury; }
    public void setIsLuxury(Boolean luxury) { isLuxury = luxury; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }

    public String getOccasion() { return occasion; }
    public void setOccasion(String occasion) { this.occasion = occasion; }
}
