const express = require('express');
const bookingController = require('../../controllers/bookingController');
const authController = require('../../controllers/authController');

const router = express.Router();

//remember this is just a demo route created to complete the booking via stripe success url.
router.route('/complete-booking').get(bookingController.createBookingCheckout);

router.use(authController.protect);

//USER ROUTES
router
  .route('/checkout-session/:tourId')
  .get(authController.protect, bookingController.getCheckoutSession);

router.route('/').get(bookingController.getMyBookings);

router.route('/:bookingId').get(bookingController.getMyBooking);

router
  .route('/cancel-booking/:bookingId')
  .patch(bookingController.cancelBooking);

module.exports = router;
