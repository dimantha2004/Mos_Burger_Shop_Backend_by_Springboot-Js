package edu.icet.controller;

import edu.icet.dto.Order;
import edu.icet.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Order")
@CrossOrigin
@RequiredArgsConstructor
public class OrderManagementController {

    final OrderService orderService;

    @PostMapping("/add")
    public void addOrder(@RequestBody Order order) {
        orderService.addOrder(order);
    }

    @GetMapping("/getAll")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteOrder(@PathVariable("id") Integer id) {
        orderService.deleteOrder(id);
    }

    @PutMapping("/update")
    public void updateOrder(@RequestBody Order order) {
        orderService.updateOrder(order);
    }

    @GetMapping("/search/{id}")
    public Order searchOrderById(@PathVariable Integer id) {
        return orderService.searchOrderById(id);
    }
}