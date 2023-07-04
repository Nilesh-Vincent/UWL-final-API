const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

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



//HOST ROUTES
router
  .route('/host/bookings')
  .get(authController.restrictTo('host'), bookingController.getAllBookingsByHost)

router
  .route('/host/booking/:bookingId')
  .get(authController.restrictTo('host'),bookingController.getBookingByHost)

router
  .route('/host/cancel-booking/:bookingId')
  .patch(authController.restrictTo('host'),bookingController.cancelBookingByHost);
router
  .route('/host/update-scuba-diving/:bookingId')
  .patch(authController.restrictTo('host'),bookingController.updateScubaDivingByHost);



//ADMIN ROUTES
router
  .route('/admin/bookings')
  .get(authController.restrictTo('admin'), bookingController.getAllBookings)

router
  .route('/admin/booking/:id')
  .get(authController.restrictTo('admin'),bookingController.getBooking)
  .patch(authController.restrictTo('admin'),bookingController.updateBooking)
  .delete(authController.restrictTo('admin'),bookingController.deleteBooking);

module.exports = router;

