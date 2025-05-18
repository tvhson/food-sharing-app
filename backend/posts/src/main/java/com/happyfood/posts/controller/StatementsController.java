package com.happyfood.posts.controller;


import com.happyfood.posts.dto.StatementsDto;
import com.happyfood.posts.service.IGroupsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/statements")
public class StatementsController {
    private final IGroupsService groupsService;

    @PostMapping("/{groupId}")
    ResponseEntity<StatementsDto> createStatements(@PathVariable Long groupId, @RequestBody StatementsDto statementsDto) {
        return ResponseEntity.ok(groupsService.createStatement(groupId, statementsDto));
    }

    @GetMapping("/{groupId}")
    ResponseEntity<List<StatementsDto>> getStatementsByGroupId(@PathVariable Long groupId) {
        return ResponseEntity.ok(groupsService.getStatementsByGroupId(groupId));
    }

    @PutMapping("/{statementId}")
    ResponseEntity<StatementsDto> updateStatementsById(@PathVariable Long statementId, @RequestBody StatementsDto statementsDto) {
        return ResponseEntity.ok(groupsService.updateStatement(statementId, statementsDto));
    }

    @DeleteMapping("/{statementId}")
    ResponseEntity<?> deleteStatementsById(@PathVariable Long statementId) {
        groupsService.deleteStatement(statementId);
        return ResponseEntity.ok().build();
    }
}
