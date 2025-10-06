package com.cricketdb.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
public class AnalyticsResponse {
    private String highestRunsPlayer;
    private Integer highestRuns;
    
    private String highestWicketsPlayer;
    private Integer highestWickets;
    
    private String mostMaidenOversPlayer;
    private Integer mostMaidenOvers;
    
    private String bestBattingAveragePlayer;
    private Double bestBattingAverage;
    
    private String bestBowlingEconomyPlayer;
    private Double bestBowlingEconomy;
    
    private String totalCenturiesPlayer;
    private Integer totalCenturies;
    
    private String totalFiveWicketHaulsPlayer;
    private Integer totalFiveWicketHauls;
    
    private String mostRecentCenturyPlayer;
    private LocalDate mostRecentCenturyDate;
    
    private String mostRecentFiveWicketHaulPlayer;
    private LocalDate mostRecentFiveWicketHaulDate;
    
    private String mostSixesPlayer;
    private Integer mostSixes;
    
    private String mostFoursPlayer;
    private Integer mostFours;
}
