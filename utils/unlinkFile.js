const { unlink } = require("fs");
async function unlinkFile(path) {
  console.log("input path", path);
  await unlink(path, (err) => {
    if (err) console.error(err);
  });
}

module.exports = unlinkFile;
