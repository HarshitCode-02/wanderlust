const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const { initDB } = require("./init/index.js");
const path = require("path");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js")


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
  await seedDBIfEmpty();
}

async function seedDBIfEmpty() {
  const count = await Listing.countDocuments();
  if (count === 0) {
    await initDB();
  }
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

function renderWithLayout(res, view, props = {}) {
  res.render(view, props, (err, html) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.render("layouts/boilerplate", { body: html });
  });
}

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  else {
    next();
  }
};

//Index Route
app.get("/listings", validateListing, wrapAsync(async (req, res, next) => {
  const allListings = await Listing.find({});
  renderWithLayout(res, "listings/index", { allListings });
}));

//New Route
app.get("/listings/new", validateListing, (req, res) => {
  renderWithLayout(res, "listings/new");
});

//Show Route
app.get("/listings/:id", validateListing, wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  renderWithLayout(res, "listings/show", { listing });
}));

//Create Route
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
})
);

//Edit Route
app.get("/listings/:id/edit", validateListing, wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  renderWithLayout(res, "listings/edit", { listing });
}));

//Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true });
  res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", validateListing, wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

app.use((req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  res.render("error.ejs");
  //res.status(statusCode || 500).send(message || "Something went wrong!");
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});