package com.cricketdb.controller;

import com.cricketdb.dto.AnalyticsResponse;
import com.cricketdb.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics", description = "Cricket analytics and statistics")
public class AnalyticsController {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @GetMapping("/summary")
    @Operation(summary = "Get analytics summary", description = "Retrieve comprehensive analytics summary")
    public ResponseEntity<AnalyticsResponse> getAnalyticsSummary() {
        AnalyticsResponse analytics = analyticsService.getAnalytics();
        return ResponseEntity.ok(analytics);
    }
}
