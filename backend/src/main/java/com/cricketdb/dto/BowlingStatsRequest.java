package com.cricketdb.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BowlingStatsRequest {
    @NotNull(message = "Player ID is required")
    private Long playerId;
    
    @NotNull(message = "Overs is required")
    @Min(value = 0, message = "Overs cannot be negative")
    private Double overs;
    
    @NotNull(message = "Maidens is required")
    @Min(value = 0, message = "Maidens cannot be negative")
    private Integer maidens;
    
    @NotNull(message = "Runs given is required")
    @Min(value = 0, message = "Runs given cannot be negative")
    private Integer runsGiven;
    
    @NotNull(message = "Wickets taken is required")
    @Min(value = 0, message = "Wickets taken cannot be negative")
    private Integer wicketsTaken;
    
    @NotBlank(message = "Opponent team is required")
    private String against;
    
    @NotNull(message = "Match date is required")
    private LocalDate matchDate;
}
