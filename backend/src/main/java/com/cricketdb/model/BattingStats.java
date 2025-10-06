package com.cricketdb.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "batting_stats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BattingStats {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;
    
    @Column(nullable = false)
    private Integer runs;
    
    @Column(nullable = false)
    private Integer ballsPlayed;
    
    @Column(nullable = false)
    private Integer sixes;
    
    @Column(nullable = false)
    private Integer fours;
    
    @Column(nullable = false)
    private String against;
    
    @Column(nullable = false)
    private LocalDate matchDate;
}
