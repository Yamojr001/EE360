export function printReceipt(sale: any, type: 'farm' | 'water') {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const itemName = type === 'farm' ? sale.item : 'Sachet Water (Bags)';
  const unitPrice = sale.unit_price || 0;
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Receipt - ${sale.id}</title>
        <style>
          body { font-family: monospace; padding: 20px; text-align: center; max-width: 300px; margin: 0 auto; color: #000; }
          .header { font-size: 1.5rem; font-weight: bold; margin-bottom: 5px; }
          .sub { font-size: 0.9rem; margin-bottom: 15px; }
          .divider { border-bottom: 1px dashed #000; margin: 10px 0; }
          .row { display: flex; justify-content: space-between; margin-bottom: 5px; text-align: left; }
          .total { font-weight: bold; font-size: 1.2rem; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">EE360 Farm</div>
        <div class="sub">Official Receipt</div>
        <div class="divider"></div>
        <div class="row"><span>Date:</span> <span>${sale.date}</span></div>
        <div class="row"><span>Buyer:</span> <span>${sale.buyer || 'Walk-in Customer'}</span></div>
        <div class="row"><span>Pay Method:</span> <span>${sale.payment_method || 'Cash'}</span></div>
        <div class="row"><span>Status:</span> <span>${sale.payment_status || 'Paid'}</span></div>
        <div class="divider"></div>
        <div class="row" style="font-weight: bold;">
          <span>Item</span>
          <span>Amount</span>
        </div>
        <div class="row">
          <span>${itemName} <br/> <small>${sale.quantity} x ₦${unitPrice}</small></span>
          <span>₦${sale.total_amount}</span>
        </div>
        <div class="divider"></div>
        <div class="row total">
          <span>TOTAL</span>
          <span>₦${sale.total_amount}</span>
        </div>
        <div class="divider"></div>
        <div style="margin-top: 15px; font-size: 0.85rem">Thank you for your business!</div>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  // Small timeout to allow the browser to render the DOM before printing
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}
