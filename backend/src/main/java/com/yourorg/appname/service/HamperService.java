package com.yourorg.appname.service;

import com.yourorg.appname.dto.response.HamperResponse;

import java.util.List;

public interface HamperService {
    List<HamperResponse> getAllHampers(String occasion, String category);
    HamperResponse getHamperById(Long id);
}
