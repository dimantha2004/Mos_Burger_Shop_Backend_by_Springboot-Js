package edu.icet.service.Impl;

import edu.icet.dto.ProductDTO;
import edu.icet.entity.ProductEntity;
import edu.icet.repository.ProductRepository;
import edu.icet.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    @Override
    public void addProduct(ProductDTO productDTO) {
        ProductEntity productEntity = modelMapper.map(productDTO, ProductEntity.class);
        productRepository.save(productEntity);
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(entity -> modelMapper.map(entity, ProductDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public void updateProduct(ProductDTO productDTO) {
        ProductEntity productEntity = modelMapper.map(productDTO, ProductEntity.class);
        productRepository.save(productEntity);
    }

    @Override
    public ProductDTO getProductById(Long id) {
        return productRepository.findById(id)
                .map(entity -> modelMapper.map(entity, ProductDTO.class))
                .orElse(null);
    }

    @Override
    public List<ProductDTO> getProductsByCategory(String category) {
        return productRepository.findByCategory(category)
                .stream()
                .map(entity -> modelMapper.map(entity, ProductDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public ProductDTO getProductByName(String name) {
        System.out.println("Searching for product with name: " + name); // Debugging
        ProductEntity productEntity = productRepository.findByProductName(name);
        if (productEntity != null) {
            System.out.println("Product found: " + productEntity); // Debugging
            return modelMapper.map(productEntity, ProductDTO.class);
        }
        System.out.println("Product not found"); // Debugging
        return null;
    }
}