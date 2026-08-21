const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js")
const wrapAsync = require("../utils/wrapAsync.js");
const reviewController = require("../controllers/reviews.js");


// Create Review
// POST /listings/:id/reviews
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview));



// Delete Review
// DELETE /listings/:id/reviews/:reviewId
router.delete(
    "/:reviewId", isLoggedIn, isReviewAuthor,
    wrapAsync(reviewController.deleteReview));

module.exports = router;