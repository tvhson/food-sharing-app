package com.happyfood.accounts.service.impl;

import com.happyfood.accounts.dto.AccountsDto;
import com.happyfood.accounts.dto.AccountsMsgDto;
import com.happyfood.accounts.entity.Accounts;
import com.happyfood.accounts.entity.PasswordResetToken;
import com.happyfood.accounts.exception.CustomException;
import com.happyfood.accounts.mapper.AccountsMapper;
import com.happyfood.accounts.repository.AccountsRepository;
import com.happyfood.accounts.repository.PasswordResetTokenRepository;
import com.happyfood.accounts.service.EmailService;
import com.happyfood.accounts.service.IAccountsService;
import com.happyfood.accounts.service.client.PostsFeginClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AccountsServiceImpl implements IAccountsService {
    private final AccountsRepository accountsRepository;
//    private final StreamBridge streamBridge;
    private final PasswordEncoder passwordEncoder;
    private final PostsFeginClient postsFeginClient;
    private final EmailService emailService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Override
    public AccountsDto createAccount(AccountsDto accountsDto) {
        if (accountsRepository.existsByEmail(accountsDto.getEmail())) {
            throw new CustomException("Email này đã tồn tại", HttpStatus.BAD_REQUEST);
        }

        Accounts accounts = AccountsMapper.mapToAccounts(accountsDto);
        accounts.setPassword(passwordEncoder.encode(accounts.getPassword()));
        accounts.setRole("USER");
        accounts.setStatus("ACTIVE");
        accounts.setCreatedDate(new Date());
        accounts.setIsVegan(false);
        accounts.setIsChosenTag(false);
        accounts.setImageUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFzJq86PEV6gvN_r4_iHIxFyjzo73j0a4bRQ&s");
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
                .orElseThrow(() -> new CustomException("Không tìm thấy tài khoản", HttpStatus.NOT_FOUND));
        return AccountsMapper.mapToAccountsDto(accounts);
    }

    @Override
    public AccountsDto authentication(String email, String password) {
        Accounts accounts = accountsRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("Tài khoản không chính xác", HttpStatus.NOT_FOUND));

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
                .orElseThrow(() -> new CustomException("Không tìm thấy tài khoản", HttpStatus.NOT_FOUND));
        accounts.setStatus("BANNED");
        accounts.setBannedDate(new Date(System.currentTimeMillis() + days * 24 * 60 * 60 * 1000));

        postsFeginClient.deleteUser(accountId);
        postsFeginClient.deleteUserGr(accountId);

        return AccountsMapper.mapToAccountsDto(accountsRepository.save(accounts));
    }


    @Override
    public AccountsDto updateAccount(Long accountId, AccountsDto accountsDto) {
        Accounts accounts = accountsRepository.findById(accountId)
                .orElseThrow(() -> new CustomException("Không tìm thấy tài khoản", HttpStatus.NOT_FOUND));
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
        accounts.setIsVegan(accountsDto.getIsVegan());
        accounts.setIsChosenTag(accountsDto.getIsChosenTag());

        accounts = accountsRepository.save(accounts);
        return AccountsMapper.mapToAccountsDto(accounts);
    }

    @Override
    public void changePassword(Long accountId,String oldPassword, String newPassword) {
        Accounts accounts = accountsRepository.findById(accountId)
                .orElseThrow(() -> new CustomException("Không tìm thấy tài khoản", HttpStatus.NOT_FOUND));

        if (newPassword.length() < 6) {
            throw new CustomException("Mật khẩu phải ít nhất 6 ký tự", HttpStatus.BAD_REQUEST);
        }

        if (!passwordEncoder.matches(oldPassword, accounts.getPassword())) {
            throw new CustomException("Mật khẩu không khớp", HttpStatus.BAD_REQUEST);
        }

        accounts.setPassword(passwordEncoder.encode(newPassword));
        accounts = accountsRepository.save(accounts);
    }

    @Override
    public void changeRole(Long accountId, String role) {
        Accounts accounts = accountsRepository.findById(accountId)
                .orElseThrow(() -> new CustomException("Không tìm thấy tài khoản", HttpStatus.NOT_FOUND));
        accounts.setRole(role);
        accountsRepository.save(accounts);
    }

    @Override
    public AccountsDto getAccountByEmail(String email) {
        Accounts accounts = accountsRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("Không tìm thấy tài khoản", HttpStatus.NOT_FOUND));
        return AccountsMapper.mapToAccountsDto(accounts);
    }

    @Override
    public void forgotPassword(String email) {
        Accounts accounts = accountsRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("Không tìm thấy tài khoản với email này", HttpStatus.NOT_FOUND));

        passwordResetTokenRepository.findByEmail(email).ifPresent(passwordResetTokenRepository::delete);

        String otp = generateOTP();
        PasswordResetToken token = new PasswordResetToken();
        token.setEmail(email);
        token.setOtp(otp);
        token.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        passwordResetTokenRepository.save(token);
        emailService.sendOTPEmail(email, otp);
    }

    @Override
    public void verifyOtp(String email, String otp) {
        PasswordResetToken token = passwordResetTokenRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("Không tìm thấy token cho email này", HttpStatus.NOT_FOUND));
        if (token.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new CustomException("Token đã hết hạn", HttpStatus.BAD_REQUEST);
        }
        if (!token.getOtp().equals(otp)) {
            throw new CustomException("Mã OTP không chính xác", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public void resetPassword(String email, String newPassword) {
        Accounts accounts = accountsRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("Không tìm thấy tài khoản với email này", HttpStatus.NOT_FOUND));

        accounts.setPassword(passwordEncoder.encode(newPassword));
        accountsRepository.save(accounts);
    }

    public String generateOTP() {
        int otpLength = 6;
        String numbers = "0123456789";
        Random random = new SecureRandom();
        StringBuilder otp = new StringBuilder(otpLength);

        for (int i = 0; i < otpLength; i++) {
            otp.append(numbers.charAt(random.nextInt(numbers.length())));
        }
        return otp.toString();
    }
}
