package com.happyfood.posts.service.impl;

import com.happyfood.posts.adapter.AccountsAdapter;
import com.happyfood.posts.dto.AccountsDto;
import com.happyfood.posts.dto.GroupsDto;
import com.happyfood.posts.dto.NotificationsDto;
import com.happyfood.posts.dto.StatementsDto;
import com.happyfood.posts.entity.Groups;
import com.happyfood.posts.entity.Statements;
import com.happyfood.posts.entity.Todos;
import com.happyfood.posts.exception.CustomException;
import com.happyfood.posts.mapper.GroupsMapper;
import com.happyfood.posts.repository.GroupsRepository;
import com.happyfood.posts.repository.StatementsRepository;
import com.happyfood.posts.repository.TodosRepository;
import com.happyfood.posts.service.IGroupsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class GroupsServiceImpl implements IGroupsService {
    private final AccountsAdapter accountsAdapter;
    private final GroupsRepository groupsRepository;
    private final TodosRepository todosRepository;
    private final StatementsRepository statementsRepository;

    @Override
    public List<GroupsDto> getAllGroups(Long userId) {
        List<Groups> groups = groupsRepository.findAll();
        Collections.reverse(groups);
        return groups.stream()
                     .map(group -> {
                         return convertToResponse(group, userId);
                     })
                     .toList();
    }

    @Override
    public List<GroupsDto> getGroupsByUserId(Long userId) {
        List<Groups> groups = groupsRepository.findAll();
        Collections.reverse(groups);
        return groups.stream()
                     .filter(group -> {
                         if (group.getMemberIds() != null && !group.getMemberIds().isEmpty()) {
                             List<String> memberIds = Arrays.asList(group.getMemberIds().split("-"));
                             return memberIds.contains(String.valueOf(userId));
                         }
                         return false;
                     })
                     .map(group -> convertToResponse(group, userId))
                     .toList();
    }

    @Override
    public GroupsDto getGroupById(Long groupId, Long userId) {
        Groups groups = groupsRepository.findById(groupId).orElseThrow(() -> new CustomException("Không tìm thấy nhóm", HttpStatus.NOT_FOUND));

        return convertToResponse(groups, userId);
    }

    @Override
    public GroupsDto createGroup(Long userId, GroupsDto groupsDto) {
        Groups groups = GroupsMapper.mapToGroups(groupsDto);
        if (groupsDto.getRequests() != null && !groupsDto.getRequests().isEmpty()) {
            groups.setRequestIds(String.join("-", groupsDto.getRequests().stream().map(AccountsDto::getId).map(String::valueOf).toList()));
        }
        if (groupsDto.getMembers() != null && !groupsDto.getMembers().isEmpty()) {
            groups.setMemberIds(String.join("-", groupsDto.getMembers().stream().map(AccountsDto::getId).map(String::valueOf).toList()));
        }

        groups.setMemberIds(userId.toString());
        groups.setCreatedDate(new Date());
        groups.setAuthorId(userId);
        return convertToResponse(groupsRepository.save(groups), userId);
    }

    @Override
    public GroupsDto updateGroup(Long userId, Long groupId, GroupsDto groupsDto) {
        Groups groups = groupsRepository.findById(groupId).orElseThrow(() -> new CustomException("Không tìm thấy nhóm", HttpStatus.NOT_FOUND));

        groups.setName(groupsDto.getName());
        groups.setDescription(groupsDto.getDescription());
        groups.setJoinType(groupsDto.getJoinType());
        groups.setImageUrl(groupsDto.getImageUrl());
        groups.setStartDate(groupsDto.getStartDate());
        groups.setEndDate(groupsDto.getEndDate());
        groups.setLocationName(groupsDto.getLocationName());
        groups.setLatitude(groupsDto.getLatitude());
        groups.setLongitude(groupsDto.getLongitude());

        return convertToResponse(groupsRepository.save(groups), userId);
    }

    @Override
    public void deleteGroup(Long groupId) {
        Groups groups = groupsRepository.findById(groupId).orElseThrow(() -> new CustomException("Không tìm thấy nhóm", HttpStatus.NOT_FOUND));
        groupsRepository.delete(groups);
    }

    @Override
    public List<GroupsDto> getMyGroups(Long userId) {
        List<Groups> groups = groupsRepository.findByAuthorId(userId);
        Collections.reverse(groups);
        return groups.stream()
                     .map(group -> {
                         return convertToResponse(group, userId);
                     })
                     .toList();
    }

    @Override
    public List<Todos> getTodosByGroupId(Long groupId) {
        List<Todos> todos = todosRepository.findByGroupId(groupId);
        Collections.reverse(todos);
        return todos;
    }

    @Override
    public Todos createTodo(Long groupId, Todos todos) {
        Todos todo = Todos.builder()
                          .title(todos.getTitle())
                          .date(todos.getDate())
                          .status(todos.getStatus())
                          .groupId(groupId)
                          .build();


        return todosRepository.save(todo);
    }

    @Override
    public Todos updateTodo(Long todoId, Todos todos) {
        Todos todo = todosRepository.findById(todoId).orElseThrow(() -> new CustomException("Không tìm thấy todo", HttpStatus.NOT_FOUND));
        todo.setTitle(todos.getTitle());
        todo.setDate(todos.getDate());
        todo.setStatus(todos.getStatus());

        return todosRepository.save(todo);
    }

    @Override
    public void deleteTodo(Long todoId) {
        Todos todo = todosRepository.findById(todoId).orElseThrow(() -> new CustomException("Không tìm thấy todo", HttpStatus.NOT_FOUND));
        todosRepository.delete(todo);
    }

    @Override
    public List<StatementsDto> getStatementsByGroupId(Long groupId) {
        List<Statements> statements = statementsRepository.findByGroupId(groupId);
        Collections.reverse(statements);
        return statements.stream()
                         .map(this::convertToStatementResponse)
                         .toList();
    }

    @Override
    public StatementsDto createStatement(Long groupId, StatementsDto statementsDto) {
        Statements statements = Statements.builder()
                                          .description(statementsDto.getDescription())
                                          .groupId(groupId)
                                          .userId(statementsDto.getUser().getId())
                                          .createdDate(new Date())
                                          .build();
        statements = statementsRepository.save(statements);
        return convertToStatementResponse(statements);
    }

    @Override
    public StatementsDto updateStatement(Long statementId, StatementsDto statementsDto) {
        Statements statements = statementsRepository.findById(statementId).orElseThrow(() -> new CustomException("Không tìm thấy statement", HttpStatus.NOT_FOUND));
        statements.setDescription(statementsDto.getDescription());
        statements.setUserId(statementsDto.getUser().getId());
        statements.setCreatedDate(statementsDto.getCreatedDate());
        statements = statementsRepository.save(statements);
        return convertToStatementResponse(statements);
    }

    @Override
    public void deleteStatement(Long statementId) {
        Statements statements = statementsRepository.findById(statementId).orElseThrow(() -> new CustomException("Không tìm thấy statement", HttpStatus.NOT_FOUND));
        statementsRepository.delete(statements);
    }

    @Override
    public GroupsDto inviteUserToGroup(Long groupId, Long userId) {
        Groups groups = groupsRepository.findById(groupId).orElseThrow(() -> new CustomException("Không tìm thấy nhóm", HttpStatus.NOT_FOUND));
        if (groups.getMemberIds() != null && !groups.getMemberIds().isEmpty()) {
            List<String> memberIds = Arrays.asList(groups.getMemberIds().split("-"));
            if (memberIds.contains(String.valueOf(userId))) {
                throw new CustomException("Người dùng đã là thành viên của nhóm", HttpStatus.BAD_REQUEST);
            }
        }

        if (groups.getRequestIds() != null && !groups.getRequestIds().isEmpty()) {
            List<String> requestIds = Arrays.asList(groups.getRequestIds().split("-"));
            if (requestIds.contains(String.valueOf(userId))) {
                throw new CustomException("Người dùng đã gửi yêu cầu tham gia nhóm", HttpStatus.BAD_REQUEST);
            }
            groups.setRequestIds(groups.getRequestIds() + "-" + userId);
        } else {
            groups.setRequestIds(userId.toString());
        }

        accountsAdapter.createNotification(NotificationsDto.builder()
                                                           .type("GROUP_INVITATION")
                                                           .imageUrl(groups.getImageUrl())
                                                           .title("Tham gia nhóm " + groups.getName())
                                                           .description("Bạn đã được mời tham gia nhóm " + groups.getName())
                                                           .linkId(groups.getId())
                                                           .userId(userId)
                                                           .senderId(groups.getAuthorId())
                                                           .build());

        return convertToResponse(groupsRepository.save(groups), userId);
    }

    @Override
    public GroupsDto removeUserFromGroup(Long groupId, Long userId) {
        Groups groups = groupsRepository.findById(groupId).orElseThrow(() -> new CustomException("Không tìm thấy nhóm", HttpStatus.NOT_FOUND));
        if (groups.getMemberIds() != null && !groups.getMemberIds().isEmpty()) {
            List<String> memberIds = Arrays.asList(groups.getMemberIds().split("-"));
            if (!memberIds.contains(String.valueOf(userId))) {
                throw new CustomException("Người dùng không phải là thành viên của nhóm", HttpStatus.BAD_REQUEST);
            }
            groups.setMemberIds(String.join("-", memberIds.stream().filter(memberId -> !memberId.equals(String.valueOf(userId))).toList()));
        }
        if (groups.getRequestIds() != null && !groups.getRequestIds().isEmpty()) {
            List<String> requestIds = Arrays.asList(groups.getRequestIds().split("-"));
            groups.setRequestIds(String.join("-", requestIds.stream().filter(requestId -> !requestId.equals(String.valueOf(userId))).toList()));
        }
        accountsAdapter.createNotification(NotificationsDto.builder()
                                                           .type("ALERT")
                                                           .imageUrl(groups.getImageUrl())
                                                           .title("Rời nhóm " + groups.getName())
                                                           .description("Bạn đã bị xóa khỏi nhóm " + groups.getName())
                                                           .linkId(groups.getId())
                                                           .userId(userId)
                                                           .senderId(groups.getAuthorId())
                                                           .build());
        return convertToResponse(groupsRepository.save(groups), userId);
    }

    @Override
    public GroupsDto acceptGroupInvitation(Long groupId, Long userId) {
        Groups groups = groupsRepository.findById(groupId).orElseThrow(() -> new CustomException("Không tìm thấy nhóm", HttpStatus.NOT_FOUND));
        if (groups.getMemberIds() != null && !groups.getMemberIds().isEmpty()) {
            List<String> memberIds = Arrays.asList(groups.getMemberIds().split("-"));
            if (memberIds.contains(String.valueOf(userId))) {
                throw new CustomException("Người dùng đã là thành viên của nhóm", HttpStatus.BAD_REQUEST);
            }
            groups.setMemberIds(groups.getMemberIds() + "-" + userId);
        } else {
            groups.setMemberIds(userId.toString());
        }

        if (groups.getRequestIds() != null && !groups.getRequestIds().isEmpty()) {
            List<String> requestIds = Arrays.asList(groups.getRequestIds().split("-"));
            groups.setRequestIds(String.join("-", requestIds.stream().filter(requestId -> !requestId.equals(String.valueOf(userId))).toList()));
        }
        return convertToResponse(groupsRepository.save(groups), userId);
    }

    @Override
    public GroupsDto rejectGroupInvitation(Long groupId, Long userId) {
        Groups groups = groupsRepository.findById(groupId).orElseThrow(() -> new CustomException("Không tìm thấy nhóm", HttpStatus.NOT_FOUND));
        if (groups.getRequestIds() != null && !groups.getRequestIds().isEmpty()) {
            List<String> requestIds = Arrays.asList(groups.getRequestIds().split("-"));
            groups.setRequestIds(String.join("-", requestIds.stream().filter(requestId -> !requestId.equals(String.valueOf(userId))).toList()));
        }
        return convertToResponse(groupsRepository.save(groups), userId);
    }

    @Override
    public GroupsDto joinGroup(Long groupId, Long userId) {
        Groups groups = groupsRepository.findById(groupId).orElseThrow(() -> new CustomException("Không tìm thấy nhóm", HttpStatus.NOT_FOUND));
        if (groups.getMemberIds() != null && !groups.getMemberIds().isEmpty()) {
            List<String> memberIds = Arrays.asList(groups.getMemberIds().split("-"));
            if (memberIds.contains(String.valueOf(userId))) {
                throw new CustomException("Người dùng đã là thành viên của nhóm", HttpStatus.BAD_REQUEST);
            }
        }

        if ("PUBLIC".equals(groups.getJoinType())) {
            if (groups.getMemberIds() != null && !groups.getMemberIds().isEmpty()) {
                List<String> memberIds = Arrays.asList(groups.getMemberIds().split("-"));
                if (!memberIds.contains(String.valueOf(userId))) {
                    groups.setMemberIds(groups.getMemberIds() + "-" + userId);
                }
            } else {
                groups.setMemberIds(userId.toString());
            }
            return convertToResponse(groupsRepository.save(groups), userId);
        }

        if (groups.getRequestIds() != null && !groups.getRequestIds().isEmpty()) {
            List<String> requestIds = Arrays.asList(groups.getRequestIds().split("-"));
            if (requestIds.contains(String.valueOf(userId))) {
                throw new CustomException("Người dùng đã gửi yêu cầu tham gia nhóm", HttpStatus.BAD_REQUEST);
            }
            groups.setRequestIds(groups.getRequestIds() + "-" + userId);
        } else {
            groups.setRequestIds(userId.toString());
        }

        accountsAdapter.createNotification(NotificationsDto.builder()
                                                           .type("GROUP_REQUEST")
                                                           .imageUrl(groups.getImageUrl())
                                                           .title("Tham gia nhóm " + groups.getName())
                                                           .description("Yêu cầu tham gia nhóm " + groups.getName())
                                                           .linkId(groups.getId())
                                                           .userId(groups.getAuthorId())
                                                           .senderId(userId)
                                                           .build());

        return convertToResponse(groupsRepository.save(groups), userId);
    }

    @Override
    public GroupsDto leaveGroup(Long groupId, Long userId) {
        Groups groups = groupsRepository.findById(groupId).orElseThrow(() -> new CustomException("Không tìm thấy nhóm", HttpStatus.NOT_FOUND));
        if (groups.getMemberIds() != null && !groups.getMemberIds().isEmpty()) {
            List<String> memberIds = Arrays.asList(groups.getMemberIds().split("-"));
            if (!memberIds.contains(String.valueOf(userId))) {
                throw new CustomException("Người dùng không phải là thành viên của nhóm", HttpStatus.BAD_REQUEST);
            }
            groups.setMemberIds(String.join("-", memberIds.stream().filter(memberId -> !memberId.equals(String.valueOf(userId))).toList()));
        }
        if (groups.getRequestIds() != null && !groups.getRequestIds().isEmpty()) {
            List<String> requestIds = Arrays.asList(groups.getRequestIds().split("-"));
            groups.setRequestIds(String.join("-", requestIds.stream().filter(requestId -> !requestId.equals(String.valueOf(userId))).toList()));
        }
        accountsAdapter.createNotification(NotificationsDto.builder()
                                                           .type("ALERT")
                                                           .imageUrl(groups.getImageUrl())
                                                           .title("Rời nhóm " + groups.getName())
                                                           .description("Bạn đã rời khỏi nhóm " + groups.getName())
                                                           .linkId(groups.getId())
                                                           .userId(userId)
                                                           .senderId(groups.getAuthorId())
                                                           .build());

        return convertToResponse(groupsRepository.save(groups), userId);
    }

    @Override
    public void deleteUser(Long userId) {
        List<Groups> groups = groupsRepository.findByAuthorId(userId);
        if (groups != null && !groups.isEmpty()) {
            groups.forEach(groupsRepository::delete);
        }
    }

    private GroupsDto convertToResponse(Groups groups, Long userId) {
        GroupsDto groupsDto = GroupsMapper.mapToGroupsDto(groups);
        AccountsDto author = accountsAdapter.getAccount(groups.getAuthorId());
        groupsDto.setAuthor(author);
        groupsDto.setJoined("NOT_JOINED");

        List<AccountsDto> requests = new ArrayList<>();

        if (groups.getRequestIds() != null && !groups.getRequestIds().isEmpty()) {
            Arrays.stream(groups.getRequestIds().split("-")).forEach(requestId -> {
                AccountsDto request = accountsAdapter.getAccount(Long.valueOf(requestId));
                requests.add(request);
            });
        }
        groupsDto.setRequests(requests);

        List<AccountsDto> members = new ArrayList<>();
        if (groups.getMemberIds() != null && !groups.getMemberIds().isEmpty()) {
            Arrays.stream(groups.getMemberIds().split("-")).forEach(memberId -> {
                AccountsDto member = accountsAdapter.getAccount(Long.valueOf(memberId));
                members.add(member);
            });
        }
        groupsDto.setMembers(members);

        // set is joined
        if (groups.getMemberIds() != null && !groups.getMemberIds().isEmpty()) {
            List<String> memberIds = Arrays.asList(groups.getMemberIds().split("-"));
            groupsDto.setJoined(memberIds.contains(String.valueOf(userId)) ? "JOINED" : groupsDto.getJoined());
        }

        if (groups.getRequestIds() != null && !groups.getRequestIds().isEmpty()) {
            List<String> requestIds = Arrays.asList(groups.getRequestIds().split("-"));
            groupsDto.setJoined(requestIds.contains(String.valueOf(userId)) ? "REQUESTED" : groupsDto.getJoined());
        }

        return groupsDto;
    }

    private StatementsDto convertToStatementResponse(Statements statements) {
        StatementsDto statementsDto = StatementsDto.builder()
                                                   .id(statements.getId())
                                                   .description(statements.getDescription())
                                                   .groupId(statements.getGroupId())
                                                   .createdDate(statements.getCreatedDate())
                                                   .build();
        AccountsDto user = accountsAdapter.getAccount(statements.getUserId());
        statementsDto.setUser(user);
        return statementsDto;
    }
}
