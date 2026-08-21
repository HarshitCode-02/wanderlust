const Listing = require("../models/listing");
const renderWithLayout = require("../utils/renderWithLayout.js");

module.exports.index = (async (req, res, next) => {
    const allListings = await Listing.find({});
    renderWithLayout(
        res,
        "listings/index",
        { allListings },
        next
    );
});

module.exports.newlisting = (req, res, next) => {
    renderWithLayout(res, "listings/new", {}, next
    );
};

module.exports.showlisting = (async (req, res, next) => {
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
});

module.exports.createlisting = (async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();

    req.flash(
        "success",
        "New Listing Created!"
    );

    res.redirect("/listings");
});

module.exports.editlisting = (async (req, res, next) => {
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
});

module.exports.upadtelisting=(async (req, res) => {
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
});

module.exports.deletelisting=(async (req, res) => {
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
});