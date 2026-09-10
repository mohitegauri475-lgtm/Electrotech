package com.yourorg.appname.service;

import com.yourorg.appname.dto.response.ReviewResponse;

import java.util.List;

public interface ReviewService {
    List<ReviewResponse> getAllReviews();
    List<ReviewResponse> getReviewsByHamperId(Long hamperId);
}
