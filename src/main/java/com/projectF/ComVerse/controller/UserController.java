package com.projectF.ComVerse.controller;

import com.projectF.ComVerse.domain.dtos.UserDto;
import com.projectF.ComVerse.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public UserDto createUser(@RequestBody UserDto dto) {
        return userService.createUser(dto);
    }

    @GetMapping("/{id}")
    public UserDto getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PatchMapping("/{id}/avatar")
    public UserDto updateAvatar(
            @PathVariable Long id,
            @RequestParam String avatarUrl
    ) {
        return userService.updateAvatar(id, avatarUrl);
    }

}
