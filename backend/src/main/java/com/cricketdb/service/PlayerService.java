package com.cricketdb.service;

import com.cricketdb.dto.PlayerRequest;
import com.cricketdb.dto.PlayerResponse;
import com.cricketdb.model.Player;
import com.cricketdb.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlayerService {
    
    @Autowired
    private PlayerRepository playerRepository;
    
    public List<PlayerResponse> getAllPlayers() {
        return playerRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<PlayerResponse> getPlayersByCountry(String country) {
        if (country == null || country.equals("All")) {
            return getAllPlayers();
        }
        return playerRepository.findByCountry(country).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<String> getDistinctCountries() {
        return playerRepository.findDistinctCountries();
    }
    
    public PlayerResponse getPlayerById(Long id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found with id: " + id));
        return convertToResponse(player);
    }
    
    public PlayerResponse createPlayer(PlayerRequest request) {
        Player player = convertToEntity(request);
        Player savedPlayer = playerRepository.save(player);
        return convertToResponse(savedPlayer);
    }
    
    public PlayerResponse updatePlayer(Long id, PlayerRequest request) {
        Player existingPlayer = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found with id: " + id));
        
        existingPlayer.setPlayerName(request.getPlayerName());
        existingPlayer.setCountry(request.getCountry());
        existingPlayer.setStartYear(request.getStartYear());
        existingPlayer.setGender(request.getGender());
        existingPlayer.setRole(request.getRole());
        existingPlayer.setNotes(request.getNotes());
        
        Player updatedPlayer = playerRepository.save(existingPlayer);
        return convertToResponse(updatedPlayer);
    }
    
    public void deletePlayer(Long id) {
        if (!playerRepository.existsById(id)) {
            throw new RuntimeException("Player not found with id: " + id);
        }
        playerRepository.deleteById(id);
    }
    
    private Player convertToEntity(PlayerRequest request) {
        Player player = new Player();
        player.setPlayerName(request.getPlayerName());
        player.setCountry(request.getCountry());
        player.setStartYear(request.getStartYear());
        player.setGender(request.getGender());
        player.setRole(request.getRole());
        player.setNotes(request.getNotes());
        return player;
    }
    
    private PlayerResponse convertToResponse(Player player) {
        return new PlayerResponse(
                player.getPlayerId(),
                player.getPlayerName(),
                player.getCountry(),
                player.getStartYear(),
                player.getGender(),
                player.getRole(),
                player.getNotes()
        );
    }
}
