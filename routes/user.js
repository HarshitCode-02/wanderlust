const express = require("express");
const router = express.Router();

const passport = require("passport");

const wrapAsync = require("../utils/wrapAsync.js");

const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

// SIGNUP
router.route("/signup")
    .get(userController.signUpPage)
    .post(wrapAsync(userController.createNewUser));

// LOGIN
router.route("/login")
    .get(userController.getlogin)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),
        userController.postlogin
    );

// LOGOUT
router.get("/logout", userController.logout);

module.exports = router;