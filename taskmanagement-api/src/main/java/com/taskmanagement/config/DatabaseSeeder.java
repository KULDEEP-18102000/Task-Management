package com.taskmanagement.config;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.taskmanagement.entity.User;
import com.taskmanagement.entity.Role;
import com.taskmanagement.repository.UserRepository;

@Component
public class DatabaseSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository,PasswordEncoder passwordEncoder){
        this.userRepository=userRepository;
        this.passwordEncoder=passwordEncoder;
    }

    @Override
    public void run(String ...args){
        if(userRepository.findByUsername("admin").isEmpty()){
            User admin=new User();
            admin.setUsername("admin");
            admin.setEmail("admin@taskmanager.com");
            admin.setFullName(("Super Admin"));
            admin.setPassword(passwordEncoder.encode(("admin123")));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("✅ Default Admin user created: admin / admin123");
        }else{
            System.out.println("ℹ️ Admin user already exists. Skipping seeding.");
        }
    }
}
