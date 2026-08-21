const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Index + Create
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),

    (req, res, next) => {
      if (req.file) {
        req.body.listing.image = {
          filename: req.file.filename,
          url: `/uploads/${req.file.filename}`,
        };
      }

      next();
    },

    validateListing,
    wrapAsync(listingController.createlisting),
  );

// New listing form
router.get("/new", isLoggedIn, listingController.newlisting);

// Show + Update + Delete

router
  .route("/:id")

  .get(wrapAsync(listingController.showlisting))

  .put(
    isLoggedIn,
    isOwner,

    upload.single("listing[image]"),

    (req, res, next) => {
      if (req.file) {
        req.body.listing.image = {
          filename: req.file.filename,
          url: `/uploads/${req.file.filename}`,
        };
      }

      next();
    },

    validateListing,

    wrapAsync(listingController.upadtelisting),
  )

  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deletelisting));
// Edit listing form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editlisting),
);

module.exports = router;
