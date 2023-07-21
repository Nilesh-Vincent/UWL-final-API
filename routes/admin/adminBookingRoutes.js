const express = require('express');
const bookingController = require('../../controllers/bookingController');
const authController = require('../../controllers/authController');

const router = express.Router();

// Protect and restrict access to all routes for admin
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(bookingController.getAllBookings);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
