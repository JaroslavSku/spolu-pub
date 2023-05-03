const crypto = require("crypto");

function createFilePaths(files, fileId, fileType) {
  let paths = [];
  files.forEach(async (file, _) => {
    const path = file.path.replace(/\\/g, "/");
    const uuid = crypto.randomBytes(16).toString("hex");
    paths.push({
      _id: uuid,
      src: path + "." + fileType,
      folder: fileId,
      originalName: file.originalname + "." + fileType,
    });
  });
  console.log("paths", paths);
  return paths;
}

module.exports = createFilePaths;
