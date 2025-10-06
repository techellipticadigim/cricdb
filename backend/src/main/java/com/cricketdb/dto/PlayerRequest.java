package com.cricketdb.dto;

import com.cricketdb.model.Gender;
import com.cricketdb.model.PlayerRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class PlayerRequest {
    @NotBlank(message = "Player name is required")
    private String playerName;
    
    @NotBlank(message = "Country is required")
    private String country;
    
    @NotNull(message = "Start year is required")
    @Min(value = 1800, message = "Start year must be valid")
    private Integer startYear;
    
    @NotNull(message = "Gender is required")
    private Gender gender;
    
    @NotNull(message = "Role is required")
    private PlayerRole role;
    
    private String notes;
}
