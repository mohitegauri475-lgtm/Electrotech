package com.yourorg.appname.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CustomHamperResponse {
    private Long id;
    private Long userId;
    private BoxOptionResponse boxOption;
    private String ribbonColor;
    private String occasionTheme;
    private String cardStyle;
    private String recipientName;
    private String senderName;
    private String giftMessage;
    private String polaroidPhotoUrl;
    private Boolean hasPolaroid;
    private BigDecimal boxPrice;
    private BigDecimal itemsPrice;
    private BigDecimal addonsPrice;
    private BigDecimal totalPrice;
    private List<CustomHamperItemResponse> items = new ArrayList<>();
    private LocalDateTime createdAt;

    public CustomHamperResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public BoxOptionResponse getBoxOption() { return boxOption; }
    public void setBoxOption(BoxOptionResponse boxOption) { this.boxOption = boxOption; }

    public String getRibbonColor() { return ribbonColor; }
    public void setRibbonColor(String ribbonColor) { this.ribbonColor = ribbonColor; }

    public String getOccasionTheme() { return occasionTheme; }
    public void setOccasionTheme(String occasionTheme) { this.occasionTheme = occasionTheme; }

    public String getCardStyle() { return cardStyle; }
    public void setCardStyle(String cardStyle) { this.cardStyle = cardStyle; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getGiftMessage() { return giftMessage; }
    public void setGiftMessage(String giftMessage) { this.giftMessage = giftMessage; }

    public String getPolaroidPhotoUrl() { return polaroidPhotoUrl; }
    public void setPolaroidPhotoUrl(String polaroidPhotoUrl) { this.polaroidPhotoUrl = polaroidPhotoUrl; }

    public Boolean getHasPolaroid() { return hasPolaroid; }
    public void setHasPolaroid(Boolean hasPolaroid) { this.hasPolaroid = hasPolaroid; }

    public BigDecimal getBoxPrice() { return boxPrice; }
    public void setBoxPrice(BigDecimal boxPrice) { this.boxPrice = boxPrice; }

    public BigDecimal getItemsPrice() { return itemsPrice; }
    public void setItemsPrice(BigDecimal itemsPrice) { this.itemsPrice = itemsPrice; }

    public BigDecimal getAddonsPrice() { return addonsPrice; }
    public void setAddonsPrice(BigDecimal addonsPrice) { this.addonsPrice = addonsPrice; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public List<CustomHamperItemResponse> getItems() { return items; }
    public void setItems(List<CustomHamperItemResponse> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
