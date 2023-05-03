const fs = require("fs");

function isEmptyFolder(path) {
  if (fs.existsSync(path)) {
    return fs.readdirSync(path).length === 0;
  }
  return false;
}

module.exports = isEmptyFolder;
