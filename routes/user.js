const express = require("express");
const router = express.Router();

const passport = require("passport");
const User = require("../models/user.js");
const renderWithLayout = require("../utils/renderWithLayout.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");


// GET /signup
// Show Signup Page
router.get("/signup", (req, res, next) => {
    renderWithLayout(
        res,
        "users/signup",
        {},
        next
    );
});


// POST /signup
// Create New User
router.post(
    "/signup", wrapAsync(
        async (req, res, next) => {

            try {

                const { username, email, password } = req.body;

                // Create user
                const newUser = new User({
                    username: username,
                    email: email
                });

                // Register user with password
                const registeredUser = await User.register(
                    newUser,
                    password
                );

                console.log("User registered:", registeredUser);

                // Automatically log the user in
                req.login(registeredUser, (err) => {

                    if (err) {
                        return next(err);
                    }

                    req.flash(
                        "success",
                        "Welcome to WanderLust!"
                    );

                    res.redirect("/listings");
                });

            } catch (err) {

                console.log("Signup Error:", err);

                req.flash(
                    "error",
                    err.message
                );

                res.redirect("/signup");
            }
        }
    ));


// GET LOGIN
router.get("/login", (req, res, next) => {
    renderWithLayout(res, "users/login", {}, next);
});

// POST LOGIN
router.post(
    "/login",saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    async (req, res) => {

        req.flash(
            "success",
            "Welcome back to WanderLust!"
        );
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
);
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
});

module.exports = router; 
