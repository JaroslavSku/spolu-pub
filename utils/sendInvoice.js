const createInvoice = require("./createInvoice");
const sendEmail = require("../controllers/email.send");
const createInvoiceNames = require("./returnFakturaNames");

async function sendInvoice(
  amount,
  name,
  surname,
  address,
  email,
  products,
  next
) {
  try {
    const [pdfPath, originalname] = createInvoiceNames(name, surname);
    const invoiceData = {
      amount: amount,
      name: name,
      surname: surname,
      address: address,
      products: products,
    };

    const file = {
      originalname: originalname,
      path: pdfPath,
    };
    await createInvoice(file, invoiceData);

    const html = "Tímto Vám zasíláme Vaši fakturu od www.najemnikvpohode.cz";
    const subject = "Vaše faktura";
    sendEmail(email, html, subject, file, next);
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

module.exports = sendInvoice;
