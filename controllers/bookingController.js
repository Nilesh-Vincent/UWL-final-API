const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],

    success_url: `http://localhost:5000/api/v1/bookings/complete-booking/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}&categoryType=${tour.categoryType}&host=${tour.host._id}`,

    cancel_url: `http://localhost:5173/cancel`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://localhost:5000/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  console.log(`the id is ${tour.host._id}`);

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { tour, user, price, categoryType, host } = req.query;

  if (!tour && !user && !price && !categoryType && !host) return next();

  console.log(`host is ${host}`);

  await Booking.create({ tour, user, price, categoryType, host });

  const success = 'http://localhost:5173/my-bookings';

  res.redirect(success);
});

//USER CONTROLLERS

exports.getMyBookings = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // Find bookings based on the user ID
  const bookings = await Booking.find({ user: userId });

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

exports.getMyBooking = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const bookingId = req.params.bookingId;

  // Find the booking based on the user ID and booking ID
  const booking = await Booking.findOne({ _id: bookingId, user: userId });

  if (!booking) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

exports.cancelBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.bookingId);

  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  if (req.user.id != booking.user._id) {
    return next(
      new AppError('You are not authorized to cancel this booking', 401)
    );
  }

  booking.status = 'cancelled';

  await Booking.updateOne(
    { _id: booking._id },
    { $set: { status: 'cancelled' } }
  );

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

//HOST CONTROLLERS

exports.getAllBookingsByHost = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ host: req.user.id });

  console.log(bookings);

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

exports.getBookingByHost = catchAsync(async (req, res) => {
  const booking = await Booking.findOne({
    host: req.user.id,
    _id: req.params.bookingId,
  });

  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

exports.cancelBookingByHost = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.bookingId);

  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  if (req.user.id != booking.host) {
    return next(
      new AppError('You are not authorized to cancel this booking', 401)
    );
  }

  booking.status = 'cancelled by host';

  await Booking.updateOne(
    { _id: booking._id },
    { $set: { status: 'cancelled' } }
  );

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

//ADMIN ROUTES
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
