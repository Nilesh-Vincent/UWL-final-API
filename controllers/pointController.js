const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.updateScubaDivingByHost = catchAsync(async (req, res, next) => {
  const bookingId = req.params.bookingId;
  const { scubaDivingInfo } = req.body;

  const booking = await Booking.findById(bookingId);

  if (booking.host != req.user.id) {
    return next(
      new AppError('You are not authorized as host for this tour', 404)
    );
  }

  if (!booking) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (!booking.categoryType == 'scuba diving') {
    return next(
      new AppError(
        'This is not Scuba Diving Categroy So use correct route to update',
        404
      )
    );
  }

  if (!scubaDivingInfo) {
    return next(new AppError('Please Provide Scuba Diving Information', 404));
  }

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
    points += 2;
  } else if (
    scubaDivingInfo.duration > 1.3 &&
    scubaDivingInfo.duration <= 3.0
  ) {
    points += 4;
  } else if (scubaDivingInfo.duration > 3.0) {
    points += 6;
  }

  // Calculate points based on depth
  if (scubaDivingInfo.depth >= 5 && scubaDivingInfo.depth <= 15) {
    points += 2;
  } else if (scubaDivingInfo.depth > 15 && scubaDivingInfo.depth <= 35) {
    points += 4;
  } else if (scubaDivingInfo.depth > 35) {
    points += 6;
  }

  // Calculate points based on age
  if (scubaDivingInfo.age >= 18 && scubaDivingInfo.age <= 30) {
    points += 2;
  } else if (scubaDivingInfo.age > 30 && scubaDivingInfo.age <= 45) {
    points += 4;
  } else if (scubaDivingInfo.age > 45) {
    points += 6;
  }

  // Calculate points based on accuracy of descent
  if (scubaDivingInfo.accuracyOfDescent === 'Accurate') {
    points += 2;
  } else if (scubaDivingInfo.accuracyOfDescent === 'Very accurate') {
    points += 4;
  } else if (scubaDivingInfo.accuracyOfDescent === 'Average') {
    points += 6;
  }

  // Calculate points based on underwater navigation
  if (scubaDivingInfo.underwaterNavigation === 'Average') {
    points += 2;
  } else if (scubaDivingInfo.underwaterNavigation === 'Accurate') {
    points += 4;
  } else if (scubaDivingInfo.underwaterNavigation === 'Very accurate') {
    points += 6;
  }

  // Calculate points based on marine life encounters
  if (scubaDivingInfo.marineLifeEncounters === 'Few') {
    points += 2;
  } else if (scubaDivingInfo.marineLifeEncounters === 'Moderate') {
    points += 4;
  } else if (scubaDivingInfo.marineLifeEncounters === 'Abundant') {
    points += 6;
  }

  // Calculate the final points out of 10
  const maxPoints = 36; // Maximum points possible
  const pointsOutOf10 = Math.round((points / maxPoints) * 10);

  // Set the calculated points in the schema
  booking.points = pointsOutOf10;

  await User.updateOne(
    { _id: booking.user }, // Find the user by their ID
    {
      $inc: {
        points: pointsOutOf10,
      },
      $inc: {
        'activityPoints.paraglidingPoints': pointsOutOf10,
      },
    },

    {
      new: true, // Return the updated user document
      runValidators: true, // Run validators on the update operation
    }
  );

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
});

exports.updateparaglidingByHost = catchAsync(async (req, res, next) => {
  const bookingId = req.params.bookingId;
  const { paraglidingInfo } = req.body;

  const booking = await Booking.findById(bookingId);

  if (booking.host != req.user.id) {
    return next(
      new AppError('You are not authorized as host for this tour', 404)
    );
  }

  if (!booking) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (!booking.categoryType == 'paragliding') {
    return next(
      new AppError(
        'This is not paragliding Categroy So use correct route to update',
        404
      )
    );
  }

  if (!paraglidingInfo) {
    return next(new AppError('Please Provide paragliding Information', 404));
  }

  // Check if the points have already been updated for this booking
  if (booking.pointsUpdated) {
    return res.status(400).json({
      status: 'error',
      message: 'Points have already been updated for this booking.',
    });
  }

  // Update the scubaDivingInfo field
  booking.paraglidingInfo = paraglidingInfo;

  // Calculate the points for scuba diving
  let points = 0;

  // Calculate points based on flight duration
  if (
    paraglidingInfo.flightDuration >= 0.3 &&
    paraglidingInfo.flightDuration <= 1
  ) {
    points += 2;
  } else if (
    paraglidingInfo.flightDuration > 1 &&
    paraglidingInfo.flightDuration <= 2
  ) {
    points += 4;
  } else if (paraglidingInfo.flightDuration > 2) {
    points += 6;
  }

  // Calculate points based on altitude reached
  if (
    paraglidingInfo.altitudeReached >= 0 &&
    paraglidingInfo.altitudeReached <= 1500
  ) {
    points += 2;
  } else if (
    paraglidingInfo.altitudeReached > 1500 &&
    paraglidingInfo.altitudeReached <= 3000
  ) {
    points += 4;
  } else if (paraglidingInfo.altitudeReached > 3000) {
    points += 6;
  }

  // Calculate points based on distance traveled
  if (
    paraglidingInfo.distanceTraveled >= 0 &&
    paraglidingInfo.distanceTraveled <= 15
  ) {
    points += 2;
  } else if (
    paraglidingInfo.distanceTraveled > 15 &&
    paraglidingInfo.distanceTraveled <= 30
  ) {
    points += 4;
  } else if (paraglidingInfo.distanceTraveled > 30) {
    points += 6;
  }

  // Calculate points based on accuracy of landing
  if (paraglidingInfo.accuracyOfLanding === 'Average') {
    points += 2;
  } else if (paraglidingInfo.accuracyOfLanding === 'Accurate') {
    points += 4;
  } else if (paraglidingInfo.accuracyOfLanding === 'Very accurate') {
    points += 6;
  }

  // Calculate points based on weather
  if (paraglidingInfo.weather === 'Sunny') {
    points += 2;
  } else if (paraglidingInfo.weather === 'Cloudy') {
    points += 4;
  } else if (paraglidingInfo.weather === 'Rainy') {
    points += 6;
  }

  // Calculate points based on average wind speed
  if (paraglidingInfo.avgWindSpeed >= 0 && paraglidingInfo.avgWindSpeed <= 10) {
    points += 2;
  } else if (
    paraglidingInfo.avgWindSpeed > 10 &&
    paraglidingInfo.avgWindSpeed <= 20
  ) {
    points += 4;
  } else if (paraglidingInfo.avgWindSpeed > 20) {
    points += 6;
  }

  // Calculate points based on age
  if (paraglidingInfo.age >= 18 && paraglidingInfo.age <= 30) {
    points += 2;
  } else if (paraglidingInfo.age > 30 && paraglidingInfo.age <= 45) {
    points += 4;
  } else if (paraglidingInfo.age > 45) {
    points += 6;
  }

  // Calculate the final points out of 10
  const maxPoints = 42; // Maximum points possible
  const pointsOutOf10 = Math.round((points / maxPoints) * 10);

  // Set the calculated points in the schema
  booking.points = pointsOutOf10;

  await User.updateOne(
    { _id: booking.user }, // Find the user by their ID
    {
      $inc: {
        points: pointsOutOf10,
      },
      $inc: {
        'activityPoints.paraglidingPoints': pointsOutOf10,
      },
    },

    {
      new: true, // Return the updated user document
      runValidators: true, // Run validators on the update operation
    }
  );

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
});

exports.updateWhiteWaterRaftingByHost = catchAsync(async (req, res, next) => {
  const bookingId = req.params.bookingId;
  const { whiteWaterRaftingInfo } = req.body;

  const booking = await Booking.findById(bookingId);

  if (booking.host != req.user.id) {
    return next(
      new AppError('You are not authorized as host for this tour', 404)
    );
  }

  if (!booking) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (!booking.categoryType == 'white water rafting') {
    return next(
      new AppError(
        'This is not white water rafting Categroy So use correct route to update',
        404
      )
    );
  }

  if (!whiteWaterRaftingInfo) {
    return next(
      new AppError('Please Provide white water rafting Information', 404)
    );
  }

  // Check if the points have already been updated for this booking
  if (booking.pointsUpdated) {
    return res.status(400).json({
      status: 'error',
      message: 'Points have already been updated for this booking.',
    });
  }

  // Update the scubaDivingInfo field
  booking.whiteWaterRaftingInfo = whiteWaterRaftingInfo;

  // Calculate the points for scuba diving
  let points = 0;

  // Calculate points based on river difficulty
  if (whiteWaterRaftingInfo.riverDifficulty === 'Class 1') {
    points += 2;
  } else if (
    whiteWaterRaftingInfo.riverDifficulty === 'Class 2' ||
    whiteWaterRaftingInfo.riverDifficulty === 'Class 3'
  ) {
    points += 4;
  } else if (
    whiteWaterRaftingInfo.riverDifficulty === 'Class 4' ||
    whiteWaterRaftingInfo.riverDifficulty === 'Class 5'
  ) {
    points += 6;
  }

  // Calculate points based on raft control
  if (whiteWaterRaftingInfo.raftControl === 'Beginner') {
    points += 2;
  } else if (whiteWaterRaftingInfo.raftControl === 'Intermediate') {
    points += 4;
  } else if (whiteWaterRaftingInfo.raftControl === 'Advanced') {
    points += 6;
  }

  // Calculate points based on duration
  if (
    whiteWaterRaftingInfo.duration >= 0.3 &&
    whiteWaterRaftingInfo.duration <= 1.3
  ) {
    points += 2;
  } else if (
    whiteWaterRaftingInfo.duration > 1.3 &&
    whiteWaterRaftingInfo.duration <= 4
  ) {
    points += 4;
  } else if (whiteWaterRaftingInfo.duration > 4) {
    points += 6;
  }

  // Calculate points based on weather
  if (whiteWaterRaftingInfo.weather === 'Sunny') {
    points += 2;
  } else if (whiteWaterRaftingInfo.weather === 'Cloudy') {
    points += 4;
  } else if (whiteWaterRaftingInfo.weather === 'Rainy') {
    points += 6;
  }

  // Calculate points based on obstacles
  if (whiteWaterRaftingInfo.obstacles === 'Few') {
    points += 2;
  } else if (whiteWaterRaftingInfo.obstacles === 'Moderate') {
    points += 4;
  } else if (whiteWaterRaftingInfo.obstacles === 'Many') {
    points += 6;
  }

  // Calculate points based on team work
  if (whiteWaterRaftingInfo.teamWork === 'Bad') {
    points += 2;
  } else if (whiteWaterRaftingInfo.teamWork === 'Average') {
    points += 4;
  } else if (whiteWaterRaftingInfo.teamWork === 'Good') {
    points += 6;
  }

  // Calculate points based on age
  if (whiteWaterRaftingInfo.age >= 18 && whiteWaterRaftingInfo.age <= 30) {
    points += 2;
  } else if (
    whiteWaterRaftingInfo.age > 30 &&
    whiteWaterRaftingInfo.age <= 45
  ) {
    points += 4;
  } else if (whiteWaterRaftingInfo.age > 45) {
    points += 6;
  }

  // Calculate the final points out of 10
  const maxPoints = 42; // Maximum points possible
  const pointsOutOf10 = Math.round((points / maxPoints) * 10);

  // Set the calculated points in the schema
  booking.points = pointsOutOf10;

  await User.updateOne(
    { _id: booking.user }, // Find the user by their ID
    {
      $inc: {
        points: pointsOutOf10,
      },
      $inc: {
        'activityPoints.whiteWaterRaftingPoints': pointsOutOf10,
      },
    },

    {
      new: true, // Return the updated user document
      runValidators: true, // Run validators on the update operation
    }
  );

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
});

exports.updateRockClimbingInfoByHost = catchAsync(async (req, res, next) => {
  const bookingId = req.params.bookingId;
  const { rockClimbingInfo } = req.body;

  const booking = await Booking.findById(bookingId);

  if (booking.host != req.user.id) {
    return next(
      new AppError('You are not authorized as host for this tour', 404)
    );
  }

  if (!booking) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (!booking.categoryType == 'rock climbing') {
    return next(
      new AppError(
        'This is not rock climbing Categroy So use correct route to update',
        404
      )
    );
  }

  if (!rockClimbingInfo) {
    return next(new AppError('Please Provide rock climbing Information', 404));
  }

  // Check if the points have already been updated for this booking
  if (booking.pointsUpdated) {
    return res.status(400).json({
      status: 'error',
      message: 'Points have already been updated for this booking.',
    });
  }

  // Update the scubaDivingInfo field
  booking.rockClimbingInfo = rockClimbingInfo;

  // Calculate the points for scuba diving
  let points = 0;

  // Calculate points based on duration
  if (rockClimbingInfo.duration >= 0.3 && rockClimbingInfo.duration <= 1.3) {
    points += 2;
  } else if (
    rockClimbingInfo.duration > 1.3 &&
    rockClimbingInfo.duration <= 4
  ) {
    points += 4;
  } else if (rockClimbingInfo.duration > 4) {
    points += 6;
  }

  // Calculate points based on accuracy of climbing
  if (rockClimbingInfo.accuracyOfClimbing === 'Average') {
    points += 2;
  } else if (rockClimbingInfo.accuracyOfClimbing === 'Good') {
    points += 4;
  } else if (rockClimbingInfo.accuracyOfClimbing === 'Excellent') {
    points += 6;
  }

  // Calculate points based on height climbed
  if (
    rockClimbingInfo.heightClimbed >= 0 &&
    rockClimbingInfo.heightClimbed <= 100
  ) {
    points += 1;
  } else if (
    rockClimbingInfo.heightClimbed > 100 &&
    rockClimbingInfo.heightClimbed <= 250
  ) {
    points += 2;
  } else if (rockClimbingInfo.heightClimbed > 250) {
    points += 3;
  }

  // Calculate points based on obstacles
  if (rockClimbingInfo.obstacles === 'Few') {
    points += 2;
  } else if (rockClimbingInfo.obstacles === 'Moderate') {
    points += 4;
  } else if (rockClimbingInfo.obstacles === 'Many') {
    points += 6;
  }

  // Calculate points based on team work
  if (rockClimbingInfo.teamWork === 'Bad') {
    points += 2;
  } else if (rockClimbingInfo.teamWork === 'Average') {
    points += 4;
  } else if (rockClimbingInfo.teamWork === 'Good') {
    points += 6;
  }

  // Calculate points based on age
  if (rockClimbingInfo.age >= 18 && rockClimbingInfo.age <= 30) {
    points += 2;
  } else if (rockClimbingInfo.age > 30 && rockClimbingInfo.age <= 45) {
    points += 4;
  } else if (rockClimbingInfo.age > 45) {
    points += 6;
  }

  // Calculate the final points out of 10
  const maxPoints = 42; // Maximum points possible
  const pointsOutOf10 = Math.round((points / maxPoints) * 10);

  // Set the calculated points in the schema
  booking.points = pointsOutOf10;

  await User.updateOne(
    { _id: booking.user }, // Find the user by their ID
    {
      $inc: {
        points: pointsOutOf10,
      },
      $inc: {
        'activityPoints.rockClimbingPoints': pointsOutOf10,
      },
    },

    {
      new: true, // Return the updated user document
      runValidators: true, // Run validators on the update operation
    }
  );

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
});

exports.updateTrekkingInfoByHost = catchAsync(async (req, res, next) => {
  const bookingId = req.params.bookingId;
  const { trekkingInfo } = req.body;

  const booking = await Booking.findById(bookingId);

  if (booking.host != req.user.id) {
    return next(
      new AppError('You are not authorized as host for this tour', 404)
    );
  }

  if (!booking) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (!booking.categoryType == 'trekking') {
    return next(
      new AppError(
        'This is not trekking Categroy So use correct route to update',
        404
      )
    );
  }

  if (!trekkingInfo) {
    return next(new AppError('Please Provide trekking Information', 404));
  }

  // Check if the points have already been updated for this booking
  if (booking.pointsUpdated) {
    return res.status(400).json({
      status: 'error',
      message: 'Points have already been updated for this booking.',
    });
  }

  // Update the scubaDivingInfo field
  booking.trekkingInfo = trekkingInfo;

  // Calculate the points for scuba diving
  let points = 0;

  // Calculate points based on duration
  if (trekkingInfo.duration >= 0.3 && trekkingInfo.duration <= 1.3) {
    points += 1;
  } else if (trekkingInfo.duration > 1.3 && trekkingInfo.duration <= 2) {
    points += 2;
  } else if (trekkingInfo.duration > 2) {
    points += 3;
  }

  // Calculate points based on distance
  if (trekkingInfo.distance >= 1 && trekkingInfo.distance <= 20) {
    points += 1;
  } else if (trekkingInfo.distance > 20 && trekkingInfo.distance <= 50) {
    points += 2;
  } else if (trekkingInfo.distance > 50) {
    points += 3;
  }

  // Calculate points based on weather
  if (trekkingInfo.weather === 'Sunny') {
    points += 1;
  } else if (trekkingInfo.weather === 'Cloudy') {
    points += 2;
  } else if (trekkingInfo.weather === 'Rainy') {
    points += 3;
  }

  // Calculate points based on altitude
  if (trekkingInfo.altitude >= 0 && trekkingInfo.altitude <= 750) {
    points += 1;
  } else if (trekkingInfo.altitude > 750 && trekkingInfo.altitude <= 1500) {
    points += 2;
  } else if (trekkingInfo.altitude > 1500) {
    points += 3;
  }

  // Calculate points based on team work
  if (trekkingInfo.teamWork === 'Bad') {
    points += 1;
  } else if (trekkingInfo.teamWork === 'Average') {
    points += 2;
  } else if (trekkingInfo.teamWork === 'Good') {
    points += 3;
  }

  // Calculate points based on age
  if (trekkingInfo.age >= 18 && trekkingInfo.age <= 30) {
    points += 1;
  } else if (trekkingInfo.age > 30 && trekkingInfo.age <= 45) {
    points += 2;
  } else if (trekkingInfo.age > 45) {
    points += 3;
  }

  // Calculate the final points out of 10
  const maxPoints = 42; // Maximum points possible
  const pointsOutOf10 = Math.round((points / maxPoints) * 10);

  // Set the calculated points in the schema
  booking.points = pointsOutOf10;

  await User.updateOne(
    { _id: booking.user }, // Find the user by their ID
    {
      $inc: {
        points: pointsOutOf10,
      },
      $inc: {
        'activityPoints.trekkingPoints': pointsOutOf10,
      },
    },

    {
      new: true, // Return the updated user document
      runValidators: true, // Run validators on the update operation
    }
  );

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
});

exports.updatewildlifeSafariInfoByHost = catchAsync(async (req, res, next) => {
  const bookingId = req.params.bookingId;
  const { wildlifeSafariInfo } = req.body;

  const booking = await Booking.findById(bookingId);

  if (booking.host != req.user.id) {
    return next(
      new AppError('You are not authorized as host for this tour', 404)
    );
  }

  if (!booking) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (!booking.categoryType == 'wildlife safari') {
    return next(
      new AppError(
        'This is not wildlife safari Categroy So use correct route to update',
        404
      )
    );
  }

  if (!wildlifeSafariInfo) {
    return next(
      new AppError('Please Provide wildlife safari Information', 404)
    );
  }

  // Check if the points have already been updated for this booking
  if (booking.pointsUpdated) {
    return res.status(400).json({
      status: 'error',
      message: 'Points have already been updated for this booking.',
    });
  }

  // Update the scubaDivingInfo field
  booking.wildlifeSafariInfo = wildlifeSafariInfo;

  // Calculate the points for scuba diving
  let points = 0;

  // Calculate points based on distance
  if (wildlifeSafariInfo.distance >= 1 && wildlifeSafariInfo.distance <= 10) {
    points += 1;
  } else if (
    wildlifeSafariInfo.distance > 10 &&
    wildlifeSafariInfo.distance <= 20
  ) {
    points += 2;
  } else if (wildlifeSafariInfo.distance > 20) {
    points += 3;
  }

  // Calculate points based on duration
  if (
    wildlifeSafariInfo.duration >= 0.3 &&
    wildlifeSafariInfo.duration <= 1.3
  ) {
    points += 1;
  } else if (
    wildlifeSafariInfo.duration > 1.3 &&
    wildlifeSafariInfo.duration <= 2
  ) {
    points += 2;
  } else if (wildlifeSafariInfo.duration > 2) {
    points += 3;
  }

  // Calculate points based on photography opportunities
  if (
    wildlifeSafariInfo.photographyOpportunities >= 1 &&
    wildlifeSafariInfo.photographyOpportunities <= 5
  ) {
    points += 1;
  } else if (
    wildlifeSafariInfo.photographyOpportunities > 5 &&
    wildlifeSafariInfo.photographyOpportunities <= 10
  ) {
    points += 2;
  } else if (wildlifeSafariInfo.photographyOpportunities > 10) {
    points += 3;
  }

  // Calculate points based on wildlife encounters
  if (
    wildlifeSafariInfo.wildlifeEncounters >= 0 &&
    wildlifeSafariInfo.wildlifeEncounters <= 5
  ) {
    points += 1;
  } else if (
    wildlifeSafariInfo.wildlifeEncounters > 5 &&
    wildlifeSafariInfo.wildlifeEncounters <= 10
  ) {
    points += 2;
  } else if (wildlifeSafariInfo.wildlifeEncounters > 10) {
    points += 3;
  }

  // Calculate points based on age
  if (wildlifeSafariInfo.age >= 18 && wildlifeSafariInfo.age <= 30) {
    points += 2;
  } else if (wildlifeSafariInfo.age > 30 && wildlifeSafariInfo.age <= 45) {
    points += 4;
  } else if (wildlifeSafariInfo.age > 45) {
    points += 6;
  }

  // Calculate the final points out of 10
  const maxPoints = 42; // Maximum points possible
  const pointsOutOf10 = Math.round((points / maxPoints) * 10);

  // Set the calculated points in the schema
  booking.points = pointsOutOf10;

  await User.updateOne(
    { _id: booking.user }, // Find the user by their ID
    {
      $inc: {
        points: pointsOutOf10,
      },
      $inc: {
        'activityPoints.wildlifeSafariPoints': pointsOutOf10,
      },
    },

    {
      new: true, // Return the updated user document
      runValidators: true, // Run validators on the update operation
    }
  );

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
});
