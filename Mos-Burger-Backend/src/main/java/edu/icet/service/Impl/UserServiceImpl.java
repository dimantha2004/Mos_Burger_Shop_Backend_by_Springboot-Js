package edu.icet.service.Impl;

import edu.icet.entity.User;
import edu.icet.repository.UserRepository;
import edu.icet.service.UserService;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void registerUser(User user) {
        String hashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
        user.setPassword(hashedPassword);
        userRepository.save(user);
    }

    @Override
    public boolean authenticateUser(String username, String password) {
        User user = userRepository.findByUsername(username).orElse(null);

        if (user != null && BCrypt.checkpw(password, user.getPassword())) {
            return true;
        }
        return false;
    }
}