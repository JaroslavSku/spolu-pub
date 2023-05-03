const crypto = require("crypto");
const compressImages = require("./compressImages");
const createFileId = require("./createFileId");
const unlinkFile = require("./unlinkFile");
const fs = require("fs");
async function processImages(files, fileType) {
  files.forEach(async (file, _) => {
    const path = file.path.replace(/\\/g, "/");
    console.log("process images path", path);
    const id = await createFileId(file);
    await compressImages(path, fileType, id);
    if (fs.existsSync(path)) {
      await unlinkFile(path);
    }
  });
}

module.exports = processImages;
