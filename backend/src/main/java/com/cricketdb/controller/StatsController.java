package com.cricketdb.controller;

import com.cricketdb.dto.BattingStatsRequest;
import com.cricketdb.dto.BowlingStatsRequest;
import com.cricketdb.model.BattingStats;
import com.cricketdb.model.BowlingStats;
import com.cricketdb.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
@Tag(name = "Statistics Management", description = "Player statistics operations")
public class StatsController {
    
    @Autowired
    private StatsService statsService;
    
    @PostMapping("/batting")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DATA_ENTRY')")
    @Operation(summary = "Add batting stats", description = "Add batting statistics for a player")
    public ResponseEntity<BattingStats> addBattingStats(@Valid @RequestBody BattingStatsRequest request) {
        BattingStats battingStats = statsService.addBattingStats(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(battingStats);
    }
    
    @PostMapping("/bowling")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DATA_ENTRY')")
    @Operation(summary = "Add bowling stats", description = "Add bowling statistics for a player")
    public ResponseEntity<BowlingStats> addBowlingStats(@Valid @RequestBody BowlingStatsRequest request) {
        BowlingStats bowlingStats = statsService.addBowlingStats(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(bowlingStats);
    }
    
    @GetMapping("/batting/player/{playerId}")
    @Operation(summary = "Get batting stats by player", description = "Retrieve all batting statistics for a specific player")
    public ResponseEntity<List<BattingStats>> getBattingStatsByPlayer(@PathVariable Long playerId) {
        List<BattingStats> battingStats = statsService.getBattingStatsByPlayer(playerId);
        return ResponseEntity.ok(battingStats);
    }
    
    @GetMapping("/bowling/player/{playerId}")
    @Operation(summary = "Get bowling stats by player", description = "Retrieve all bowling statistics for a specific player")
    public ResponseEntity<List<BowlingStats>> getBowlingStatsByPlayer(@PathVariable Long playerId) {
        List<BowlingStats> bowlingStats = statsService.getBowlingStatsByPlayer(playerId);
        return ResponseEntity.ok(bowlingStats);
    }
    
    @GetMapping("/batting/{id}")
    @Operation(summary = "Get batting stat by ID", description = "Retrieve a specific batting statistic by ID")
    public ResponseEntity<BattingStats> getBattingStatById(@PathVariable Long id) {
        BattingStats battingStats = statsService.getBattingStatById(id);
        return ResponseEntity.ok(battingStats);
    }
    
    @GetMapping("/bowling/{id}")
    @Operation(summary = "Get bowling stat by ID", description = "Retrieve a specific bowling statistic by ID")
    public ResponseEntity<BowlingStats> getBowlingStatById(@PathVariable Long id) {
        BowlingStats bowlingStats = statsService.getBowlingStatById(id);
        return ResponseEntity.ok(bowlingStats);
    }
    
    @PutMapping("/batting/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DATA_ENTRY')")
    @Operation(summary = "Update batting stats", description = "Update batting statistics for a specific innings")
    public ResponseEntity<BattingStats> updateBattingStats(@PathVariable Long id, @Valid @RequestBody BattingStatsRequest request) {
        BattingStats battingStats = statsService.updateBattingStats(id, request);
        return ResponseEntity.ok(battingStats);
    }
    
    @PutMapping("/bowling/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DATA_ENTRY')")
    @Operation(summary = "Update bowling stats", description = "Update bowling statistics for a specific innings")
    public ResponseEntity<BowlingStats> updateBowlingStats(@PathVariable Long id, @Valid @RequestBody BowlingStatsRequest request) {
        BowlingStats bowlingStats = statsService.updateBowlingStats(id, request);
        return ResponseEntity.ok(bowlingStats);
    }
    
    @DeleteMapping("/batting/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DATA_ENTRY')")
    @Operation(summary = "Delete batting stats", description = "Delete a specific batting statistic")
    public ResponseEntity<Void> deleteBattingStats(@PathVariable Long id) {
        statsService.deleteBattingStats(id);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/bowling/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DATA_ENTRY')")
    @Operation(summary = "Delete bowling stats", description = "Delete a specific bowling statistic")
    public ResponseEntity<Void> deleteBowlingStats(@PathVariable Long id) {
        statsService.deleteBowlingStats(id);
        return ResponseEntity.noContent().build();
    }
}
