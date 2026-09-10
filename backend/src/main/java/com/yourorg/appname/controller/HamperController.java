package com.yourorg.appname.controller;

import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.HamperResponse;
import com.yourorg.appname.service.HamperService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hampers")
public class HamperController {

    private final HamperService hamperService;

    public HamperController(HamperService hamperService) {
        this.hamperService = hamperService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HamperResponse>>> getAllHampers(
            @RequestParam(required = false) String occasion,
            @RequestParam(required = false) String category) {
        List<HamperResponse> hampers = hamperService.getAllHampers(occasion, category);
        return ResponseEntity.ok(ApiResponse.ok(hampers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HamperResponse>> getHamperById(@PathVariable Long id) {
        HamperResponse hamper = hamperService.getHamperById(id);
        return ResponseEntity.ok(ApiResponse.ok(hamper));
    }
}
