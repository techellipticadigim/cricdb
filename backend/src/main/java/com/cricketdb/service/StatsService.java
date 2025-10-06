package com.cricketdb.service;

import com.cricketdb.dto.BattingStatsRequest;
import com.cricketdb.dto.BowlingStatsRequest;
import com.cricketdb.model.BattingStats;
import com.cricketdb.model.BowlingStats;
import com.cricketdb.model.Player;
import com.cricketdb.repository.BattingStatsRepository;
import com.cricketdb.repository.BowlingStatsRepository;
import com.cricketdb.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatsService {
    
    @Autowired
    private BattingStatsRepository battingStatsRepository;
    
    @Autowired
    private BowlingStatsRepository bowlingStatsRepository;
    
    @Autowired
    private PlayerRepository playerRepository;
    
    public BattingStats addBattingStats(BattingStatsRequest request) {
        Player player = playerRepository.findById(request.getPlayerId())
                .orElseThrow(() -> new RuntimeException("Player not found with id: " + request.getPlayerId()));
        
        BattingStats battingStats = new BattingStats();
        battingStats.setPlayer(player);
        battingStats.setRuns(request.getRuns());
        battingStats.setBallsPlayed(request.getBallsPlayed());
        battingStats.setSixes(request.getSixes());
        battingStats.setFours(request.getFours());
        battingStats.setAgainst(request.getAgainst());
        battingStats.setMatchDate(request.getMatchDate());
        
        return battingStatsRepository.save(battingStats);
    }
    
    public BowlingStats addBowlingStats(BowlingStatsRequest request) {
        Player player = playerRepository.findById(request.getPlayerId())
                .orElseThrow(() -> new RuntimeException("Player not found with id: " + request.getPlayerId()));
        
        BowlingStats bowlingStats = new BowlingStats();
        bowlingStats.setPlayer(player);
        bowlingStats.setOvers(request.getOvers());
        bowlingStats.setMaidens(request.getMaidens());
        bowlingStats.setRunsGiven(request.getRunsGiven());
        bowlingStats.setWicketsTaken(request.getWicketsTaken());
        bowlingStats.setAgainst(request.getAgainst());
        bowlingStats.setMatchDate(request.getMatchDate());
        
        return bowlingStatsRepository.save(bowlingStats);
    }
    
    public List<BattingStats> getBattingStatsByPlayer(Long playerId) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found with id: " + playerId));
        return battingStatsRepository.findByPlayer(player);
    }
    
    public List<BowlingStats> getBowlingStatsByPlayer(Long playerId) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found with id: " + playerId));
        return bowlingStatsRepository.findByPlayer(player);
    }
}
