package edu.icet.controller;

import edu.icet.dto.ProductDTO;
import edu.icet.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductManagementController {
    private final ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<String> addProduct(@RequestBody ProductDTO productDTO) {
        try {
            productService.addProduct(productDTO);
            return ResponseEntity.ok("{\"message\": \"Product added successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Error adding product\"}");
        }
    }

    @GetMapping("/getAll")
    public List<ProductDTO> getAllProducts(@RequestParam(required = false) String category) {
        if (category != null) {
            return productService.getProductsByCategory(category);
        }
        return productService.getAllProducts();
    }

    @GetMapping("/getByName")
    public ResponseEntity<?> getProductByName(@RequestParam String name) {
        try {
            ProductDTO product = productService.getProductByName(name);
            if (product != null) {
                return ResponseEntity.ok(product);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok("{\"message\": \"Product deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Error deleting product\"}");
        }
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateProduct(@RequestBody ProductDTO productDTO) {
        try {
            productService.updateProduct(productDTO);
            return ResponseEntity.ok("{\"message\": \"Product updated successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Error updating product\"}");
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        try {
            ProductDTO product = productService.getProductById(id);
            if (product != null) {
                return ResponseEntity.ok(product);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}