const express = require("express");
const {
  sharedCreate,
  sharedLogin,
  sharedUploadImage,
  sharedUpdatePassword,
  sharedUpdateUserData,
  sharedDeleteProfile,
  sharedDeleteHeart,
  sharedAddHeart,
} = require("../controllers/sharedUser");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/create", sharedCreate);
router.post("/login", sharedLogin);
router.post("/picture", isAuth, sharedUploadImage);
router.put("/password", sharedUpdatePassword);
router.put("/update", isAuth, sharedUpdateUserData);
router.put("/delete", isAuth, sharedDeleteProfile);
router.put("/delete-heart", isAuth, sharedDeleteHeart);
router.post("/addHeart", isAuth, sharedAddHeart);

module.exports = router;
