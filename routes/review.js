const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { validateReview, isLoggedIn ,isReviewAuthor } = require("../middleware.js")
const wrapAsync = require("../utils/wrapAsync.js");

// =======================
// Create Review
// POST /listings/:id/reviews
// =======================

router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(async (req, res) => {

        const { id } = req.params;

        // Check review data
        if (!req.body.review) {
            req.flash("error", "Review data is missing!");
            return res.redirect(`/listings/${id}`);
        }

        // Find listing
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash(
                "error",
                "The listing you are trying to review does not exist!"
            );
            return res.redirect("/listings");
        }

        const { rating, comment } = req.body.review;

        // Validate rating
        const parsedRating = parseInt(rating);

        if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
            req.flash(
                "error",
                "Please provide a valid rating between 1 and 5."
            );
            return res.redirect(`/listings/${id}`);
        }

        // Validate comment
        if (!comment || comment.trim().length < 5) {
            req.flash(
                "error",
                "Comment must be at least 5 characters long."
            );
            return res.redirect(`/listings/${id}`);
        }

        // Create review
        const newReview = new Review(req.body.review);

        // Set review author
        newReview.author = req.user._id;

        // Add review to listing
        listing.reviews.push(newReview);

        // Save both
        await newReview.save();
        await listing.save();

        req.flash(
            "success",
            "Your review has been posted!"
        );

        res.redirect(`/listings/${listing._id}`);
    })
);


// =======================
// Delete Review
// DELETE /listings/:id/reviews/:reviewId
// =======================

router.delete(
    "/:reviewId",isLoggedIn,isReviewAuthor,
    wrapAsync(async (req, res) => {
        const { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, {
            $pull: {
                reviews: reviewId
            }
        });

        await Review.findByIdAndDelete(reviewId);

        req.flash(
            "success",
            "Review Deleted Successfully!"
        );

        res.redirect(`/listings/${id}`);
    })
);

module.exports = router;