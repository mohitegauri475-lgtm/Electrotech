package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.response.ProductResponse;
import com.yourorg.appname.entity.Product;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityMapper;
import com.yourorg.appname.repository.ProductRepository;
import com.yourorg.appname.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final EntityMapper mapper;

    public ProductServiceImpl(ProductRepository productRepository, EntityMapper mapper) {
        this.productRepository = productRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts(String category) {
        return getAllProducts(category, null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts(String category, String occasion) {
        List<Product> products;
        boolean hasCategory = category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("all");
        boolean hasOccasion = occasion != null && !occasion.trim().isEmpty() && !occasion.equalsIgnoreCase("all");

        if (hasCategory && hasOccasion) {
            products = productRepository.findByCategoryAndOccasionContainingIgnoreCaseAndIsActiveTrue(category.trim(), occasion.trim());
        } else if (hasCategory) {
            products = productRepository.findByCategoryAndIsActiveTrue(category.trim());
        } else if (hasOccasion) {
            products = productRepository.findByOccasionContainingIgnoreCaseAndIsActiveTrue(occasion.trim());
        } else {
            products = productRepository.findByIsActiveTrue();
        }
        return products.stream().map(mapper::toProductResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapper.toProductResponse(product);
    }
}
