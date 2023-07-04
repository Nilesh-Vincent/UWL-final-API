const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();


//FOR USERS

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/')
  .get(tourController.getAllTours)

router.get('/host-tours/:hostId', tourController.getAllToursForHost);

// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/:id').get(tourController.getTour)


//FOR HOSTS

router
  .route('/host/post')
  .post(
    authController.protect,
    authController.restrictTo('host'),
    tourController.createTour
  );

router
  .route('/host/tour/:id')
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
    authController.restrictTo( 'host'),
    tourController.isHostPostedTour,
    tourController.deleteTour
  );


//FOR ADMIN 
router
  .route('/admin/tour/:id')
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
