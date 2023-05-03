const pdfKit = require("pdfkit");
const fs = require("fs");
const { reduce, split } = require("lodash");
const { round } = require("lodash");
async function createInvoice(file, data) {
  const companyLogo = "files/logo/logo.png";
  const fontNormal = "Cardo";
  const fontBold = "Cardo";

  const sellerInfo = {
    companyName: "Apartmio s.r.o",
    address: "Jelínkova 1613/2, Praha 8",
    city: "Praha",
    country: "Česká republika",
  };

  const customerInfo = {
    customerName: `${data?.name || ""} ${data?.surname || ""}`,
    address: data?.address || "",
  };
  const dateFormat = new Date()
    .toJSON()
    .slice(0, 10)
    .split("-")
    .reverse()
    .join(".");
  const orderInfo = {
    issueDate: dateFormat,
    taxDate: dateFormat,
    invoiceDate: dateFormat,
    products: data?.products || [],
    totalValueBeforeTax: 120,
    totalTax: 20,
    totalValueAfterTax: 140,
  };

  try {
    const pdfDoc = new pdfKit();
    const invoiceId = split(file.originalname, ".", 1);
    pdfDoc.registerFont("Cardo", "./fonts/Cardo-Regular.ttf");
    const stream = fs.createWriteStream(file?.path || "test.pdf");
    pdfDoc.pipe(stream);

    pdfDoc.image(companyLogo, 0, 5, { height: 80 });
    pdfDoc.font(fontBold).text("Nájemník v pohodě", 7, 75);
    pdfDoc
      .font(fontNormal)
      .fontSize(14)
      .text("Faktura", 400, 30, { width: 200 });
    pdfDoc.fontSize(10).text("Daňový doklad", 400, 46, { width: 200 });
    pdfDoc.fontSize(10).text(`${invoiceId}`, 400, 62, { width: 200 });

    pdfDoc.font(fontBold).text("Dodavatel", 7, 100);
    pdfDoc
      .font(fontNormal)
      .text(sellerInfo.companyName, 7, 115, { width: 250 });
    pdfDoc.text(sellerInfo.address, 7, 130, { width: 250 });
    pdfDoc.text(sellerInfo.city, 7, 145, {
      width: 250,
    });
    pdfDoc.text(sellerInfo.country, 7, 160, {
      width: 250,
    });

    pdfDoc.font(fontBold).text("Odběratel", 400, 100);
    pdfDoc
      .font(fontNormal)
      .text(customerInfo.customerName, 400, 115, { width: 250 });
    pdfDoc.text(customerInfo.address, 400, 130, { width: 250 });

    pdfDoc.text("Datum vystavení:", 7, 195, {
      width: 250,
    });
    pdfDoc.text(orderInfo.issueDate, 90, 195, {
      width: 250,
    });
    pdfDoc.text("Zdanitelné plnění:", 7, 210, {
      width: 250,
    });
    pdfDoc.text(orderInfo.invoiceDate, 90, 210, {
      width: 250,
    });
    pdfDoc.text("Datum splatnosti:", 7, 225, {
      width: 250,
    });
    pdfDoc.text(orderInfo.taxDate, 90, 225, {
      width: 250,
    });

    pdfDoc.rect(7, 250, 560, 20).fill("#000").stroke("#000");
    pdfDoc.fillColor("#fff").text("Produkt", 20, 256, { width: 90 });
    pdfDoc.text("Množství", 200, 256, { width: 100 });
    pdfDoc.text("Cena", 300, 256, { width: 100 });
    pdfDoc.text("Daň", 400, 256, { width: 100 });
    pdfDoc.text("Cena s daní", 500, 256, { width: 100 });

    let productNo = 1;
    orderInfo.products.forEach((element) => {
      console.log("adding", element.name);
      const y = 256 + productNo * 20;
      pdfDoc.fillColor("#000").text(element.name, 20, y, { width: 190 });
      pdfDoc.text(element.qty, 200, y, { width: 100 });
      pdfDoc.text(`${element.priceBeforeTax} Kč`, 300, y, { width: 100 });
      pdfDoc.text(`${element.tax} %`, 400, y, { width: 100 });
      pdfDoc.text(`${round(element.priceAfterTax, 2)} Kč`, 500, y, {
        width: 100,
      });
      productNo++;
    });

    const totalValueWithTax = reduce(
      orderInfo?.products || [],
      (sum, product) => {
        return sum + product?.priceAfterTax || 0;
      },
      0
    );

    pdfDoc
      .rect(7, 256 + productNo * 20, 560, 0.2)
      .fillColor("#000")
      .stroke("#000");
    productNo++;

    pdfDoc.font(fontBold).text(`Celkově: `, 400, 256 + productNo * 17);
    pdfDoc
      .font(fontBold)
      .text(`${round(totalValueWithTax, 2)} Kč`, 500, 256 + productNo * 17, {
        width: 100,
      });

    pdfDoc.end();
    await new Promise((resolve) => {
      stream.on("finish", function () {
        console.log("3-1");
        resolve();
      });
    });
    console.log("pdf generate successfully");
  } catch (error) {
    console.log("Error occurred", error);
  }
}

module.exports = createInvoice;
