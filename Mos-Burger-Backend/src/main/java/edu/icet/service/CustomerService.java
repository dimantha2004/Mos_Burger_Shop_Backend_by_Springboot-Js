package edu.icet.service;

import edu.icet.dto.CustomerDTO;
import java.util.List;

public interface CustomerService {
    void addCustomer(CustomerDTO customerDTO);
    List<CustomerDTO> getAllCustomers();
    void deleteCustomer(Long id);
    void updateCustomer(CustomerDTO customerDTO);
    CustomerDTO searchCustomerById(Long id);
    CustomerDTO searchCustomerByPhoneNumber(String phoneNumber);
}