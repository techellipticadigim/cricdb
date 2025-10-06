package com.cricketdb.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BattingStatsRequest {
    @NotNull(message = "Player ID is required")
    private Long playerId;
    
    @NotNull(message = "Runs is required")
    @Min(value = 0, message = "Runs cannot be negative")
    private Integer runs;
    
    @NotNull(message = "Balls played is required")
    @Min(value = 1, message = "At least 1 ball must be played")
    private Integer ballsPlayed;
    
    @NotNull(message = "Sixes is required")
    @Min(value = 0, message = "Sixes cannot be negative")
    private Integer sixes;
    
    @NotNull(message = "Fours is required")
    @Min(value = 0, message = "Fours cannot be negative")
    private Integer fours;
    
    @NotBlank(message = "Opponent team is required")
    private String against;
    
    @NotNull(message = "Match date is required")
    private LocalDate matchDate;
}
