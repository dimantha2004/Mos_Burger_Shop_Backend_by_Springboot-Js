document.addEventListener("DOMContentLoaded", function () {
    const backendBaseUrl = "http://localhost:8080";

    const productManagementBtn = document.getElementById("product-management-btn");
    const productManagementSection = document.getElementById("product-management");
    const appContentSection = document.getElementById("app-content");
    const backToAppBtn = document.getElementById("back-to-app-from-product-btn");

    if (productManagementBtn && productManagementSection && appContentSection) {
        productManagementBtn.addEventListener("click", function () {
            productManagementSection.style.display = "block";
            appContentSection.style.display = "none"; 
        });
    }

    if (backToAppBtn && appContentSection && productManagementSection) {
        backToAppBtn.addEventListener("click", function () {
            appContentSection.style.display = "block"; 
            productManagementSection.style.display = "none"; 
        });
    }

    const productIdForm = document.getElementById("product-id-form");
    const updateProductForm = document.getElementById("update-product-form");
    const deleteProductBtn = document.getElementById("delete-product-btn");

    let currentProductId = null;

    const searchProductBtn = document.getElementById("search-product-btn");
    if (searchProductBtn) {
        searchProductBtn.textContent = "Search"; 
    }
 
    if (productIdForm) {
        productIdForm.addEventListener("submit", async function (e) {
            e.preventDefault(); 

            const productId = document.getElementById("product-id").value;

            if (!productId) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please enter a product ID.',
                });
                return;
            }

            try {
                const product = await fetchData(`/api/product/get/${productId}`, 'GET');
                if (product) {
                    currentProductId = product.id; 
                    document.getElementById("update-photo-link").value = product.photoLink;
                    document.getElementById("update-product-name").value = product.productName;
                    document.getElementById("update-product-price").value = product.productPrice;
                    document.getElementById("update-product-quantity").value = product.quantity;
                    document.getElementById("update-product-category").value = product.category; 
                    updateProductForm.style.display = "block"; 
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Product not found.',
                    });
                }
            } catch (error) {
                console.error('Error fetching product:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to fetch product. Please try again.',
                });
            }
        });
    }

    if (updateProductForm) {
        updateProductForm.addEventListener("submit", async function (e) {
            e.preventDefault(); 

            const updatedProduct = {
                id: currentProductId,
                photoLink: document.getElementById("update-photo-link").value,
                productName: document.getElementById("update-product-name").value,
                productPrice: parseFloat(document.getElementById("update-product-price").value),
                quantity: parseInt(document.getElementById("update-product-quantity").value, 10),
                category: document.getElementById("update-product-category").value, 
            };

            console.log('Updating product:', updatedProduct);

            try {
                const response = await fetchData("/api/product/update", 'PUT', updatedProduct);
                if (response) {
                    console.log('Update response:', response); 
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Product updated successfully!',
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Product updated successfully! (No response from server)',
                    });
                }
            } catch (error) {
                console.error('Error updating product:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to update product. Please try again.',
                });
            }
        });
    }

    if (deleteProductBtn) {
        deleteProductBtn.addEventListener("click", async function () {
            if (!currentProductId) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No product selected.',
                });
                return;
            }

            const confirmDelete = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (confirmDelete.isConfirmed) {
                console.log('Deleting product with ID:', currentProductId); 

                try {
                    const response = await fetchData(`/api/product/delete/${currentProductId}`, 'DELETE');
                    if (response) {
                        console.log('Delete response:', response); 
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Product deleted successfully!',
                        });
                    } else {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Product deleted successfully! (No response from server)',
                        });
                    }
                    updateProductForm.reset();
                    updateProductForm.style.display = "none"; 
                } catch (error) {
                    console.error('Error deleting product:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Failed to delete product. Please try again.',
                    });
                }
            }
        });
    }

    async function fetchData(endpoint, method, body = null) {
        try {
            const response = await fetch(`${backendBaseUrl}${endpoint}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body ? JSON.stringify(body) : null,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseText = await response.text(); 
            console.log('Raw response:', responseText);

            return JSON.parse(responseText); 
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }
});