const Review = require('./../models/reviewModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError')

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

exports.isUserPostedReview = catchAsync(async (req, res, next) => {
  if (req.user.role === 'admin') {
    return next();
  }

  try {
    const review = await Review.findById(req.params.id);

    console.log(review)

    if (req.user.id != review.user._id) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
  } catch (err) {
    return next(new AppError('Error finding tour', 500));
  }

  next();
});


exports.createReview = catchAsync(async (req, res, next) => {
  const { user, tour } = req.body;

  // Check if the user has booked the tour at least once
  const bookings = await Booking.find({ 'user': user, tour:tour });

  if (bookings.length === 0) {
    return next(new AppError('User has not booked the tour', 403));
  }

  // User has booked the tour, create the review
  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});

