package com.yourorg.appname.repository;

import com.yourorg.appname.entity.CustomHamper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomHamperRepository extends JpaRepository<CustomHamper, Long> {
    List<CustomHamper> findByUserId(Long userId);
}
