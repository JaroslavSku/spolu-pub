const multer = require("multer");
const fs = require("fs");
const path = require("path");
function Uploader(req, res, next) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let destinationPath = "images/";
      console.log("multer", req?.body, file);
      try {
        if (file.fieldname === "advertImages") {
          const uid = req.id.replace(/[^A-Z0-9]+/gi, "");
          destinationPath += `accommodation/${uid}`;
          if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, { recursive: true });
          }
          req.fileId = uid;
          file.fileId = uid;
        }
        if (file.fieldname === "advertImage") {
          const uid = req.id.replace(/[^A-Z0-9]+/gi, "");
          const folderId = req?.body?.uid
            ? req.body.uid
            : req.id.replace(/[^A-Z0-9]+/gi, "");
          destinationPath += `accommodation/${folderId}`;
          if (!fs.existsSync(destinationPath)) {
            console.log("creating destination path");
            fs.mkdirSync(destinationPath, { recursive: true });
          }
          req.fileId = uid;
          file.uid = uid;
          file.fileId = folderId;
        }
        if (file.fieldname === "tempImages") {
          const uid = req.id.replace(/[^A-Z0-9]+/gi, "");
          destinationPath += `temp/${uid}`;
          if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, { recursive: true });
          }
          req.fileId = uid;
          file.fileId = uid;
        }
        if (file.fieldname === "image") {
          const uid = req.id.replace(/[^A-Z0-9]+/gi, "");
          destinationPath += `people/`;
          if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, { recursive: true });
          }
          req.fileId = uid;
          file.fileId = uid;
          file.destination = `people/`;
          console.log("right destination");
        }
        if (file.fieldname === "articleImage") {
          const uid = req.id.replace(/[^A-Z0-9]+/gi, "");
          destinationPath += `articles/`;
          if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, { recursive: true });
          }
          req.fileId = uid;
          file.fileId = uid;
        }
      } catch (error) {
        console.log(error);
        throw error;
      }

      cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
      console.log(file);
      cb(null, file.originalname);
    },
  });

  let upload = multer({
    storage: storage,
  });

  return upload;
}

module.exports = Uploader;
