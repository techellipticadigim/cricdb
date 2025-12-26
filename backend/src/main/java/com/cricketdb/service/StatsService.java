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
import org.springframework.transaction.annotation.Transactional;

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
    
    @Transactional(readOnly = true)
    public List<BattingStats> getBattingStatsByPlayer(Long playerId) {
        if (!playerRepository.existsById(playerId)) {
            throw new RuntimeException("Player not found with id: " + playerId);
        }
        // Use JOIN FETCH to eagerly load player and avoid lazy loading issues
        return battingStatsRepository.findByPlayerIdWithPlayer(playerId);
    }
    
    @Transactional(readOnly = true)
    public List<BowlingStats> getBowlingStatsByPlayer(Long playerId) {
        if (!playerRepository.existsById(playerId)) {
            throw new RuntimeException("Player not found with id: " + playerId);
        }
        // Use JOIN FETCH to eagerly load player and avoid lazy loading issues
        return bowlingStatsRepository.findByPlayerIdWithPlayer(playerId);
    }
    
    @Transactional(readOnly = true)
    public BattingStats getBattingStatById(Long id) {
        return battingStatsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Batting stat not found with id: " + id));
    }
    
    @Transactional(readOnly = true)
    public BowlingStats getBowlingStatById(Long id) {
        return bowlingStatsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bowling stat not found with id: " + id));
    }
    
    @Transactional
    public BattingStats updateBattingStats(Long id, BattingStatsRequest request) {
        BattingStats existingStats = battingStatsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Batting stat not found with id: " + id));
        
        Player player = playerRepository.findById(request.getPlayerId())
                .orElseThrow(() -> new RuntimeException("Player not found with id: " + request.getPlayerId()));
        
        existingStats.setPlayer(player);
        existingStats.setRuns(request.getRuns());
        existingStats.setBallsPlayed(request.getBallsPlayed());
        existingStats.setSixes(request.getSixes());
        existingStats.setFours(request.getFours());
        existingStats.setAgainst(request.getAgainst());
        existingStats.setMatchDate(request.getMatchDate());
        
        return battingStatsRepository.save(existingStats);
    }
    
    @Transactional
    public BowlingStats updateBowlingStats(Long id, BowlingStatsRequest request) {
        BowlingStats existingStats = bowlingStatsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bowling stat not found with id: " + id));
        
        Player player = playerRepository.findById(request.getPlayerId())
                .orElseThrow(() -> new RuntimeException("Player not found with id: " + request.getPlayerId()));
        
        existingStats.setPlayer(player);
        existingStats.setOvers(request.getOvers());
        existingStats.setMaidens(request.getMaidens());
        existingStats.setRunsGiven(request.getRunsGiven());
        existingStats.setWicketsTaken(request.getWicketsTaken());
        existingStats.setAgainst(request.getAgainst());
        existingStats.setMatchDate(request.getMatchDate());
        
        return bowlingStatsRepository.save(existingStats);
    }
    
    @Transactional
    public void deleteBattingStats(Long id) {
        if (!battingStatsRepository.existsById(id)) {
            throw new RuntimeException("Batting stat not found with id: " + id);
        }
        battingStatsRepository.deleteById(id);
    }
    
    @Transactional
    public void deleteBowlingStats(Long id) {
        if (!bowlingStatsRepository.existsById(id)) {
            throw new RuntimeException("Bowling stat not found with id: " + id);
        }
        bowlingStatsRepository.deleteById(id);
    }
}
