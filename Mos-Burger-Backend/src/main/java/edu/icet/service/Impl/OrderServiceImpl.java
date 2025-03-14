package edu.icet.service.Impl;

import edu.icet.dto.Order;
import edu.icet.entity.OrderEntity;
import edu.icet.repository.OrderRepository;
import edu.icet.repository.ProductRepository;
import edu.icet.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    final OrderRepository repository;
    final ProductRepository productRepository; // Add this
    final ModelMapper modelMapper;

    @Override
    public void addOrder(Order order) {
        OrderEntity orderEntity = modelMapper.map(order, OrderEntity.class);
        orderEntity.setOrderDate(new Date()); // Set the current date and time
        repository.save(orderEntity);

        // Update product quantities
        for (var item : order.getItems()) {
            productRepository.updateProductQuantity(item.getProductName(), item.getQuantity());
        }
    }

    @Override
    public List<Order> getAllOrders() {
        List<Order> orderList = new ArrayList<>();
        List<OrderEntity> all = repository.findAll();

        all.forEach(orderEntity -> {
            orderList.add(modelMapper.map(orderEntity, Order.class));
        });
        return orderList;
    }

    @Override
    public void deleteOrder(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public void updateOrder(Order order) {
        repository.save(modelMapper.map(order, OrderEntity.class));
    }

    @Override
    public Order searchOrderById(Integer id) {
        Optional<OrderEntity> orderEntity = repository.findById(id);
        return orderEntity.map(entity -> modelMapper.map(entity, Order.class))
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }
}