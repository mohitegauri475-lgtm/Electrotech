package com.yourorg.appname.service;

import com.yourorg.appname.dto.response.BoxOptionResponse;

import java.util.List;

public interface BoxOptionService {
    List<BoxOptionResponse> getAllBoxes();
    BoxOptionResponse getBoxById(Long id);
}
