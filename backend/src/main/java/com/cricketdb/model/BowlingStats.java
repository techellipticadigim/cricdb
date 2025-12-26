package com.cricketdb.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "bowling_stats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BowlingStats {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "battingStats", "bowlingStats"})
    private Player player;
    
    @Column(nullable = false)
    private Double overs;
    
    @Column(nullable = false)
    private Integer maidens;
    
    @Column(nullable = false)
    private Integer runsGiven;
    
    @Column(nullable = false)
    private Integer wicketsTaken;
    
    @Column(nullable = false)
    private String against;
    
    @Column(nullable = false)
    private LocalDate matchDate;
}
