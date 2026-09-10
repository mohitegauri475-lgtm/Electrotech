package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.response.ReviewResponse;
import com.yourorg.appname.mapper.EntityMapper;
import com.yourorg.appname.repository.ReviewRepository;
import com.yourorg.appname.service.ReviewService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final EntityMapper mapper;

    public ReviewServiceImpl(ReviewRepository reviewRepository, EntityMapper mapper) {
        this.reviewRepository = reviewRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findByOrderByCreatedAtDesc().stream()
                .map(mapper::toReviewResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByHamperId(Long hamperId) {
        return reviewRepository.findByHamperId(hamperId).stream()
                .map(mapper::toReviewResponse)
                .collect(Collectors.toList());
    }
}
