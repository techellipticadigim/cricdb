package com.cricketdb.repository;

import com.cricketdb.model.BowlingStats;
import com.cricketdb.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BowlingStatsRepository extends JpaRepository<BowlingStats, Long> {
    List<BowlingStats> findByPlayer(Player player);
    
    @Query("SELECT p.playerName, SUM(b.wicketsTaken) FROM Player p JOIN p.bowlingStats b GROUP BY p ORDER BY SUM(b.wicketsTaken) DESC")
    List<Object[]> findHighestWicketsData();
    
    @Query("SELECT p.playerName, SUM(b.maidens) FROM Player p JOIN p.bowlingStats b GROUP BY p ORDER BY SUM(b.maidens) DESC")
    List<Object[]> findMostMaidenOversData();
    
    @Query("SELECT p.playerName, COUNT(b) FROM Player p JOIN p.bowlingStats b WHERE b.wicketsTaken >= 5 GROUP BY p ORDER BY COUNT(b) DESC")
    List<Object[]> findTotalFiveWicketHaulsData();
    
    @Query("SELECT p.playerName, MAX(b.matchDate) FROM Player p JOIN p.bowlingStats b WHERE b.wicketsTaken >= 5 GROUP BY p ORDER BY MAX(b.matchDate) DESC")
    List<Object[]> findMostRecentFiveWicketHaulData();
    
    @Query("SELECT p.playerName, SUM(b.runsGiven) / SUM(b.overs) FROM Player p JOIN p.bowlingStats b GROUP BY p HAVING SUM(b.overs) > 0 ORDER BY SUM(b.runsGiven) / SUM(b.overs) ASC")
    List<Object[]> findBestBowlingEconomyData();
}
