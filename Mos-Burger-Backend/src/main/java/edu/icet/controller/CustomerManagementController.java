package edu.icet.controller;

import edu.icet.dto.CustomerDTO;
import edu.icet.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Customer")
@CrossOrigin
@RequiredArgsConstructor
public class CustomerManagementController {

    final CustomerService customerService;

    @PostMapping("/add")
    public void addCustomer(@RequestBody CustomerDTO customerDTO) {
        customerService.addCustomer(customerDTO);
    }

    @GetMapping("/getAll")
    public List<CustomerDTO> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteCustomer(@PathVariable("id") Long id) {
        customerService.deleteCustomer(id);
    }

    @PutMapping("/update")
    public void updateCustomer(@RequestBody CustomerDTO customerDTO) {
        customerService.updateCustomer(customerDTO);
    }

    @GetMapping("/search/{id}")
    public CustomerDTO searchCustomerById(@PathVariable Long id) {
        return customerService.searchCustomerById(id);
    }
    @GetMapping("/searchByPhone/{phoneNumber}")
    public ResponseEntity<CustomerDTO> searchCustomerByPhoneNumber(@PathVariable String phoneNumber) {
        try {
            CustomerDTO customer = customerService.searchCustomerByPhoneNumber(phoneNumber);
            return ResponseEntity.ok(customer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}