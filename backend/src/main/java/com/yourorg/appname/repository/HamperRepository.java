package com.yourorg.appname.repository;

import com.yourorg.appname.entity.Hamper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HamperRepository extends JpaRepository<Hamper, Long> {
    List<Hamper> findByIsActiveTrue();
    List<Hamper> findByOccasionAndIsActiveTrue(String occasion);
    List<Hamper> findByCategoryAndIsActiveTrue(String category);
}
