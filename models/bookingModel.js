const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!'],
  },
  host: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    require: [true, 'A Booking tour must have a Host.'],
  },
  price: {
    type: Number,
    require: [true, 'Booking must have a price.'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
  categoryType: {
    type: String,
    required: [true, 'A tour must have a category'],
  },
  participated: {
    type: Boolean,
    required: [true, 'Participated status is mandatory for point allocation'],
    default: false,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'cancelled by host'],
    default: 'confirmed',
  },

  scubaDivingInfo: {
    duration: {
      type: Number,
      default: 0,
      enum: [0, 0.3, 1, 1.3, 2, 2.3, 3, 3.5, 4], //if user is between 0.30 - 1.30 will get 1 point and between 1.30 - 3 will get 2 marks and above that 3 marks
    },
    depth: {
      type: Number,
      default: 0,
      enum: [0, 5, 10, 15, 20, 25, 30, 35, 40], // If user going to deph between 5 - 15 will get 1 point, 20 - 35 2 points and above that will get 3 points
    },
    age: {
      type: Number,
      default: 0, // If user age is between 18 - 30 will get 1 point, 30 - 45 will get 2 points and above that will get 3 points
    },
    accuracyOfDescent: {
      type: String,
      default: 'Not Specified Yet', // If user age is average will get 1 point, accurate will get 2 points and very accurate will get 3 points
      enum: ['Average', 'Accurate', 'Very accurate', 'Not Specified Yet'],
    },
  },
  paraglidingInfo: {
    flightDuration: {
      type: Number,
      default: 0,
      enum: [0, 0.3, 1, 1.3, 2, 2.3],
    },
    altitudeReached: {
      type: Number,
      default: 0,
      enum: [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000],
    },
    distanceTraveled: {
      type: Number,
      default: 0,
      enum: [0, 5, 10, 15, 20, 25, 30, 35, 40],
    },
    accuracyOfLanding: {
      type: String,
      default: 'Not Specified Yet',
      enum: ['Average', 'Accurate', 'Very accurate', 'Not Specified Yet'],
    },
    age: {
      type: Number,
      default: 0,
    },
    weather: {
      type: String,
      default: 'Sunny',
      enum: ['Sunny', 'Cloudy', 'Rainy'],
    },
    avgWindSpeed: {
      type: String,
      default: '0',
    },
  },
  points: {
    type: Number,
    default: 0,
  },
  pointsUpdated: {
    type: Boolean,
    default: false,
  },
});

bookingSchema.pre('save', function (next) {
  if (this.categoryType !== 'scuba diving') {
    this.scubaDivingInfo = undefined;
  }

  if (this.categoryType !== 'paragliding') {
    this.paraglidingInfo = undefined;
  }

  next();
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
