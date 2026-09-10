package com.yourorg.appname.dto.response;

import java.time.LocalDateTime;

public class ReviewResponse {
    private Long id;
    private Long hamperId;
    private String authorName;
    private Integer rating;
    private String title;
    private String content;
    private String location;
    private Boolean verifiedBuyer;
    private LocalDateTime createdAt;

    public ReviewResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getHamperId() { return hamperId; }
    public void setHamperId(Long hamperId) { this.hamperId = hamperId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Boolean getVerifiedBuyer() { return verifiedBuyer; }
    public void setVerifiedBuyer(Boolean verifiedBuyer) { this.verifiedBuyer = verifiedBuyer; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
