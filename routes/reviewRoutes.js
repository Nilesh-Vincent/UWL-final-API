const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

//USER ROUTES
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user'),
    reviewController.isUserPostedReview,
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user'),
    reviewController.isUserPostedReview,
    reviewController.deleteReview
  );

//ADMIN ROUTES
router
  .route('/admin/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('admin'),
    reviewController.deleteReview
  );

module.exports = router;

