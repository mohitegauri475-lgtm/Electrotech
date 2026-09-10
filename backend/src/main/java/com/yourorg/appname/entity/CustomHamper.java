package com.yourorg.appname.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "custom_hampers")
public class CustomHamper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "box_option_id", nullable = false)
    private BoxOption boxOption;

    @Column(name = "ribbon_color", nullable = false, length = 50)
    private String ribbonColor;

    @Column(name = "occasion_theme", nullable = false, length = 50)
    private String occasionTheme;

    @Column(name = "card_style", nullable = false, length = 100)
    private String cardStyle;

    @Column(name = "recipient_name", length = 100)
    private String recipientName;

    @Column(name = "sender_name", length = 100)
    private String senderName;

    @Column(name = "gift_message", length = 1000)
    private String giftMessage;

    @Column(name = "polaroid_photo_url", length = 1000)
    private String polaroidPhotoUrl;

    @Column(name = "has_polaroid", nullable = false)
    private Boolean hasPolaroid = false;

    @Column(name = "box_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal boxPrice;

    @Column(name = "items_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal itemsPrice = BigDecimal.ZERO;

    @Column(name = "addons_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal addonsPrice = BigDecimal.ZERO;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @OneToMany(mappedBy = "customHamper", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<CustomHamperItem> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public CustomHamper() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public BoxOption getBoxOption() { return boxOption; }
    public void setBoxOption(BoxOption boxOption) { this.boxOption = boxOption; }

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

    public List<CustomHamperItem> getItems() { return items; }
    public void setItems(List<CustomHamperItem> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
