package com.happyfood.posts.service;

import com.happyfood.posts.dto.GroupsDto;
import com.happyfood.posts.dto.StatementsDto;
import com.happyfood.posts.entity.Todos;

import java.util.List;

public interface IGroupsService {
    List<GroupsDto> getAllGroups(Long userId);
    GroupsDto getGroupById(Long groupId, Long userId);
    GroupsDto createGroup(Long userId, GroupsDto groupsDto);
    GroupsDto updateGroup(Long userId, Long groupId, GroupsDto groupsDto);
    void deleteGroup(Long groupId);
    List<GroupsDto> getMyGroups(Long userId);

    List<Todos> getTodosByGroupId(Long groupId);
    Todos createTodo(Long groupId, Todos todos);
    Todos updateTodo(Long todoId, Todos todos);
    void deleteTodo(Long todoId);

    List<StatementsDto> getStatementsByGroupId(Long groupId);
    StatementsDto createStatement(Long groupId, StatementsDto statementsDto);
    StatementsDto updateStatement(Long statementId, StatementsDto statementsDto);
    void deleteStatement(Long statementId);

    void inviteUserToGroup(Long groupId, Long userId);
    void removeUserFromGroup(Long groupId, Long userId);
    void acceptGroupInvitation(Long groupId, Long userId);
    void rejectGroupInvitation(Long groupId, Long userId);
    void joinGroup(Long groupId, Long userId);
    void leaveGroup(Long groupId, Long userId);
}
