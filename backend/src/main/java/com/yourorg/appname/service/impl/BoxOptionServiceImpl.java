package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.response.BoxOptionResponse;
import com.yourorg.appname.entity.BoxOption;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityMapper;
import com.yourorg.appname.repository.BoxOptionRepository;
import com.yourorg.appname.service.BoxOptionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BoxOptionServiceImpl implements BoxOptionService {

    private final BoxOptionRepository boxOptionRepository;
    private final EntityMapper mapper;

    public BoxOptionServiceImpl(BoxOptionRepository boxOptionRepository, EntityMapper mapper) {
        this.boxOptionRepository = boxOptionRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BoxOptionResponse> getAllBoxes() {
        return boxOptionRepository.findByIsActiveTrue().stream()
                .map(mapper::toBoxOptionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BoxOptionResponse getBoxById(Long id) {
        BoxOption box = boxOptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Box option not found with id: " + id));
        return mapper.toBoxOptionResponse(box);
    }
}
