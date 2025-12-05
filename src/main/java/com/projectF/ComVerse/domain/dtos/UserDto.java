package com.projectF.ComVerse.domain.dtos;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private String username;
    private String email;
    private String password;
    private String avatarUrl;
    private Integer age;
}
