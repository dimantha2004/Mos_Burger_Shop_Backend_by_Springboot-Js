document.addEventListener("DOMContentLoaded", function () {
    let cart = [];

    window.addToCart = function (productName, productPrice, productQuantity) {
        const existingItem = cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity += productQuantity;
            existingItem.price += productPrice * productQuantity;
        } else {
            cart.push({ name: productName, price: productPrice * productQuantity, quantity: productQuantity });
        }
        updateCart();
        Swal.fire({
            icon: 'success',
            title: 'Added to Cart',
            text: `${productName} (Quantity: ${productQuantity}) has been added to the cart!`,
        });
    };

    function updateCart() {
        const cartItemsList = document.getElementById("cart-items");
        const totalElement = document.getElementById("total");
        cartItemsList.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            const li = document.createElement("li");
            li.textContent = `${item.name} - Rs: ${item.price.toFixed(2)} (Quantity: ${item.quantity})`;

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.classList.add("remove-btn");
            removeButton.addEventListener("click", () => removeFromCart(index));
            li.appendChild(removeButton);
            cartItemsList.appendChild(li);
            total += item.price;
        });

        totalElement.textContent = `Total: Rs: ${total.toFixed(2)}`;
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCart();
    }

    document.getElementById("clear-cart-btn")?.addEventListener("click", () => {
        cart = [];
        updateCart();
    });

    async function updateProductQuantities(productName, quantity) {
        try {
            
            const product = await fetchData(`/api/product/getByName?name=${productName}`, 'GET');
            if (!product) {
                console.error('Product not found:', productName);
                throw new Error(`Product "${productName}" not found.`);
            }

            const updatedQuantity = product.quantity - quantity;
            if (updatedQuantity < 0) {
                console.error('Insufficient quantity for:', productName);
                throw new Error(`Insufficient quantity for "${productName}".`);
            }

            const response = await fetchData(`/api/product/update/${product.id}`, 'PUT', { quantity: updatedQuantity });
            console.log('Product quantity updated successfully:', response);
            return response;
        } catch (error) {
            console.error('Error updating product quantity:', error);
            throw error; 
        }
    }

    document.getElementById("checkout-btn")?.addEventListener("click", async () => {
        
        if (cart.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Your cart is empty. Add some products before checking out.',
            });
            return;
        }

        const { value: phoneNumber, isConfirmed: phoneEntered } = await Swal.fire({
            title: 'Enter Phone Number',
            input: 'tel',
            inputLabel: 'Your phone number',
            inputPlaceholder: 'Enter your phone number',
            showCancelButton: true,
            validationMessage: 'Phone number is required to proceed',
        });

        if (!phoneEntered || !phoneNumber || phoneNumber.trim() === "") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Phone number is required to proceed with the checkout.',
            });
            return;
        }

        let customer; 
        try {
            
            customer = await fetchData(`/api/Customer/searchByPhone/${phoneNumber}`, 'GET');

            if (!customer) {
                Swal.fire({
                    icon: 'error',
                    title: 'Customer Not Found',
                    text: 'Did not find any customer with the provided phone number. Please add a new customer.',
                });
                return;
            }
        } catch (error) {

            if (error.message === 'Not Found') {
                Swal.fire({
                    icon: 'error',
                    title: 'Customer Not Found',
                    text: 'Did not find any customer with the provided phone number. Please add a new customer.',
                });
            } else {

                console.error('Error fetching customer:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Verification Failed',
                    text: 'Failed to retrieve customer information. Please try again.',
                });
            }
            return;
        }

        const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

        const confirmPayment = await Swal.fire({
            title: 'Confirm Payment',
            html: `<p>Customer: ${customer.name}</p>
                   <p>Total Amount: Rs: ${totalAmount.toFixed(2)}</p>
                   <p>Items: ${cart.length}</p>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Proceed to Payment',
            cancelButtonText: 'Cancel',
        });

        if (!confirmPayment.isConfirmed) {
            return;
        }

        Swal.fire({
            title: 'Processing Order',
            text: 'Please wait while we process your order.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        const orderData = {
            phonenumber: phoneNumber,
            totalPrice: totalAmount,
            orderDate: new Date().toISOString(),
            items: cart.map(item => ({
                productName: item.name,
                quantity: item.quantity,
                price: item.price,
            })),
        };

        try {
            const response = await fetchData("/api/Order/add", 'POST', orderData);
            console.log('Order saved successfully:', response);

            const inventoryPromises = cart.map(item =>
                updateProductQuantities(item.name, item.quantity)
                    .catch(err => {
                        console.error(`Failed to update quantity for ${item.name}:`, err);
                        return null;
                    })
            );

            await Promise.allSettled(inventoryPromises);

            try {
                console.log("Attempting to generate receipt...");
                generateReceipt(phoneNumber, cart, totalAmount, customer.name);
            } catch (receiptError) {
                console.warn('Receipt generation failed:', receiptError);
                Swal.fire({
                    icon: 'error',
                    title: 'Receipt Failed',
                    text: 'Failed to generate the receipt. Please try again.',
                });
            }

            cart = [];
            updateCart();

            Swal.fire({
                icon: 'success',
                title: 'Order Placed!',
                html: `<p>Thank you for your purchase!</p>
                       <p>Your order has been successfully placed.</p>
                       <p>Total: Rs: ${totalAmount.toFixed(2)}</p>`,
            });
        } catch (orderError) {
            console.error('Error saving order:', orderError);
            Swal.fire({
                icon: 'error',
                title: 'Order Failed',
                text: 'Failed to place the order. Please try again.',
            });
        }
    });

    updateCart();
});

async function fetchData(endpoint, method, data = null) {
    const backendBaseUrl = "http://localhost:8080";
    const url = `${backendBaseUrl}${endpoint}`;

    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);

        if (response.status === 404) {
            throw new Error('Not Found');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        } else {
            return response.text();
        }
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; 
    }
}
