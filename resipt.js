function generateReceipt(phoneNumber, items, totalAmount) {

const doc = new jspdf.jsPDF();

const logoUrl = 'https://s.yimg.com/fz/api/res/1.2/fvgyvt5W77eO4uhhXfiG9w--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI0MDtxPTgwO3c9MzMy/https://s.yimg.com/zb/imgv1/8c7e95f2-5812-3ae9-9404-88c39a512642/t_500x300'; 
doc.addImage(logoUrl, 'PNG', 10, 10, 50, 20);

doc.setFontSize(18);
doc.text("Mos Burger Receipt", 10, 40);

const now = new Date();
const dateTime = now.toLocaleString();
doc.setFontSize(12);
doc.text(`Date & Time : ${dateTime}`, 10, 50);

doc.text(`Phone Number: ${phoneNumber}`, 10, 60);

doc.setDrawColor(0);
doc.line(10, 65, 200, 65);

doc.setFontSize(14);
doc.text("Order Details", 10, 75);

let yPosition = 85; 
items.forEach((item, index) => {
    doc.setFontSize(12);
    doc.text(`${item.name}`, 10, yPosition);
    doc.text(`Quantity: ${item.quantity}`, 100, yPosition);
    doc.text(`Price: Rs ${item.price.toFixed(2)}`, 150, yPosition);
    yPosition += 10; 
});

doc.line(10, yPosition, 200, yPosition);
yPosition += 10;

doc.setFontSize(14);
doc.text(`Total Amount: Rs ${totalAmount.toFixed(2)}`, 10, yPosition);

doc.save(`Mos_Burger_Receipt_${phoneNumber}.pdf`);

function generateReceipt(phoneNumber, cartItems, totalAmount, customerName) {
    const doc = new jspdf.jsPDF();

    const logoUrl = 'https://s.yimg.com/fz/api/res/1.2/fvgyvt5W77eO4uhhXfiG9w--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI0MDtxPTgwO3c9MzMy/https://s.yimg.com/zb/imgv1/8c7e95f2-5812-3ae9-9404-88c39a512642/t_500x300';
    
    doc.addImage(logoUrl, 'PNG', 10, 10, 50, 20);
    doc.setFontSize(18);
    doc.text("Mos Burger Receipt", 10, 40);

    const now = new Date();
    const dateTime = now.toLocaleString();
    doc.setFontSize(12);
    doc.text(`Date & Time: ${dateTime}`, 10, 50);
    doc.text(`Customer Name: ${customerName}`, 10, 60);
    doc.text(`Phone Number: ${phoneNumber}`, 10, 70);

    doc.setDrawColor(0);
    doc.line(10, 75, 200, 75);

    doc.setFontSize(14);
    doc.text("Order Details", 10, 85);

    let yPosition = 95;
    cartItems.forEach((item) => {
        doc.setFontSize(12);
        doc.text(`${item.name}`, 10, yPosition);
        doc.text(`Quantity: ${item.quantity}`, 100, yPosition);
        doc.text(`Price: Rs ${item.price.toFixed(2)}`, 150, yPosition);
        yPosition += 10; 
    });

    doc.line(10, yPosition, 200, yPosition);
    yPosition += 10;

    doc.setFontSize(14);
    doc.text(`Total Amount: Rs ${totalAmount.toFixed(2)}`, 10, yPosition);

    const fileName = `Mos_Burger_Receipt_${phoneNumber}.pdf`;
    doc.save(fileName);

    const pdfDataUrl = doc.output('datauristring');

    }
}