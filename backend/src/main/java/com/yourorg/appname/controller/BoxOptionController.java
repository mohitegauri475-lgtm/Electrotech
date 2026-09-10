package com.yourorg.appname.controller;

import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.BoxOptionResponse;
import com.yourorg.appname.service.BoxOptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boxes")
public class BoxOptionController {

    private final BoxOptionService boxOptionService;

    public BoxOptionController(BoxOptionService boxOptionService) {
        this.boxOptionService = boxOptionService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BoxOptionResponse>>> getAllBoxes() {
        List<BoxOptionResponse> boxes = boxOptionService.getAllBoxes();
        return ResponseEntity.ok(ApiResponse.ok(boxes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BoxOptionResponse>> getBoxById(@PathVariable Long id) {
        BoxOptionResponse box = boxOptionService.getBoxById(id);
        return ResponseEntity.ok(ApiResponse.ok(box));
    }
}
