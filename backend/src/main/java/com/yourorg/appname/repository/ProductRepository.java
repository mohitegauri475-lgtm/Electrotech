package com.yourorg.appname.repository;

import com.yourorg.appname.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByIsActiveTrue();
    List<Product> findByCategoryAndIsActiveTrue(String category);
    List<Product> findByOccasionContainingIgnoreCaseAndIsActiveTrue(String occasion);
    List<Product> findByCategoryAndOccasionContainingIgnoreCaseAndIsActiveTrue(String category, String occasion);
}
