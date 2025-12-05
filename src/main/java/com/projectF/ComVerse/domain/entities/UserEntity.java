package com.projectF.ComVerse.domain.entities;


import jakarta.persistence.*;
import lombok.*;
import jakarta.persistence.Id;



@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    private String avatarUrl;

    private Integer age;


}