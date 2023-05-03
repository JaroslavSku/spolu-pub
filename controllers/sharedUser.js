const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const axios = require("axios");
const fs = require("fs");
const Email = require("../models/email");
const Uploader = require("../utils/multer");
const mongoose = require("mongoose");
const { includes, filter } = require("lodash");
const compressImages = require("../utils/compressImages");
const processImages = require("../utils/processImages");
const SharedEmail = require("../models/sharedEmail");
const SharedUser = require("../models/sharedUser");

exports.sharedCreate = async (req, res, next) => {
  const { name, surname, password, emailId, phone } = req.body;
  try {
    const email = await SharedEmail.findById(emailId);
    if (!email?.confirmed) {
      const error = new Error("Email neexistuje.");
      error.statusCode = 400;
      throw error;
    }
    if (!email.confirmed) {
      const error = new Error("Email ještě nebyl potvrzen.");
      error.statusCode = 400;
      throw error;
    }
    email.registered = true;

    const { email: savedEmail } = await email.save();

    const userExists = await SharedUser.findOne({ email: savedEmail });

    if (userExists) {
      const error = new Error("Email už je zaregistrován.");
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const sharedUser = new SharedUser({
      userType: "pronajimatel",
      name: name,
      surname: surname,
      password: hashedPassword,
      email: savedEmail,
      phone: phone,
    });
    const user = await sharedUser.save();

    const token = jwt.sign(
      {
        email: user.email,
        userType: user.userType,
        id: user._id.toString(),
        level: user?.level,
      },
      process.env.JWT_SECRET,
      { expiresIn: 7200 }
    );

    res.status(200).json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.sharedLogin = async (req, res, next) => {
  const { password, email } = req.body;
  try {
    const user = await SharedUser.findOne({ email: email });

    if (!user) {
      const error = new Error("Uživatel nenalezen.");
      error.statusCode = 404;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Zadali jste chybné heslo.");
      error.statusCode = 404;
      throw error;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userType: user.userType,
        id: user._id.toString(),
        level: user?.level,
      },
      process.env.JWT_SECRET,
      { expiresIn: 7200 }
    );

    const recaptchaToken = req.header("Recapture-Token");
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaToken}`;

    if (!recaptchaToken) {
      const error = new Error("Chybí recaptcha token.");
      error.statusCode = 400;
      throw error;
    }
    const { data } = await axios.post(url);

    if (data?.success) {
      res.status(200).json({
        user,
        token,
      });
    } else {
      res.status(400).json({
        message: "Bohužel jste robot.",
      });
    }
  } catch (err) {
    console.log(err);
    err.statusCode = 400;
    next(err);
  }
};

exports.sharedUploadImage = async (req, res, next) => {
  let uploader = Uploader().single("image");
  uploader(req, res, async function (err) {
    try {
      if (err) throw err;
      const { userId } = req;
      const imageUri =
        req.file.destination +
        "/" +
        userId +
        path.extname(req.file.originalname) +
        ".jpg";
      fs.renameSync(
        req.file.path,
        req.file.path.replace(req.file.originalname, req.userId + ".jpg")
      );

      const user = await SharedUser.findById(userId);

      user.imageUrl = imageUri;

      const savedUser = await user.save();

      res.status(200).json({
        imageUrl: savedUser?.imageUrl,
        updatedAt: Date.now(),
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  });
};

exports.sharedUpdatePassword = async (req, res, next) => {
  const { password, renewCode, email: userEmail } = req.body;

  try {
    const user = await SharedUser.findOne({ email: userEmail });

    if (!user) {
      res.status(400).json({
        message: "Uživatel nenalezen.",
      });
      return;
    }
    const email = await SharedEmail.findOne({ renewCode: renewCode });
    if (!email) {
      res.status(400).json({
        message: "Chybné oprávnění uživatele.",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Heslo bylo úspěšně změněno.",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Nebylo možné změnit heslo.",
    });
  }
};

exports.sharedUpdateUserData = async (req, res, next) => {
  const { userId } = req;
  const { name, surname, titleBefore, titleAfter, phone } = req.body;
  try {
    const user = await SharedUser.findById(userId);

    user.name = name;
    user.surname = surname;
    user.phone = phone;
    user.titleBefore = titleBefore;
    user.titleAfter = titleAfter;

    const savedUser = await user.save();

    const userName = `${savedUser.name} ${savedUser.surname}`;

    res.status(200).json({
      email: savedUser.email,
      phone: savedUser.phone,
      firstName: savedUser.name,
      surname: savedUser.surname,
      titleBefore: savedUser.titleBefore,
      titleAfter: savedUser.titleAfter,
      userName,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.sharedDeleteProfile = async (req, res, next) => {
  const { userId } = req;

  try {
    const user = await SharedUser.findById(userId);

    await SharedEmail.deleteOne({ email: user.email });

    user.password = "Deleted";
    user.email = `Deleted ${user?.email || ""}`;
    await user.save();

    res.status(200).json({
      message: "Deleted",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.sharedAddHeart = async (req, res, next) => {
  const { userId } = req;
  const { advertId } = req.body;
  try {
    const user = await SharedUser.findById(userId);

    if (!includes(user.likesAds, advertId)) {
      user.likesAds.push(advertId);
    }

    await user.save();

    res.status(200).json({
      advertId,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.sharedDeleteHeart = async (req, res, next) => {
  const { userId } = req;
  const { advertId } = req.body;

  try {
    const user = await SharedUser.findById(userId);

    if (includes(user.likesAds, advertId)) {
      const newlikes = filter(user.likesAds, (item) => item !== advertId);
      user.likesAds = newlikes;
    }

    await user.save();

    res.status(200).json({
      advertId,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
