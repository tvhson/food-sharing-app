package com.happyfood.accounts.service.impl;

import com.happyfood.accounts.dto.AccountsDto;
import com.happyfood.accounts.dto.AccountsMsgDto;
import com.happyfood.accounts.entity.Accounts;
import com.happyfood.accounts.exception.CustomException;
import com.happyfood.accounts.mapper.AccountsMapper;
import com.happyfood.accounts.repository.AccountsRepository;
import com.happyfood.accounts.service.IAccountsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountsServiceImpl implements IAccountsService {
    private final AccountsRepository accountsRepository;
//    private final StreamBridge streamBridge;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AccountsDto createAccount(AccountsDto accountsDto) {
        if (accountsRepository.existsByEmail(accountsDto.getEmail())) {
            throw new CustomException("Account already exists", HttpStatus.BAD_REQUEST);
        }

        Accounts accounts = AccountsMapper.mapToAccounts(accountsDto);
        accounts.setPassword(passwordEncoder.encode(accounts.getPassword()));
        accounts.setRole("USER");
        accounts.setStatus("ACTIVE");
        accounts.setCreatedDate(new Date());
        accounts = accountsRepository.save(accounts);
//        sendCommunication(accounts);
        return AccountsMapper.mapToAccountsDto(accounts);
    }

    @Override
    public List<AccountsDto> getAllAccounts() {
        List<Accounts> accounts = accountsRepository.findAll();
        return accounts.stream().map(AccountsMapper::mapToAccountsDto).toList();
    }

//    private void sendCommunication(Accounts account) {
//        var accountsMsgDto = new AccountsMsgDto(account.getId(), account.getName(),
//                account.getEmail(), account.getPhone());
//        var result = streamBridge.send("sendCommunication-out-0", accountsMsgDto);
//    }

    @Override
    public AccountsDto getAccount(Long accountId) {
        Accounts accounts = accountsRepository.findById(accountId)
                .orElseThrow(() -> new CustomException("Account not found", HttpStatus.NOT_FOUND));
        return AccountsMapper.mapToAccountsDto(accounts);
    }

    @Override
    public AccountsDto authentication(String email, String password) {
        Accounts accounts = accountsRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("Account not found", HttpStatus.NOT_FOUND));

        if (accounts.getBannedDate() != null && accounts.getBannedDate().before(new Date())) {
            accounts.setStatus("ACTIVE");
            accounts.setBannedDate(null);
            accounts = accountsRepository.save(accounts);
        }

        if (passwordEncoder.matches(password, accounts.getPassword())) {
            return AccountsMapper.mapToAccountsDto(accounts);
        }
        return null;
    }

    @Override
    public AccountsDto banAccount(Long accountId, Long days) {
        Accounts accounts = accountsRepository.findById(accountId)
                .orElseThrow(() -> new CustomException("Account not found", HttpStatus.NOT_FOUND));
        accounts.setStatus("BANNED");
        accounts.setBannedDate(new Date(System.currentTimeMillis() + days * 24 * 60 * 60 * 1000));

        return AccountsMapper.mapToAccountsDto(accountsRepository.save(accounts));
    }


    @Override
    public AccountsDto updateAccount(Long accountId, AccountsDto accountsDto) {
        Accounts accounts = accountsRepository.findById(accountId)
                .orElseThrow(() -> new CustomException("Account not found", HttpStatus.NOT_FOUND));
        accounts.setName(accountsDto.getName());
        accounts.setPhone(accountsDto.getPhone());
        accounts.setDescription(accountsDto.getDescription());
        accounts.setLocationName(accountsDto.getLocationName());
        accounts.setLatitude(accountsDto.getLatitude());
        accounts.setLongitude(accountsDto.getLongitude());
        accounts.setStatus(accountsDto.getStatus());
        accounts.setBirthDate(accountsDto.getBirthDate());
        accounts.setImageUrl(accountsDto.getImageUrl());
        accounts.setBannedDate(accountsDto.getBannedDate());

        accounts = accountsRepository.save(accounts);
        return AccountsMapper.mapToAccountsDto(accounts);
    }

    @Override
    public void changePassword(Long accountId,String oldPassword, String newPassword) {
        Accounts accounts = accountsRepository.findById(accountId)
                .orElseThrow(() -> new CustomException("Account not found", HttpStatus.NOT_FOUND));

        if (newPassword.length() < 6) {
            throw new CustomException("Password must be at least 6 characters long", HttpStatus.BAD_REQUEST);
        }

        if (!passwordEncoder.matches(oldPassword, accounts.getPassword())) {
            throw new CustomException("Old password is incorrect", HttpStatus.BAD_REQUEST);
        }

        accounts.setPassword(passwordEncoder.encode(newPassword));
        accounts = accountsRepository.save(accounts);
    }

    @Override
    public void changeRole(Long accountId, String role) {
        Accounts accounts = accountsRepository.findById(accountId)
                .orElseThrow(() -> new CustomException("Account not found", HttpStatus.NOT_FOUND));
        accounts.setRole(role);
        accountsRepository.save(accounts);
    }
}
