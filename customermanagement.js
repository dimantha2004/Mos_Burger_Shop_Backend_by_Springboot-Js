document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    const backendBaseUrl = "http://localhost:8080";

    const customerManagementBtn = document.getElementById("customer-management-btn");
    const customerManagementSection = document.getElementById("customer-management");
    const appContentSection = document.getElementById("app-content");
    const backToAppBtn = document.getElementById("back-to-app-from-customer-btn");

    const customerPhoneForm = document.getElementById("customer-phone-form");
    const updateCustomerForm = document.getElementById("update-customer-form");
    const deleteCustomerBtn = document.getElementById("delete-customer-btn");
    const addCustomerForm = document.getElementById("add-customer-form");

    let currentCustomerId = null;

    // Show Customer Management Section and Hide App Content
    if (customerManagementBtn && customerManagementSection && appContentSection) {
        customerManagementBtn.addEventListener("click", function () {
            console.log("Customer Management button clicked");
            customerManagementSection.style.display = "block";
            appContentSection.style.display = "none";
        });
    }

    // Show App Content and Hide Customer Management Section
    if (backToAppBtn && appContentSection && customerManagementSection) {
        backToAppBtn.addEventListener("click", function () {
            console.log("Back to App button clicked");
            appContentSection.style.display = "block";
            customerManagementSection.style.display = "none";
        });
    }

    // Handle Customer Phone Form Submission
    if (customerPhoneForm) {
        customerPhoneForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            console.log("Customer Phone form submitted");

            const phoneNumber = document.getElementById("customer-phone").value;

            if (!phoneNumber) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Please enter a phone number.',
                });
                return;
            }

            try {
                const customer = await fetchData(`/api/Customer/searchByPhone/${phoneNumber}`, 'GET');
                if (customer) {
                    currentCustomerId = customer.id;
                    document.getElementById("update-customer-name").value = customer.name;
                    document.getElementById("update-customer-phone").value = customer.phoneNumber;
                    document.getElementById("update-customer-address").value = customer.address;
                    updateCustomerForm.style.display = "block";
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Customer not found.',
                    });
                }
            } catch (error) {
                console.error('Error fetching customer:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch customer. Please try again.',
                });
            }
        });
    }

    // Handle Update Customer Form Submission
    if (updateCustomerForm) {
        updateCustomerForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            console.log("Update Customer form submitted");

            const updatedCustomer = {
                id: currentCustomerId,
                name: document.getElementById("update-customer-name").value,
                phoneNumber: document.getElementById("update-customer-phone").value,
                address: document.getElementById("update-customer-address").value,
            };

            console.log("Updated Customer Data:", updatedCustomer);

            try {
                const response = await fetchData("/api/Customer/update", 'PUT', updatedCustomer);
                console.log("Backend Response:", response);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Customer updated successfully!',
                });
                updateCustomerForm.reset();
                updateCustomerForm.style.display = "none"; // Hide the update form
            } catch (error) {
                console.error('Error updating customer:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to update customer. Please try again.',
                });
            }
        });
    }

    // Handle Delete Customer Button Click
    if (deleteCustomerBtn) {
        deleteCustomerBtn.addEventListener("click", async function () {
            console.log("Delete Customer button clicked");

            if (!currentCustomerId) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No customer selected.',
                });
                return;
            }

            const { isConfirmed } = await Swal.fire({
                icon: 'warning',
                title: 'Are you sure?',
                text: 'Are you sure you want to delete this customer?',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel',
            });

            if (isConfirmed) {
                try {
                    const response = await fetchData(`/api/Customer/delete/${currentCustomerId}`, 'DELETE');
                    console.log("Backend Response:", response);
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Customer deleted successfully!',
                    });
                    updateCustomerForm.reset();
                    updateCustomerForm.style.display = "none";
                    currentCustomerId = null;
                } catch (error) {
                    console.error('Error deleting customer:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to delete customer. Please try again.',
                    });
                }
            }
        });
    }

    // Handle Add Customer Form Submission
    if (addCustomerForm) {
        addCustomerForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            console.log("Add Customer form submitted");

            const newCustomer = {
                name: document.getElementById("add-customer-name").value,
                phoneNumber: document.getElementById("add-customer-phone").value,
                address: document.getElementById("add-customer-address").value,
            };

            console.log("New Customer Data:", newCustomer);

            try {
                const response = await fetchData("/api/Customer/add", 'POST', newCustomer);
                console.log("Backend Response:", response);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Customer added successfully!',
                });
                addCustomerForm.reset();
            } catch (error) {
                console.error('Error adding customer:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to add customer. Please try again.',
                });
            }
        });
    }

    // Fetch Data Utility Function
    async function fetchData(endpoint, method, body = null) {
        const url = `${backendBaseUrl}${endpoint}`;

        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : null,
        };

        console.log("Sending request to:", url);
        console.log("Request options:", options);

        try {
            const response = await fetch(url, options);
            console.log("Response status:", response.status);

            const responseText = await response.text();
            console.log("Raw response text:", responseText);

            if (!response.ok) {
                console.error("Error response:", responseText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
            }

            try {
                const responseData = JSON.parse(responseText);
                console.log("Response data:", responseData);
                return responseData;
            } catch (e) {
                console.log("Response is not JSON, returning raw text:", responseText);
                return responseText;
            }
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }
});