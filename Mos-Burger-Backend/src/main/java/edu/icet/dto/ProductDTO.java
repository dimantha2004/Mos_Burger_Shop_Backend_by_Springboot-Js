package edu.icet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Long id; // For internal use
    private Integer productId; // For custom product IDs (e.g., P#001)
    private String photoLink;
    private String productName;
    private double productPrice;
    private int quantity;
    private String category;
}