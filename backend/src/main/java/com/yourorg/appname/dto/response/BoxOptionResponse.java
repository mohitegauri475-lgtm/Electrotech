package com.yourorg.appname.dto.response;

import java.math.BigDecimal;

public class BoxOptionResponse {
    private Long id;
    private String name;
    private String subtitle;
    private String description;
    private BigDecimal price;
    private Integer capacity;
    private String imageUrl;
    private Boolean isBestseller;
    private Boolean isActive;

    public BoxOptionResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsBestseller() { return isBestseller; }
    public void setIsBestseller(Boolean bestseller) { isBestseller = bestseller; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }
}
