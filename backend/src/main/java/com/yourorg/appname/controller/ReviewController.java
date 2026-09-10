package com.yourorg.appname.controller;

import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.ReviewResponse;
import com.yourorg.appname.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getAllReviews(
            @RequestParam(required = false) Long hamperId) {
        List<ReviewResponse> reviews;
        if (hamperId != null) {
            reviews = reviewService.getReviewsByHamperId(hamperId);
        } else {
            reviews = reviewService.getAllReviews();
        }
        return ResponseEntity.ok(ApiResponse.ok(reviews));
    }
}
