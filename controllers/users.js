const renderWithLayout = require("../utils/renderWithLayout.js");
const passport = require("passport");
const User = require("../models/user.js");

module.exports.signUpPage = (req, res, next) => {
    renderWithLayout(
        res,
        "users/signup",
        {},
        next
    );
};

module.exports.createNewUser = (async (req, res, next) => {

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
});

module.exports.getlogin = (req, res, next) => {
    renderWithLayout(res, "users/login", {}, next);
};

module.exports.postlogin = async (req, res) => {

    req.flash(
        "success",
        "Welcome back to WanderLust!"
    );
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};