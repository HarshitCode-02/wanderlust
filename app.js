const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local")
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const User = require("./models/user.js");
const { userInfo } = require("os");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


// Database Connection
async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("connected to DB");
}

main().catch((err) => {
    console.log("Database connection error:", err);
});


// App Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


// Session & Flash
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};

// Routes
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// listings
app.use("/listings", listingRouter);

// Reviews
app.use("/listings/:id/reviews", reviewRouter);

// User
app.use("/", userRouter);


// app.use((req, res, next) => {
//     console.log("REQUEST:", req.method, req.originalUrl);
//     next();
// });


app.use((req, res, next) => {

    if (
        req.path === "/favicon.ico" ||
        req.path.match(/\.(css|js|png|jpg|jpeg|gif|svg)$/)
    ) {
        return res.status(204).end();
    }

    next(new ExpressError(404, "Page not found"));
});


// Error Handler
app.use((err, req, res, next) => {
    const statusCode =
        typeof err.statusCode === "number" ? err.statusCode : 500;

    const message = err.message || "Something went wrong!";

    console.error("Error Caught:", err);

    res.status(statusCode).render("error", {
        message,
    });
});


// Start Server
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});