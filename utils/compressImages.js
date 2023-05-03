const sharp = require("sharp");

async function compressImages(filePath, fileType, id) {
  await sharp(filePath, { failOnError: false })
    .resize(1024, 768)
    [fileType]({ speed: 8 })
    .toFile(`${filePath}-${id}.${fileType}`);
}

module.exports = compressImages;
