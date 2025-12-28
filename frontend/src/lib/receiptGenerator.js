import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateTicketReceipt = (bookingData) => {
    const doc = new jsPDF();

    // Modern Color Palette
    const primaryColor = [248, 69, 101]; // Pink #f84565
    const accentColor = [255, 107, 138]; // Light Pink
    const darkBg = [26, 26, 46]; // Dark background
    const lightBg = [248, 249, 250]; // Light gray
    const successColor = [16, 185, 129]; // Green
    const textDark = [33, 33, 33];
    const textLight = [255, 255, 255];

    // Modern gradient header (two-tone effect)
    doc.setFillColor(248, 69, 101);
    doc.rect(0, 0, 210, 45, 'F');

    // Accent stripe at top
    doc.setFillColor(255, 107, 138);
    doc.rect(0, 0, 210, 5, 'F');

    // Logo and Title - NO EMOJI
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('ShowXpress', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Your Premium Movie Experience', 105, 29, { align: 'center' });

    // Ticket type badge
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(75, 35, 60, 7, 2, 2, 'F');
    doc.setTextColor(248, 69, 101);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('E-TICKET RECEIPT', 105, 40, { align: 'center' });

    // Booking Info Cards
    let currentY = 58;

    // Booking ID and Date Card
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(15, currentY, 180, 18, 3, 3, 'F');

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('BOOKING ID', 20, currentY + 6);
    doc.text('BOOKING DATE', 110, currentY + 6);

    doc.setTextColor(33, 33, 33);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.bookingId || 'N/A', 20, currentY + 13);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(bookingData.bookingDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }), 110, currentY + 13);

    currentY += 25;

    // Movie Details Section
    doc.setFillColor(248, 69, 101);
    doc.roundedRect(15, currentY, 180, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('🎬 MOVIE DETAILS', 20, currentY + 7);

    currentY += 15;

    // Movie info card
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, currentY, 180, 45, 3, 3, 'FD');

    // Movie Title - Large and prominent
    doc.setTextColor(248, 69, 101);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.movieTitle, 20, currentY + 10);

    // Theater, Date, Time in a grid
    const infoY = currentY + 20;

    // Theater
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('THEATER', 20, infoY);
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.theater, 20, infoY + 6);

    // Date
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('SHOW DATE', 20, infoY + 15);
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.showDate, 20, infoY + 21);

    // Time
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('SHOW TIME', 110, infoY + 15);
    doc.setTextColor(248, 69, 101);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.showTime, 110, infoY + 21);

    currentY += 52;

    // Seats Section
    doc.setFillColor(248, 69, 101);
    doc.roundedRect(15, currentY, 180, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('🎫 SEAT DETAILS', 20, currentY + 7);

    currentY += 15;

    // Modern seats table
    const seatsData = bookingData.seats.map((seat, index) => [
        index + 1,
        `${seat.row}${seat.number}`,
        `₹${seat.price}`
    ]);

    autoTable(doc, {
        startY: currentY,
        head: [['#', 'Seat Number', 'Price']],
        body: seatsData,
        theme: 'plain',
        headStyles: {
            fillColor: [248, 249, 250],
            textColor: [100, 100, 100],
            fontStyle: 'bold',
            fontSize: 9,
            halign: 'center',
            cellPadding: 5
        },
        bodyStyles: {
            fontSize: 10,
            textColor: [33, 33, 33],
            cellPadding: 5
        },
        alternateRowStyles: {
            fillColor: [252, 252, 252]
        },
        columnStyles: {
            0: { cellWidth: 30, halign: 'center', fontStyle: 'bold' },
            1: { cellWidth: 90, halign: 'center', fontStyle: 'bold', textColor: [248, 69, 101] },
            2: { cellWidth: 50, halign: 'right', fontStyle: 'bold' }
        },
        margin: { left: 15, right: 15 },
        tableLineColor: [230, 230, 230],
        tableLineWidth: 0.5
    });

    currentY = doc.lastAutoTable.finalY + 15;

    // Payment Summary Section
    doc.setFillColor(248, 69, 101);
    doc.roundedRect(15, currentY, 180, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('💳 PAYMENT SUMMARY', 20, currentY + 7);

    currentY += 15;

    // Payment details card
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(15, currentY, 180, 35, 3, 3, 'FD');

    // Number of tickets
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Number of Tickets', 20, currentY + 8);
    doc.setTextColor(33, 33, 33);
    doc.setFont('helvetica', 'bold');
    doc.text(`${bookingData.seats.length}`, 185, currentY + 8, { align: 'right' });

    // Subtotal
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal', 20, currentY + 16);
    doc.setTextColor(33, 33, 33);
    doc.setFont('helvetica', 'bold');
    doc.text(`₹${bookingData.totalAmount}`, 185, currentY + 16, { align: 'right' });

    // Divider
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(20, currentY + 20, 190, currentY + 20);

    // Total - Highlighted
    doc.setTextColor(248, 69, 101);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL PAID', 20, currentY + 28);
    doc.setFontSize(16);
    doc.text(`₹${bookingData.totalAmount}`, 185, currentY + 28, { align: 'right' });

    currentY += 42;

    // Payment status badges
    doc.setFillColor(220, 252, 231);
    doc.roundedRect(15, currentY, 85, 20, 3, 3, 'F');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('PAYMENT STATUS', 20, currentY + 6);
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('✓ PAID', 20, currentY + 14);

    doc.setFillColor(248, 249, 250);
    doc.roundedRect(105, currentY, 90, 20, 3, 3, 'F');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('PAYMENT METHOD', 110, currentY + 6);
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.paymentMethod || 'Card', 110, currentY + 14);

    currentY += 25;

    // Transaction ID if available
    if (bookingData.transactionId && bookingData.transactionId !== 'N/A') {
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text('Transaction ID:', 15, currentY);
        doc.setTextColor(150, 150, 150);
        doc.text(bookingData.transactionId, 45, currentY);
        currentY += 8;
    }

    // QR Code Section - Modern design
    doc.setFillColor(248, 249, 250);
    doc.roundedRect(60, currentY, 90, 50, 3, 3, 'F');

    // QR placeholder with border
    doc.setDrawColor(248, 69, 101);
    doc.setLineWidth(2);
    doc.roundedRect(80, currentY + 5, 50, 50, 2, 2, 'S');

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('SCAN AT THEATER', 105, currentY + 25, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Show this QR code at entrance', 105, currentY + 32, { align: 'center' });
    doc.setTextColor(248, 69, 101);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(bookingData.bookingId || 'N/A', 105, currentY + 45, { align: 'center' });

    // Footer - Improved Design
    const footerY = 268;
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(15, footerY, 195, footerY);

    // Thank you message
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Thank you for choosing ShowXpress!', 105, footerY + 8, { align: 'center' });

    // Important notes
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('Please arrive 15 minutes before show time', 105, footerY + 16, { align: 'center' });
    doc.text('Carry a valid ID for verification', 105, footerY + 22, { align: 'center' });

    // Contact info
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('For support: support@showxpress.com', 105, footerY + 30, { align: 'center' });

    // Generation timestamp
    doc.setTextColor(180, 180, 180);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`, 105, footerY + 37, { align: 'center' });

    // Save PDF
    const fileName = `ShowXpress_Ticket_${bookingData.bookingId || Date.now()}.pdf`;
    doc.save(fileName);
};
