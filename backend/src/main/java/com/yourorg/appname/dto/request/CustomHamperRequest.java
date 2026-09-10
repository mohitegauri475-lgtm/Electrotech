package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class CustomHamperRequest {

    @NotNull(message = "Box option ID is required")
    private Long boxOptionId;

    @NotBlank(message = "Ribbon color is required")
    private String ribbonColor;

    @NotBlank(message = "Occasion theme is required")
    private String occasionTheme;

    @NotBlank(message = "Card style is required")
    private String cardStyle;

    private String recipientName;
    private String senderName;
    private String giftMessage;
    private String polaroidPhotoUrl;
    private Boolean hasPolaroid = false;

    private List<CustomHamperItemRequest> items = new ArrayList<>();

    public CustomHamperRequest() {}

    public Long getBoxOptionId() { return boxOptionId; }
    public void setBoxOptionId(Long boxOptionId) { this.boxOptionId = boxOptionId; }

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

    public List<CustomHamperItemRequest> getItems() { return items; }
    public void setItems(List<CustomHamperItemRequest> items) { this.items = items; }
}
