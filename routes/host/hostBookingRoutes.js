const express = require('express');
const bookingController = require('../../controllers/bookingController');
const authController = require('../../controllers/authController');
const pointController = require('../../controllers/pointController');

const router = express.Router();

router.use(authController.protect);

//HOST ROUTES
router
  .route('/')
  .get(
    authController.restrictTo('host'),
    bookingController.getAllBookingsByHost
  );

router
  .route('/:bookingId')
  .get(authController.restrictTo('host'), bookingController.getBookingByHost);

router
  .route('/cancel-booking/:bookingId')
  .patch(
    authController.restrictTo('host'),
    bookingController.cancelBookingByHost
  );

router
  .route('/update/scuba-diving/:bookingId')
  .patch(
    authController.restrictTo('host'),
    pointController.updateScubaDivingByHost
  );

router
  .route('/update/rock-climbing/:bookingId')
  .patch(
    authController.restrictTo('host'),
    pointController.updateRockClimbingInfoByHost
  );

router
  .route('/update/trekking/:bookingId')
  .patch(
    authController.restrictTo('host'),
    pointController.updateTrekkingInfoByHost
  );

router
  .route('/update/white-water-rafting/:bookingId')
  .patch(
    authController.restrictTo('host'),
    pointController.updateWhiteWaterRaftingByHost
  );

router
  .route('/update/paragliding/:bookingId')
  .patch(
    authController.restrictTo('host'),
    pointController.updateparaglidingByHost
  );

router
  .route('/update/wildlife-safari/:bookingId')
  .patch(
    authController.restrictTo('host'),
    pointController.updatewildlifeSafariInfoByHost
  );

module.exports = router;
