const PDFGenerator = require("pdfkit");
const fs = require("fs");
const { default: axios } = require("axios");
const { forEach, forOwn } = require("lodash");
const mappingTable = require("./mappingTable");
const Post = require("../models/posts");
const postMapping = require("./postMapping");

async function createPdf(posts, pdfPath, data) {
  try {
    let theOutput = new PDFGenerator();
    const stream = fs.createWriteStream(pdfPath);
    theOutput.pipe(stream);
    theOutput.registerFont("Cardo", "./fonts/Cardo-Regular.ttf");
    const date = new Date().toISOString().slice(0, 10);
    const [yyyy, mm, dd] = date.split("-");
    const formattedDate = `${dd}/${mm}/${yyyy}`;
    theOutput.image("files/logo/logo.png", 30, 30, { width: 200 });

    theOutput.font("Cardo").text("VÝPIS Z REGISTRŮ", {
      bold: true,
      underline: true,
      align: "center",
      fontSize: 18,
    });
    theOutput.font("Cardo").text(`${formattedDate}`, {
      align: "center",
    });
    theOutput
      .font("Cardo")
      .text(`www.najemnikvpohode.cz`, {
        align: "center",
      })
      .moveDown(1);
    theOutput
      .font("Cardo")
      .text(
        "Došlo k prověření osoby v naší databázi nájemníků a v státních rejstřících. Data doporučujeme uložit na bezpečné místo pro Vaši budoucí potřebu.",
        {
          align: "center",
        }
      );
    theOutput.moveDown(1.5);

    //EXEKUCE
    if (data && data.length > 0) {
      theOutput.font("Cardo").text("Registr exekuční komory", {
        bold: true,
        underline: true,
        align: "left",
      });
      theOutput.moveDown();
      forEach(data, (values, key) => {
        theOutput.font("Cardo").text(`${key}.`, {
          bold: true,
          align: "left",
          continued: true,
        });
        forEach(values, (value, key2) => {
          if (mappingTable[key2]) {
            theOutput.font("Cardo").text(` ${mappingTable[key2]}: ${value}`, {
              bold: true,
              align: "left",
              indent: 10,
            });
          }
        });
        theOutput.moveDown();
      });
    } else {
      theOutput.font("Cardo").text("Registr exekuční komory BEZ ZÁZNAMU", {
        bold: true,
        underline: true,
        columns: 2,
        columnGap: 230,
        width: 500,
        height: 25,
        align: "justify",
      });
    }
    theOutput.moveDown();
    // OUR DB

    if (posts && posts.length > 0) {
      theOutput.text("Výpis z naši databáze nájemníků", {
        bold: true,
        underline: true,
        align: "left",
      });
      theOutput.moveDown();
      forEach(posts, (post, key2) => {
        console.log("post", post);
        const taskId = key2 + 1;
        theOutput.font("Cardo").text(`${taskId}.`, {
          bold: true,
          align: "left",
          continued: true,
        });

        if (post?.creator?.email) {
          theOutput
            .font("Cardo")
            .text(
              `Kontaktujte bývalého pronajímatele na: ${post.creator.email}`,
              {
                bold: true,
                align: "left",
                indent: 10,
              }
            );
        }

        theOutput.moveDown();
      });
    } else {
      theOutput
        .font("Cardo")
        .text("Výpis z naši databáze nájemníků BEZ ZÁZNAMU", {
          bold: true,
          underline: true,
          columns: 2,
          columnGap: 180,
          width: 550,
          height: 25,
          align: "justify",
        });
    }
    theOutput.moveDown();
    // write out file
    theOutput.end();
    await new Promise((resolve) => {
      stream.on("finish", function () {
        console.log("3-1");
        resolve();
      });
    });
    console.log("3-2");
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
}

module.exports = createPdf;
