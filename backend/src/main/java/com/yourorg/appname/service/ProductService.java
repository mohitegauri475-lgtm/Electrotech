package com.yourorg.appname.service;

import com.yourorg.appname.dto.response.ProductResponse;

import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllProducts(String category);
    List<ProductResponse> getAllProducts(String category, String occasion);
    ProductResponse getProductById(Long id);
}
