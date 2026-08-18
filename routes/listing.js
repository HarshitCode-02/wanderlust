const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const renderWithLayout = require("../utils/renderWithLayout.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");



// Index Route
// GET /listings
router.get(
    "/",
    wrapAsync(async (req, res, next) => {
        const allListings = await Listing.find({});

        renderWithLayout(
            res,
            "listings/index",
            { allListings },
            next
        );
    })
);

// New Route
// GET /listings/new
router.get("/new", isLoggedIn, (req, res, next) => {
    renderWithLayout(res, "listings/new", {}, next
    );
});

// Show Route
// GET /listings/:id
router.get(
    "/:id",
    wrapAsync(async (req, res, next) => {
        let { id } = req.params;

        const listing = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: {
                    path: "author"

                },
            })
            .populate("owner");

        if (!listing) {
            req.flash(
                "error",
                "Listing you requested does not exist!"
            );

            return res.redirect("/listings");
        }
        console.log(listing);
        renderWithLayout(
            res,
            "listings/show",
            { listing },
            next
        );
    })
);

// Create Route
// POST /listings
router.post(
    "/", isLoggedIn,
    validateListing,
    wrapAsync(async (req, res) => {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();

        req.flash(
            "success",
            "New Listing Created!"
        );

        res.redirect("/listings");
    })
);

// Edit Route
// GET /listings/:id/edit
router.get(
    "/:id/edit",
    isLoggedIn, isOwner,
    wrapAsync(async (req, res, next) => {
        let { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash(
                "error",
                "Listing you requested does not exist!"
            );

            return res.redirect("/listings");
        }

        renderWithLayout(
            res,
            "listings/edit",
            { listing },
            next
        );
    })
);

// Update Route
// PUT /listings/:id
router.put(
    "/:id",
    isLoggedIn, isOwner,
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;

        const listing = await Listing.findByIdAndUpdate(
            id,
            { ...req.body.listing },
            {
                runValidators: true,
                returnDocument: "after"
            }
        );

        if (!listing) {
            req.flash(
                "error",
                "Listing you requested does not exist!"
            );

            return res.redirect("/listings");
        }

        req.flash(
            "success",
            "Listing Updated!"
        );

        res.redirect(`/listings/${id}`);
    })
);

// Delete Route
// DELETE /listings/:id
router.delete(
    "/:id", isLoggedIn, isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;

        const deletedListing =
            await Listing.findByIdAndDelete(id);

        if (!deletedListing) {
            req.flash(
                "error",
                "Listing you requested does not exist!"
            );

            return res.redirect("/listings");
        }

        req.flash(
            "success",
            "Listing Deleted!"
        );

        res.redirect("/listings");
    })
);

module.exports = router;