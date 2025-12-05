package com.projectF.ComVerse.controller;

import com.projectF.ComVerse.domain.dtos.MembershipDto;
import com.projectF.ComVerse.domain.enums.MembershipRole;
import com.projectF.ComVerse.service.MembershipService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/memberships")
public class MembershipController {

    @Autowired
    private MembershipService membershipService;

    @PostMapping("/join")
    public MembershipDto join(@RequestBody JoinRequest request) {
        return membershipService.joinCommunity(request.getUserId(), request.getCommunityId());
    }

    @DeleteMapping("/leave")
    public void leave(@RequestBody LeaveRequest request) {
        membershipService.leaveCommunity(request.getUserId(), request.getCommunityId());
    }

    @GetMapping("/user/{userId}")
    public List<MembershipDto> getUserMemberships(@PathVariable Long userId) {
        return membershipService.getUserMemberships(userId);
    }

    @PostMapping("/setRole")
    public MembershipDto setRole(@RequestBody RoleUpdateRequest request) {
        return membershipService.setRole(
                request.getActingUserId(),
                request.getTargetUserId(),
                request.getCommunityId(),
                request.getRole()
        );
    }

    @DeleteMapping("/kick")
    public void kickMember(@RequestBody KickRequest request) {
        membershipService.kickMember(
                request.getActingUserId(),
                request.getTargetUserId(),
                request.getCommunityId()
        );
    }

    @GetMapping("/community/{communityId}")
    public List<MembershipDto> getCommunityMembers(@PathVariable Long communityId) {
        return membershipService.getCommunityMembers(communityId);
    }


    @Data
    public static class JoinRequest {
        private Long userId;
        private Long communityId;
    }

    @Data
    public static class LeaveRequest {
        private Long userId;
        private Long communityId;
    }

    @Data
    public static class RoleUpdateRequest {
        private Long actingUserId;
        private Long targetUserId;
        private Long communityId;
        private MembershipRole role;
    }

    @Data
    public static class KickRequest {
        private Long actingUserId;
        private Long targetUserId;
        private Long communityId;
    }
}
