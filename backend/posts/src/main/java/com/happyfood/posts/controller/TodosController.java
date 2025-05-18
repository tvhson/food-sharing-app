package com.happyfood.posts.controller;

import com.happyfood.posts.entity.Todos;
import com.happyfood.posts.service.IGroupsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/todos")
public class TodosController {
    private final IGroupsService groupsService;

    @PostMapping("/{groupId}")
    ResponseEntity<Todos> createTodos(@PathVariable Long groupId, @RequestBody Todos todos) {
        return ResponseEntity.ok(groupsService.createTodo(groupId, todos));
    }

    @GetMapping("/{groupId}")
    ResponseEntity<List<Todos>> getTodosByGroupId(@PathVariable Long groupId) {
        return ResponseEntity.ok(groupsService.getTodosByGroupId(groupId));
    }

    @PutMapping("/{todoId}")
    ResponseEntity<Todos> updateTodosById(@PathVariable Long todoId, @RequestBody Todos todos) {
        return ResponseEntity.ok(groupsService.updateTodo(todoId, todos));
    }

    @DeleteMapping("/{todoId}")
    ResponseEntity<?> deleteTodosById(@PathVariable Long todoId) {
        groupsService.deleteTodo(todoId);
        return ResponseEntity.ok().build();
    }
}
