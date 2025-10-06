package com.cricketdb.dto;

import com.cricketdb.model.Gender;
import com.cricketdb.model.PlayerRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PlayerResponse {
    private Long playerId;
    private String playerName;
    private String country;
    private Integer startYear;
    private Gender gender;
    private PlayerRole role;
    private String notes;
}
