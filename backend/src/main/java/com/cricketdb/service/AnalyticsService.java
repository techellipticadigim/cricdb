package com.cricketdb.service;

import com.cricketdb.dto.AnalyticsResponse;
import com.cricketdb.repository.BattingStatsRepository;
import com.cricketdb.repository.BowlingStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AnalyticsService {
    
    @Autowired
    private BattingStatsRepository battingStatsRepository;
    
    @Autowired
    private BowlingStatsRepository bowlingStatsRepository;
    
    public AnalyticsResponse getAnalytics() {
        AnalyticsResponse.AnalyticsResponseBuilder builder = AnalyticsResponse.builder();
        
        // Highest Runs
        List<Object[]> highestRunsData = battingStatsRepository.findHighestRunsData();
        if (!highestRunsData.isEmpty()) {
            Object[] data = highestRunsData.get(0);
            builder.highestRunsPlayer((String) data[0])
                   .highestRuns(((Number) data[1]).intValue());
        }
        
        // Highest Wickets
        List<Object[]> highestWicketsData = bowlingStatsRepository.findHighestWicketsData();
        if (!highestWicketsData.isEmpty()) {
            Object[] data = highestWicketsData.get(0);
            builder.highestWicketsPlayer((String) data[0])
                   .highestWickets(((Number) data[1]).intValue());
        }
        
        // Most Maiden Overs
        List<Object[]> mostMaidenOversData = bowlingStatsRepository.findMostMaidenOversData();
        if (!mostMaidenOversData.isEmpty()) {
            Object[] data = mostMaidenOversData.get(0);
            builder.mostMaidenOversPlayer((String) data[0])
                   .mostMaidenOvers(((Number) data[1]).intValue());
        }
        
        // Best Batting Average
        List<Object[]> bestBattingAverageData = battingStatsRepository.findBestBattingAverageData();
        if (!bestBattingAverageData.isEmpty()) {
            Object[] data = bestBattingAverageData.get(0);
            builder.bestBattingAveragePlayer((String) data[0])
                   .bestBattingAverage(((Number) data[1]).doubleValue());
        }
        
        // Best Bowling Economy
        List<Object[]> bestBowlingEconomyData = bowlingStatsRepository.findBestBowlingEconomyData();
        if (!bestBowlingEconomyData.isEmpty()) {
            Object[] data = bestBowlingEconomyData.get(0);
            builder.bestBowlingEconomyPlayer((String) data[0])
                   .bestBowlingEconomy(((Number) data[1]).doubleValue());
        }
        
        // Total Centuries
        List<Object[]> totalCenturiesData = battingStatsRepository.findTotalCenturiesData();
        if (!totalCenturiesData.isEmpty()) {
            Object[] data = totalCenturiesData.get(0);
            builder.totalCenturiesPlayer((String) data[0])
                   .totalCenturies(((Number) data[1]).intValue());
        }
        
        // Total Five Wicket Hauls
        List<Object[]> totalFiveWicketHaulsData = bowlingStatsRepository.findTotalFiveWicketHaulsData();
        if (!totalFiveWicketHaulsData.isEmpty()) {
            Object[] data = totalFiveWicketHaulsData.get(0);
            builder.totalFiveWicketHaulsPlayer((String) data[0])
                   .totalFiveWicketHauls(((Number) data[1]).intValue());
        }
        
        // Most Recent Century
        List<Object[]> mostRecentCenturyData = battingStatsRepository.findMostRecentCenturyData();
        if (!mostRecentCenturyData.isEmpty()) {
            Object[] data = mostRecentCenturyData.get(0);
            builder.mostRecentCenturyPlayer((String) data[0])
                   .mostRecentCenturyDate((LocalDate) data[1]);
        }
        
        // Most Recent Five Wicket Haul
        List<Object[]> mostRecentFiveWicketHaulData = bowlingStatsRepository.findMostRecentFiveWicketHaulData();
        if (!mostRecentFiveWicketHaulData.isEmpty()) {
            Object[] data = mostRecentFiveWicketHaulData.get(0);
            builder.mostRecentFiveWicketHaulPlayer((String) data[0])
                   .mostRecentFiveWicketHaulDate((LocalDate) data[1]);
        }
        
        // Most Sixes
        List<Object[]> mostSixesData = battingStatsRepository.findMostSixesData();
        if (!mostSixesData.isEmpty()) {
            Object[] data = mostSixesData.get(0);
            builder.mostSixesPlayer((String) data[0])
                   .mostSixes(((Number) data[1]).intValue());
        }
        
        // Most Fours
        List<Object[]> mostFoursData = battingStatsRepository.findMostFoursData();
        if (!mostFoursData.isEmpty()) {
            Object[] data = mostFoursData.get(0);
            builder.mostFoursPlayer((String) data[0])
                   .mostFours(((Number) data[1]).intValue());
        }
        
        return builder.build();
    }
}
