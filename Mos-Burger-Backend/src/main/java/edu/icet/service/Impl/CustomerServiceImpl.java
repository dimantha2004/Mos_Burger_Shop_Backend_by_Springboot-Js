package edu.icet.service.Impl;

import edu.icet.dto.CustomerDTO;
import edu.icet.entity.CustomerEntity;
import edu.icet.repository.CustomerRepository;
import edu.icet.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    final CustomerRepository customerRepository;

    @Override
    public void addCustomer(CustomerDTO customerDTO) {
        CustomerEntity customerEntity = new CustomerEntity();
        customerEntity.setName(customerDTO.getName());
        customerEntity.setPhoneNumber(customerDTO.getPhoneNumber());
        customerEntity.setAddress(customerDTO.getAddress());
        customerRepository.save(customerEntity);
    }

    @Override
    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(entity -> new CustomerDTO(
                        entity.getId(),
                        entity.getName(),
                        entity.getPhoneNumber(),
                        entity.getAddress()))
                .toList();
    }

    @Override
    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    @Override
    public void updateCustomer(CustomerDTO customerDTO) {
        Optional<CustomerEntity> optionalCustomer = customerRepository.findById(customerDTO.getId());
        if (optionalCustomer.isPresent()) {
            CustomerEntity customerEntity = optionalCustomer.get();
            customerEntity.setName(customerDTO.getName());
            customerEntity.setPhoneNumber(customerDTO.getPhoneNumber());
            customerEntity.setAddress(customerDTO.getAddress());
            customerRepository.save(customerEntity);
        } else {
            throw new RuntimeException("Customer not found with id: " + customerDTO.getId());
        }
    }

    @Override
    public CustomerDTO searchCustomerById(Long id) {
        return customerRepository.findById(id)
                .map(entity -> new CustomerDTO(
                        entity.getId(),
                        entity.getName(),
                        entity.getPhoneNumber(),
                        entity.getAddress()))
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    }
    @Override
    public CustomerDTO searchCustomerByPhoneNumber(String phoneNumber) {
        Optional<CustomerEntity> optionalCustomer = customerRepository.findByPhoneNumber(phoneNumber);
        if (optionalCustomer.isPresent()) {
            CustomerEntity customerEntity = optionalCustomer.get();
            return new CustomerDTO(
                    customerEntity.getId(),
                    customerEntity.getName(),
                    customerEntity.getPhoneNumber(),
                    customerEntity.getAddress()
            );
        } else {
            throw new RuntimeException("Customer not found with phone number: " + phoneNumber);
        }
    }
}