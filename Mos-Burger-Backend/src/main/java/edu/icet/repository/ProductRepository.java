package edu.icet.repository;

import edu.icet.entity.OrderItemEntity;
import edu.icet.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
    @Modifying
    @Transactional
    @Query("UPDATE ProductEntity p SET p.quantity = p.quantity - :quantity WHERE p.productName = :productName")
    void updateProductQuantity(@Param("productName") String productName, @Param("quantity") int quantity);

    List<ProductEntity> findByCategory(String category);

    ProductEntity findByProductName(String productName);
}