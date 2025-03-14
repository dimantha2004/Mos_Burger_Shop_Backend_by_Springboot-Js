package edu.icet.service;

import edu.icet.dto.ProductDTO;
import java.util.List;

public interface ProductService {
    void addProduct(ProductDTO productDTO);
    List<ProductDTO> getAllProducts();
    void deleteProduct(Long id);
    void updateProduct(ProductDTO productDTO);
    ProductDTO getProductById(Long id);
    List<ProductDTO> getProductsByCategory(String category);
    ProductDTO getProductByName(String name); // Return ProductDTO instead of Product
}