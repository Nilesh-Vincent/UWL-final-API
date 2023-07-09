const express = require('express');
const tourController = require('../../controllers/tourController');
const reviewUserRoutes = require('./userReviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewUserRoutes);

router.route('/').get(tourController.getAllTours);

router.get('/host/:hostId', tourController.getAllToursForHost);

// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/:id').get(tourController.getTour);

module.exports = router;
