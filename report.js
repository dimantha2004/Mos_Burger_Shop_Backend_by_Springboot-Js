document.addEventListener("DOMContentLoaded", function () {
document.getElementById("report-btn")?.addEventListener("click", async () => {
        try {
           
            const orders = await fetchData("/api/Order/getAll", 'GET');
            console.log("Fetched orders:", orders);

            
            const sortedOrders = orders.sort((a, b) => {
                
                const dateA = a.orderDate ? new Date(a.orderDate).getTime() : a.id;
                const dateB = b.orderDate ? new Date(b.orderDate).getTime() : b.id;
                return dateB - dateA; 
            });

            displayOrdersReportInNewTab(sortedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Load Orders',
                text: 'Unable to fetch the orders report. Please try again later.',
            });
        }
    });

    function displayOrdersReportInNewTab(orders) {
        
        const htmlContent = `
            <html>
                <head>
                    <title>Orders Report</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                        tr:nth-child(even) {
                            background-color: #f9f9f9;
                        }
                        tr:hover {
                            background-color: #f1f1f1;
                        }
                    </style>
                </head>
                <body>
                    <h1>Orders Report</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Order Date</th>
                                <th>Phone Number</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orders
                                .map(
                                    (order) => `
                                <tr>
                                    <td>${order.id}</td>
                                    <td>${order.orderDate || "NULL"}</td>
                                    <td>${order.phonenumber || "NULL"}</td>
                                    <td>${order.totalPrice || "NULL"}</td>
                                </tr>
                            `
                                )
                                .join("")}
                        </tbody>
                    </table>
                </body>
            </html>
        `;

        const blob = new Blob([htmlContent], { type: "text/html" });

        const url = URL.createObjectURL(blob);

        window.open(url, "_blank");

        URL.revokeObjectURL(url);
    }
});