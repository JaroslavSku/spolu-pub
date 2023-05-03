const sharp = require("sharp");

async function compressImages(filePath, fileType, id) {
  try {
    console.log("before sharp + id", filePath, id);

    await sharp(filePath, { failOnError: false })
      .resize(1024, 768)
      [fileType]({ speed: 8 })
      .toFile(`${filePath}-${id}.${fileType}`);
  } catch (error) {
    console.log(error);
  }
}

module.exports = compressImages;
