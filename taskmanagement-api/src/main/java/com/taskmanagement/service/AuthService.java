package com.taskmanagement.service;

import com.taskmanagement.dto.request.LoginRequest;
import com.taskmanagement.dto.request.RegisterRequest;
import com.taskmanagement.dto.response.AuthResponse;
import com.taskmanagement.entity.Role;
import com.taskmanagement.entity.User;
import com.taskmanagement.entity.PasswordResetToken;
import com.taskmanagement.repository.UserRepository;
import com.taskmanagement.repository.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user with USER role by default
        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(Role.USER)  // Default role
                .build();

        userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {

        var user = userRepository.findByUsernameOrEmail(request.getUsername(),request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!user.isAccountNonLocked()){
            if(user.getLockTime().plusMinutes(30).isBefore(LocalDateTime.now())){
                user.setAccountNonLocked(true);
                user.setFailedAttempts(0);
                userRepository.save(user);
            }else{
                throw new RuntimeException("Account is locked due to 5 failed attempts. Please try again after 30 minutes.");
            }
        }

        try{
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
            resetFailedAttempts(user);
        } catch (BadCredentialsException e) {
            increaseFailedAttempts(user);
            throw new BadCredentialsException("Invalid username or password");
        }

        var jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    @Transactional
    public void increaseFailedAttempts(User user){
        int newFailedAttempts=user.getFailedAttempts()+1;
        user.setFailedAttempts(newFailedAttempts);

        if(newFailedAttempts>=5){
            user.setAccountNonLocked(false);
            user.setLockTime(LocalDateTime.now());
        }

        userRepository.save(user);
    }

    @Transactional
    public void resetFailedAttempts(User user){
        user.setFailedAttempts(0);

        userRepository.save(user);
    }

    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        System.out.println("user------->"+user);
        // Clean up any old tokens
        passwordResetTokenRepository.deleteByUser(user);
        // Create new token (valid for 15 minutes)
        String token = UUID.randomUUID().toString();
        System.out.println("token------->"+token);
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDateTime(LocalDateTime.now().plusMinutes(15))
                .build();
        System.out.println("resetToken------->"+resetToken);
        passwordResetTokenRepository.save(resetToken);
        // MOCK EMAIL: In a real app, we would send an email here.
        // For now, we log the link to the console so you can copy it for testing.
        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        System.out.println("DEBUG: Password Reset Link: " + resetLink);

        emailService.sendEmail(
                user.getEmail(),
                "Password Reset Request",
                "Click the link to reset your password: " + resetLink
        );
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired password reset token"));
        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken);
            throw new RuntimeException("Token has expired. Please request a new one.");
        }
        // Update user password
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        // Delete token after successful use
        passwordResetTokenRepository.delete(resetToken);
    }
}