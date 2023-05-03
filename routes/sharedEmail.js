const express = require("express");

const {
  sharedSendMail,
  sharedVerifyMail,
  sharedResetPassword,
  sharedVerifyCode,
  sharedContactOwner,
  sharedContactUs,
} = require("../controllers/sharedEmail");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/send", sharedSendMail);
router.post("/verify", sharedVerifyMail);
router.post("/reset", sharedResetPassword);
router.post("/verify-code", sharedVerifyCode);
router.post("/contact-owner", sharedContactOwner);
router.post("/contact-us", sharedContactUs);
module.exports = router;
