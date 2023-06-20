const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();

//remember this is just a demo route created to complete the booking via stripe success url.
router.route('/complete-booking').get(bookingController.createBookingCheckout);

router.use(authController.protect);

router
  .route('/checkout-session/:tourId')
  .get(authController.protect, bookingController.getCheckoutSession);

router.route('/my-bookings').get(bookingController.getMyBookings);
router.route('/my-booking/:bookingId').get(bookingController.getMyBooking);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

router
  .route('/update-scuba-diving/:bookingId')
  .patch(bookingController.updateVariablesAndParticipantStatus);

module.exports = router;
