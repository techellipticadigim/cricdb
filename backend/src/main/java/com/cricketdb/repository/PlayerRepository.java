package com.cricketdb.repository;

import com.cricketdb.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByCountry(String country);
    
    @Query("SELECT DISTINCT p.country FROM Player p ORDER BY p.country")
    List<String> findDistinctCountries();
    
    @Query("SELECT p FROM Player p WHERE p.playerName LIKE %:name%")
    List<Player> findByNameContaining(@Param("name") String name);
}
