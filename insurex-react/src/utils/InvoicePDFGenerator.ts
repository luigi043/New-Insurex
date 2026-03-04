import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Invoice } from '../types/billing.types';
import { formatCurrency, formatDate } from './formatters';

export const generateInvoicePDF = (invoice: Invoice | any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(25, 118, 210); // Primary color
    doc.text('INSUREX', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Digital Insurance Platform', 14, 28);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`INVOICE #${invoice.invoiceNumber}`, pageWidth - 14, 22, { align: 'right' });
    doc.text(`Date: ${formatDate(invoice.issueDate || invoice.createdAt)}`, pageWidth - 14, 28, { align: 'right' });

    doc.setDrawColor(200);
    doc.line(14, 35, pageWidth - 14, 35);

    // Client Info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENT DETAILS:', 14, 45);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.holderName || 'N/A', 14, 50);
    doc.text(invoice.holderEmail || '', 14, 55);

    // Policy Info
    doc.setFont('helvetica', 'bold');
    doc.text('REFERENCE:', pageWidth / 2, 45);
    doc.setFont('helvetica', 'normal');
    doc.text(`Policy: ${invoice.policyNumber || 'N/A'}`, pageWidth / 2, 50);
    doc.text(`Type: ${invoice.type}`, pageWidth / 2, 55);

    // Table
    const items = invoice.items || [{ description: invoice.description || 'Premium', quantity: 1, unitPrice: invoice.amount, totalPrice: invoice.amount }];
    const tableData = items.map((item: any) => [
        item.description,
        item.quantity.toString(),
        formatCurrency(item.unitPrice),
        formatCurrency(item.totalPrice)
    ]);

    // @ts-ignore
    doc.autoTable({
        startY: 65,
        head: [['Description', 'Qty', 'Unit Price', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [25, 118, 210], textColor: 255 },
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 35, halign: 'right' },
            3: { cellWidth: 35, halign: 'right' }
        }
    });

    // @ts-ignore
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Totals
    const totalsX = pageWidth - 14;
    doc.setFontSize(10);
    doc.text('Subtotal:', totalsX - 40, finalY);
    doc.text(formatCurrency(invoice.amount), totalsX, finalY, { align: 'right' });

    if (invoice.taxAmount) {
        doc.text('Tax:', totalsX - 40, finalY + 5);
        doc.text(formatCurrency(invoice.taxAmount), totalsX, finalY + 5, { align: 'right' });
    }

    if (invoice.discountAmount) {
        doc.setTextColor(211, 47, 47); // Error/Red
        doc.text('Discount:', totalsX - 40, finalY + 10);
        doc.text(`-${formatCurrency(invoice.discountAmount)}`, totalsX, finalY + 10, { align: 'right' });
        doc.setTextColor(0);
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', totalsX - 40, finalY + 18);
    doc.text(formatCurrency(invoice.totalAmount || invoice.amount), totalsX, finalY + 18, { align: 'right' });

    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150);
    const footerText = 'Thank you for choosing InsureX. For enquiries, please contact support@insurex.co.za';
    doc.text(footerText, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

    // Save
    doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
};
