package com.projectF.ComVerse.service;

import com.projectF.ComVerse.domain.dtos.UserDto;
import com.projectF.ComVerse.domain.entities.UserEntity;
import com.projectF.ComVerse.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.projectF.ComVerse.domain.mappers.UserMapper userMapper;

    public UserDto createUser(UserDto dto) {
        UserEntity entity = userMapper.toEntity(dto);
        UserEntity saved = userRepository.save(entity);
        return userMapper.toDto(saved);
    }

    public UserDto getUserById(Long id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userMapper.toDto(user);
    }

    public UserDto updateAvatar(Long id, String avatarUrl) {

        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAvatarUrl(avatarUrl);

        UserEntity updated = userRepository.save(user);

        return userMapper.toDto(updated);
    }

}
