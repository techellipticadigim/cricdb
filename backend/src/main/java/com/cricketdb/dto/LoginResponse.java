package com.cricketdb.dto;

import com.cricketdb.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String email;
    private Role role;
    private String message;
}
