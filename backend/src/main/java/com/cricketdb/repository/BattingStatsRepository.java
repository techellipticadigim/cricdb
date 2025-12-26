package com.cricketdb.repository;

import com.cricketdb.model.BattingStats;
import com.cricketdb.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BattingStatsRepository extends JpaRepository<BattingStats, Long> {
    List<BattingStats> findByPlayer(Player player);
    
    @Query("SELECT b FROM BattingStats b JOIN FETCH b.player WHERE b.player.playerId = :playerId")
    List<BattingStats> findByPlayerIdWithPlayer(@Param("playerId") Long playerId);
    
    @Query("SELECT p.playerName, SUM(b.runs) FROM Player p JOIN p.battingStats b GROUP BY p ORDER BY SUM(b.runs) DESC")
    List<Object[]> findHighestRunsData();
    
    @Query("SELECT p.playerName, COUNT(b) FROM Player p JOIN p.battingStats b WHERE b.runs >= 100 GROUP BY p ORDER BY COUNT(b) DESC")
    List<Object[]> findTotalCenturiesData();
    
    @Query("SELECT p.playerName, MAX(b.matchDate) FROM Player p JOIN p.battingStats b WHERE b.runs >= 100 GROUP BY p ORDER BY MAX(b.matchDate) DESC")
    List<Object[]> findMostRecentCenturyData();
    
    @Query("SELECT p.playerName, SUM(b.sixes) FROM Player p JOIN p.battingStats b GROUP BY p ORDER BY SUM(b.sixes) DESC")
    List<Object[]> findMostSixesData();
    
    @Query("SELECT p.playerName, SUM(b.fours) FROM Player p JOIN p.battingStats b GROUP BY p ORDER BY SUM(b.fours) DESC")
    List<Object[]> findMostFoursData();
    
    @Query("SELECT p.playerName, SUM(b.runs) / COUNT(DISTINCT b.matchDate) FROM Player p JOIN p.battingStats b GROUP BY p HAVING COUNT(DISTINCT b.matchDate) > 0 ORDER BY SUM(b.runs) / COUNT(DISTINCT b.matchDate) DESC")
    List<Object[]> findBestBattingAverageData();
}
