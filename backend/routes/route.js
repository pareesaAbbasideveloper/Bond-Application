const express = require("express");
const upload = require("../middleware/multer.js");
const {
  handleUserSignUp,
  handleUserLogin,
  handleAddContact,
  handleEditProfile,
  handleViewProfile,
  handleMarkAsDone,
  handleExtendDate,
  handleFilterContact,
  getAllContacts,
  sendSupportEmail,
  deleteContact,
  changePassword,
  handleEditContacts,
  burnedLogDone,
} = require("../controllers/user_controller");
const router = express.Router();

// Sign UP & Login
router.route("/signUp").post(handleUserSignUp);
router.route("/login").post(handleUserLogin);

// Home Page
router.route("/addContact").post(handleAddContact);
router.route("/viewProfile").get(handleViewProfile);
router.route("/filtercontacts").post(handleFilterContact);
router.route("/getallcontacts").post(getAllContacts);
router.route("/markasdone/:id").post(handleMarkAsDone);
router.route("/extend/:id").post(handleExtendDate);
router.route("/support").post(sendSupportEmail);
router.route("/changePassword").post(changePassword);
router.route("/deletecontact").delete(deleteContact);
router.route("/editContacts").post(handleEditContacts);
router.route("/burnedLogDone").post(burnedLogDone);

router
  .route("/editProfile")
  .post(
    upload.fields([{ name: "profilePic", maxCount: 1 }]),
    handleEditProfile
  );

module.exports = router;
