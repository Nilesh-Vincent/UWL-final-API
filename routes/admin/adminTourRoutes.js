const express = require('express');
const tourController = require('../../controllers/tourController');
const authController = require('../../controllers/authController');
const adminReviewRouter = require('./adminReviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', adminReviewRouter);

//FOR ADMIN
router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.deleteTour
  );

module.exports = router;
