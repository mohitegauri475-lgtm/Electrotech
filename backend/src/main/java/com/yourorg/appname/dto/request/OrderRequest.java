package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotBlank;

public class OrderRequest {

    @NotBlank(message = "Recipient name is required")
    private String recipientName;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Postal code is required")
    private String postalCode;

    @NotBlank(message = "Phone number is required")
    private String phone;

    private String paymentMethod = "ONLINE";

    // Optional direct buy parameters (e.g. from Customizer Instant Checkout)
    private Long directCustomHamperId;
    private Long directHamperId;
    private Integer directQuantity = 1;

    public OrderRequest() {}

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public Long getDirectCustomHamperId() { return directCustomHamperId; }
    public void setDirectCustomHamperId(Long directCustomHamperId) { this.directCustomHamperId = directCustomHamperId; }

    public Long getDirectHamperId() { return directHamperId; }
    public void setDirectHamperId(Long directHamperId) { this.directHamperId = directHamperId; }

    public Integer getDirectQuantity() { return directQuantity; }
    public void setDirectQuantity(Integer directQuantity) { this.directQuantity = directQuantity; }
}
