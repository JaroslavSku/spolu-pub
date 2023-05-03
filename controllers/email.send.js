const nodemailer = require("nodemailer");
const fs = require("fs");
require("dotenv").config();
const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
module.exports = async (emailTo, html, subject, file, next) => {
  const attachments = file?.path
    ? {
        // stream as an attachment
        filename: file.originalname,
        content: fs.createReadStream(file.path),
      }
    : null;

  const mailOptions = {
    from: "Apartmio s.r.o <info.apartmio@gmail.com>",
    to: emailTo,
    subject: subject,
    html: html,
    attachments: attachments,
  };
  await mailTransporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log(err);
      err.statusCode = 400;
      next(err);
    }
  });
};
