package edu.icet.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import jakarta.persistence.Embeddable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Embeddable
public class OrderItemEntity {
    private String productName;
    private int quantity;
    private double price;
}