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

    success_url: `http://localhost:5000/api/v1/bookings/complete-booking/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}&categoryType=${tour.categoryType}`,

    cancel_url: `http://localhost:5173/cancel`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { tour, user, price, categoryType } = req.query;

  if (!tour && !user && !price && !categoryType) return next();
  await Booking.create({ tour, user, price, categoryType });

  const success = 'http://localhost:5173/success';

  res.redirect(success);
});

exports.getMyBookings = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // Find bookings based on the user ID
  const bookings = await Booking.find({ user: userId });

  res.status(200).json({
    status: 'success',
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

exports.updateVariablesAndParticipantStatus = catchAsync(
  async (req, res, next) => {
    const bookingId = req.params.bookingId;
    const { scubaDivingInfo } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return next(new AppError('No document found with that ID', 404));
    }

    if (scubaDivingInfo) {
      // Check if the points have already been updated for this booking
      if (booking.pointsUpdated) {
        return res.status(400).json({
          status: 'error',
          message: 'Points have already been updated for this booking.',
        });
      }

      // Update the scubaDivingInfo field
      booking.scubaDivingInfo = scubaDivingInfo;

      // Calculate the points for scuba diving
      let points = 0;

      // Calculate points based on duration
      if (scubaDivingInfo.duration >= 0.3 && scubaDivingInfo.duration <= 1.3) {
        points += 1;
      } else if (
        scubaDivingInfo.duration > 1.3 &&
        scubaDivingInfo.duration <= 3
      ) {
        points += 2;
      } else if (scubaDivingInfo.duration > 3) {
        points += 3;
      }

      // Calculate points based on depth
      if (scubaDivingInfo.depth >= 5 && scubaDivingInfo.depth <= 15) {
        points += 1;
      } else if (scubaDivingInfo.depth > 15 && scubaDivingInfo.depth <= 35) {
        points += 2;
      } else if (scubaDivingInfo.depth > 35) {
        points += 3;
      }

      // Calculate points based on age
      if (scubaDivingInfo.age >= 18 && scubaDivingInfo.age <= 30) {
        points += 1;
      } else if (scubaDivingInfo.age > 30 && scubaDivingInfo.age <= 45) {
        points += 2;
      } else if (scubaDivingInfo.age > 45) {
        points += 3;
      }

      // Calculate points based on accuracy of descent
      if (scubaDivingInfo.accuracyOfDescent === 'Accurate') {
        points += 2;
      } else if (scubaDivingInfo.accuracyOfDescent === 'Very accurate') {
        points += 3;
      } else if (scubaDivingInfo.accuracyOfDescent === 'Average') {
        points += 1;
      }

      // Set the calculated points in the schema
      booking.points = points;

      // Update the User model's points only if it hasn't been updated before
      await User.updateOne(
        { _id: booking.user }, // Find the user by their ID
        { $inc: { points: points } }, // Increment the points field by adding the new points
        {
          new: true, // Return the updated user document
          runValidators: true, // Run validators on the update operation
        }
      );
    }

    // Set the 'participated' field to true and the points updated field to true
    booking.participated = true;
    booking.pointsUpdated = true;

    // Save the updated booking document
    const updatedBooking = await booking.save();

    res.json({
      status: 'success',
      data: {
        booking: updatedBooking,
      },
    });
  }
);

exports.updateBooking = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    'tour',
    'user',
    'price',
    'categoryType',
    'paid'
  );

  const booking = await Booking.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!booking) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
