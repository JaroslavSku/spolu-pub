const msg = require("../utils/email.msgs");
const sendEmail = require("./email.send");
const crypto = require("crypto");
const { default: axios } = require("axios");
const Message = require("../models/message");
const SharedEmail = require("../models/sharedEmail");

exports.sharedSendMail = async (req, res, next) => {
  const { email } = req.body;
  const subject = "Registrace k portálu spolubydlení.";
  try {
    const dbEmail = await SharedEmail.findOne({ email: email });

    const footer = "Od Vašeho spolubydlícího vpohodě www.spolu-bydleni.cz";
    if (!dbEmail) {
      const mail = new SharedEmail({
        email: email,
      });
      const savedMail = await mail.save();

      const message = `Pro potvrzení Vašeho emailu klikněte na tento <a href='${process.env.FE_URL_SPOLUBYDLENI}/overeni/${savedMail._id}'> link. </a> ${footer}`;

      sendEmail(email, message, subject, next);
      res.status(200).json({
        message: "Zpráva odeslána.",
      });
    } else if (dbEmail && !dbEmail.confirmed) {
      let userMessage;
      userMessage = `Potvrzení k tomuto emailu bylo již zasláno více jak 2x, možná zůstalo ve spamu?`;

      const message = `Pro potvrzení Vašeho emailu klikněte na tento <a href='${process.env.FE_URL_SPOLUBYDLENI}/overeni/${dbEmail._id}'> link. </a> ${footer}`;
      const totalCount = dbEmail.resendCount + 1;
      dbEmail.resendCount = totalCount;
      await dbEmail.save();
      if (totalCount <= 2) {
        userMessage = `Potvrzení k tomuto emailu bylo již zasláno, možná zůstalo ve spamu? `;
        sendEmail(email, message, subject, next);
      }

      res.status(200).json({
        message: userMessage,
      });
    } else {
      res.status(400).json({
        message: msg.alreadyConfirmed,
      });
    }
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.sharedResetPassword = (req, res, next) => {
  const uniqueId = crypto.randomBytes(16).toString("hex");
  const { email } = req.body;
  SharedEmail.findOne({ email: email })
    .then((dbEmail) => {
      dbEmail.renewCode = uniqueId;
      return dbEmail.save();
    })
    .then((savedEmail) => {
      const message = `Pro změnu hesla prosím klikněte na tento <a href='${process.env.FE_URL_SPOLUBYDLENI}/heslo/obnoveni/${savedEmail.renewCode}'> link. </a>`;
      const subject = "Obnovení hesla nájemník vpohodě.";
      sendEmail(savedEmail.email, message, subject, next);
      res.status(200).json({
        message: msg.confirm,
      });
    });
};

exports.sharedVerifyCode = (req, res, next) => {
  const { uniqueId } = req.body;
  SharedEmail.findOne({ renewCode: uniqueId })
    .then(({ renewCode, email, _id }) => {
      res.status(200).json({
        message: "OK",
        renewCode,
        email,
        id: _id,
      });
    })
    .catch(() => {
      res.status(400).json({
        message: msg.wrongCode,
      });
    });
};

exports.sharedVerifyMail = async (req, res, next) => {
  const { id } = req.body;
  try {
    const user = await SharedEmail.findById(id);

    if (!user) {
      res.status(404).json({
        message: "Email nebyl nalezen",
      });
    } else if (user && !user.confirmed) {
      await SharedEmail.findByIdAndUpdate(id, { confirmed: true });

      res.status(200).json({
        message: "Potvrzeno.",
        user,
      });
    } else if (user && !user.registered) {
      res.status(200).json({
        message: "Email už byl potvrzen.",
        user,
      });
    } else {
      res.status(400).json({
        message: "Email už je zaregistrován.",
      });
    }
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.sharedContactOwner = async (req, res, next) => {
  const { message, ownerEmail, captcha, tenantEmail, advertId, layout } =
    req.body;

  try {
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captcha}`;
    const { data } = await axios.post(url);
    const html = `${message}. Odpovězte na inzerát na <strong>${tenantEmail}</strong>. Váš team nájemníka v pohodě.`;
    if (data?.success) {
      sendEmail(
        ownerEmail,
        html,
        `Odpověď na Váš inzerát číslo ${advertId}, ${layout} .`,
        next
      );
      const dbMessage = new Message({
        text: message,
        senderEmail: tenantEmail,
        receiverEmail: ownerEmail,
      });
      await dbMessage.save();
      res.status(200).json({
        message: "Zpráva odeslána.",
      });
    } else {
      res.status(400).json({
        message: "Asi jste robot.",
      });
    }
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.sharedContactUs = async (req, res, next) => {
  const { names, email, message, captcha } = req.body;

  try {
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captcha}`;
    const { data } = await axios.post(url);
    if (data?.success) {
      const html = `<p>Zpráva od: <strong> ${names} </strong> s emailem ${email} </p><p><strong>Zpráva:</strong></p><p>${message}</p>`;
      const emailTo = "info.apartmio@gmail.com";
      sendEmail(emailTo, html, "Kontaktujte nás.", next);
      res.status(200).json({ message: "ok" });
    } else {
      res.status(400).json({
        message: "Asi jste robot.",
      });
    }
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.sharedSendAgreement = (req, res, next) => {
  const { emailTo } = req.body;
  const html = "Zasíláme Vám smlouvu.";
  sendEmail(emailTo, html, "Vaše neprůstřelná smlouva.", next);
  res.status(200).json({ message: "ok" });
};
