const express = require('express');
const bookingController = require('../../controllers/bookingController');
const authController = require('../../controllers/authController');

const router = express.Router();

//ADMIN ROUTES

router.use(authController.protect);

router
  .route('/')
  .get(authController.restrictTo('admin'), bookingController.getAllBookings);

router
  .route('/:id')
  .get(authController.restrictTo('admin'), bookingController.getBooking)
  .patch(authController.restrictTo('admin'), bookingController.updateBooking)
  .delete(authController.restrictTo('admin'), bookingController.deleteBooking);

module.exports = router;
