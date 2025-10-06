package com.cricketdb.controller;

import com.cricketdb.dto.PlayerRequest;
import com.cricketdb.dto.PlayerResponse;
import com.cricketdb.service.PlayerService;
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
@RequestMapping("/api/players")
@Tag(name = "Player Management", description = "Player CRUD operations")
public class PlayerController {
    
    @Autowired
    private PlayerService playerService;
    
    @GetMapping
    @Operation(summary = "Get all players", description = "Retrieve list of all players")
    public ResponseEntity<List<PlayerResponse>> getAllPlayers() {
        List<PlayerResponse> players = playerService.getAllPlayers();
        return ResponseEntity.ok(players);
    }
    
    @GetMapping("/country/{country}")
    @Operation(summary = "Get players by country", description = "Retrieve players filtered by country")
    public ResponseEntity<List<PlayerResponse>> getPlayersByCountry(@PathVariable String country) {
        List<PlayerResponse> players = playerService.getPlayersByCountry(country);
        return ResponseEntity.ok(players);
    }
    
    @GetMapping("/countries")
    @Operation(summary = "Get distinct countries", description = "Retrieve list of all distinct countries")
    public ResponseEntity<List<String>> getDistinctCountries() {
        List<String> countries = playerService.getDistinctCountries();
        return ResponseEntity.ok(countries);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get player by ID", description = "Retrieve a specific player by ID")
    public ResponseEntity<PlayerResponse> getPlayerById(@PathVariable Long id) {
        PlayerResponse player = playerService.getPlayerById(id);
        return ResponseEntity.ok(player);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DATA_ENTRY')")
    @Operation(summary = "Create new player", description = "Add a new player to the database")
    public ResponseEntity<PlayerResponse> createPlayer(@Valid @RequestBody PlayerRequest request) {
        PlayerResponse player = playerService.createPlayer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(player);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DATA_ENTRY')")
    @Operation(summary = "Update player", description = "Update an existing player")
    public ResponseEntity<PlayerResponse> updatePlayer(@PathVariable Long id, @Valid @RequestBody PlayerRequest request) {
        PlayerResponse player = playerService.updatePlayer(id, request);
        return ResponseEntity.ok(player);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DATA_ENTRY')")
    @Operation(summary = "Delete player", description = "Delete a player from the database")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);
        return ResponseEntity.noContent().build();
    }
}
