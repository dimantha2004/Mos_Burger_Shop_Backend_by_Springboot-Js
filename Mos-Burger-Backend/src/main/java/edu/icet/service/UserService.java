package edu.icet.service;


import edu.icet.entity.User;

public interface UserService {
    void registerUser(User userDTO);
    boolean authenticateUser(String username, String password);
}