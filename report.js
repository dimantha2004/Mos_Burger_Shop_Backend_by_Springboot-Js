function displayReport() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    if (orders.length === 0) {
        alert("No orders available to display.");
        return;
    }

    const reportWindow = window.open('', '_blank');
    reportWindow.document.write('<h1>Orders Report</h1>');
    orders.forEach(order => {
        reportWindow.document.write(`
            <div>
                <h3>Order ID: ${order.id}</h3>
                <p>Date: ${order.timestamp}</p>
                <ul>
                    ${order.items.map(item => `<li>${item.name} - $${item.price.toFixed(2)}</li>`).join('')}
                </ul>
                <p><strong>Total: ${order.total.toFixed(2)}</strong></p>
                <hr>
            </div>
        `);
    });
    reportWindow.document.close();
}

document.getElementById('report-btn').addEventListener('click', displayReport);