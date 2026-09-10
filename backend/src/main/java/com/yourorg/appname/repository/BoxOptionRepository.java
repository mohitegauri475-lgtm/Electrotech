package com.yourorg.appname.repository;

import com.yourorg.appname.entity.BoxOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoxOptionRepository extends JpaRepository<BoxOption, Long> {
    List<BoxOption> findByIsActiveTrue();
}
