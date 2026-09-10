package com.yourorg.appname.repository;

import com.yourorg.appname.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);
    Optional<CartItem> findByUserIdAndHamperId(Long userId, Long hamperId);
    void deleteByUserId(Long userId);
}
