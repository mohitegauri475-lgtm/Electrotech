package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.response.HamperResponse;
import com.yourorg.appname.entity.Hamper;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityMapper;
import com.yourorg.appname.repository.HamperRepository;
import com.yourorg.appname.service.HamperService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HamperServiceImpl implements HamperService {

    private final HamperRepository hamperRepository;
    private final EntityMapper mapper;

    public HamperServiceImpl(HamperRepository hamperRepository, EntityMapper mapper) {
        this.hamperRepository = hamperRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<HamperResponse> getAllHampers(String occasion, String category) {
        List<Hamper> hampers;
        if (occasion != null && !occasion.trim().isEmpty() && !occasion.equalsIgnoreCase("all")) {
            hampers = hamperRepository.findByOccasionAndIsActiveTrue(occasion.toLowerCase());
        } else if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("all")) {
            hampers = hamperRepository.findByCategoryAndIsActiveTrue(category);
        } else {
            hampers = hamperRepository.findByIsActiveTrue();
        }
        return hampers.stream().map(mapper::toHamperResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public HamperResponse getHamperById(Long id) {
        Hamper hamper = hamperRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hamper not found with id: " + id));
        return mapper.toHamperResponse(hamper);
    }
}
