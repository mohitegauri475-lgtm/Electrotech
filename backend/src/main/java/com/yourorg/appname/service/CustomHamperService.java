package com.yourorg.appname.service;

import com.yourorg.appname.dto.request.CustomHamperRequest;
import com.yourorg.appname.dto.response.CustomHamperResponse;

import java.util.List;

public interface CustomHamperService {
    CustomHamperResponse createCustomHamper(CustomHamperRequest request, String username);
    CustomHamperResponse getCustomHamperById(Long id);
    List<CustomHamperResponse> getUserCustomHampers(String username);
}
