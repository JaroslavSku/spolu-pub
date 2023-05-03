const crypto = require("crypto");
function createInvoiceNames(name, surname) {
  try {
    const id = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomId = crypto.randomInt(1, 99999999);
    const pdfPath = `./files/invoices/faktura-${id}-${randomId}.pdf`;
    const originalname = `faktura-${id}-${name}-${surname}-${randomId}.pdf`;
    return [pdfPath, originalname];
  } catch (error) {
    console.log(error);
  }
}

module.exports = createInvoiceNames;
