package com.yourorg.appname.controller;

import com.yourorg.appname.dto.request.CustomHamperRequest;
import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.CustomHamperResponse;
import com.yourorg.appname.service.CustomHamperService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/custom-hampers")
public class CustomHamperController {

    private final CustomHamperService customHamperService;

    public CustomHamperController(CustomHamperService customHamperService) {
        this.customHamperService = customHamperService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CustomHamperResponse>> createCustomHamper(
            @Valid @RequestBody CustomHamperRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : null;
        CustomHamperResponse response = customHamperService.createCustomHamper(request, username);
        return ResponseEntity.ok(ApiResponse.ok("Custom hamper saved successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomHamperResponse>> getCustomHamperById(@PathVariable Long id) {
        CustomHamperResponse response = customHamperService.getCustomHamperById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<CustomHamperResponse>>> getMyCustomHampers(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Authentication required"));
        }
        List<CustomHamperResponse> list = customHamperService.getUserCustomHampers(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(list));
    }
}
