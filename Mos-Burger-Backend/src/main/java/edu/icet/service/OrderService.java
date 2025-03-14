package edu.icet.service;

import edu.icet.dto.Order;

import java.util.List;

public interface OrderService {
    void addOrder(Order order);
    List<Order> getAllOrders();
    void deleteOrder(Integer id);
    void updateOrder(Order order);
    Order searchOrderById(Integer id);
}