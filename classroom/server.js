const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");


app.use(session({
    secret: "mysupersecretstrng", resave: false,
    saveUninitialized: true
})
);

app.get("/reqcount", (req, res) => {
    res.send("fuck u bitch why are u opemniung this website uliple times")
});




// app.get("/test", (req, res) => {
//     res.send("fuck u ganduuu  what the hell r u doing on my page ")
// });

// app.use(cookieParser());


// app.get("/getcookies", (req, res) => {
//     res.cookie("greet", "namaste");
//     res.cookie("bagh jao yha se", "good bye!");
//     res.send("sent you some cookies!");
// });

// app.get("/greet", (req, res) => {
//     let { name = "anonymous" }
//         = req.cookies;
// });

// app.get("/", (req, res) => {
//     res.send("hi , i am root ");
// });
// app.use("/users", users);
// app.use("/posts", posts);


app.listen(3000, () => {
    console.log("server is listening to 3000");
});