const express = require('express');
const tourController = require('../../controllers/tourController');
const authController = require('../../controllers/authController');

const router = express.Router();

//FOR HOSTS

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('host'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('host'),
    tourController.isHostPostedTour,
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('host'),
    tourController.isHostPostedTour,
    tourController.deleteTour
  );

module.exports = router;
