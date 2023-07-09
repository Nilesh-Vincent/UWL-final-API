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
      enum: [0, 0.3, 1.0, 1.3, 2.0, 2.3, 3.0, 3.3, 4.0], //if user is between 0.30 - 1.30 will get 2 point and between 2.00 - 4 will get 2 marks and above that 6 marks
    },
    depth: {
      type: Number,
      default: 0,
      enum: [0, 5, 10, 15, 20, 25, 30, 35, 40], // If user going to deph between 5 - 15 will get 2 point, 20 - 35 4 points and above that will get 6 points
    },
    accuracyOfDescent: {
      type: String,
      default: 'Not Specified Yet', // If user age is average will get 2 point, accurate will get 4 points and very accurate will get 6 points
      enum: ['Average', 'Accurate', 'Very accurate', 'Not Specified Yet'],
    },
    underwaterNavigation: {
      type: String,
      default: 'Not Specified Yet', // average will get 2 point, accurate will get 4 points and very accurate will get 6 points
      enum: ['Average', 'Accurate', 'Very accurate', 'Not Specified Yet'],
    },
    marineLifeEncounters: {
      type: String,
      default: 'Not Specified Yet', // Default value when not specified
      enum: ['Few', 'Moderate', 'Abundant', 'Not Specified Yet'], // few will get 2 point, Moderate will get 4 points and Abundant will get 6 points
    },
    age: {
      type: Number,
      default: 0, // If user age is between 18 - 30 will get 2 point, 31 - 45 will get 4 points and above that will get 6 points
    },
  },

  paraglidingInfo: {
    flightDuration: {
      type: Number,
      default: 0,
      enum: [0, 0.3, 1, 1.3, 2, 2.3, 3], //if user is between 0.30 - 1.00 will get 2 point and between 1.30 - 2 will get 4 marks and above that 6 marks
    },
    altitudeReached: {
      type: Number,
      default: 0,
      enum: [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000], // If user going to deph between 0 - 1500 will get 2 point, 1501 - 3000 4 points and above 3000 will get 6 points
    },
    distanceTraveled: {
      type: Number,
      default: 0,
      enum: [0, 5, 10, 15, 20, 25, 30, 35, 40], //if user is between 0 - 15 will get 2 point and between 16 - 30 will get 4 marks and above that get 6 marks
    },
    accuracyOfLanding: {
      type: String,
      default: 'Not Specified Yet',
      enum: ['Average', 'Accurate', 'Very accurate', 'Not Specified Yet'], //Average 2 Mark and Accurate 4 marks and Very accurate will  get 6 marks
    },
    weather: {
      type: String,
      default: 'Sunny',
      enum: ['Sunny', 'Cloudy', 'Rainy'], //Sunny 2 Mark and Cloudy 4 marks and Rainy will  get 6 marks
    },
    avgWindSpeed: {
      type: Number,
      default: 0, // in here miles will be used and between 0,10 will get 2 point and 11 - 20 will get 4 points and above that will get 6 points
    },
    age: {
      type: Number,
      default: 0, // If user age is between 18 - 30 will get 2 point, 31 - 45 will get 4 points and above that will get 6 points
    },
  },

  whiteWaterRaftingInfo: {
    riverDifficulty: {
      type: String,
      default: 'Not Specified Yet',
      enum: [
        'Class 1',
        'Class 2',
        'Class 3',
        'Class 4',
        'Class 5',
        'Not Specified Yet', // between class 1 get 2 points and between class 2 & 3 get 4 points and class 4 &  5 get 6 points
      ],
    },
    raftControl: {
      type: String,
      default: 'Not Specified Yet',
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Not Specified Yet'], //Beginner - 2, Intermediate - 4, Advanced - 6,
    },
    duration: {
      type: Number,
      default: 0,
      enum: [0, 0.3, 1, 1.3, 2, 2.3, 3], //if user is between 0.30 - 1.30 will get 2 point and between 2.00 - 4 will get 2 marks and above that 6 marks
    },
    weather: {
      type: String,
      default: 'Sunny',
      enum: ['Sunny', 'Cloudy', 'Rainy'], //Sunny 2 Mark and Cloudy 4 marks and Rainy will get 6 marks
    },
    obstacles: {
      type: String,
      default: 'Not Specified Yet',
      enum: ['Not Specified Yet', 'Few', 'Moderate', 'Many'], //Few 2 Mark and Moderate 4 marks and Many will  get 6 marks
    },
    teamWork: {
      type: String,
      default: 'Not Specified Yet',
      enum: ['Not Specified Yet', 'Bad', 'Average', 'Good'], //Bad -2, Average-4, Good- 6
    },
    age: {
      type: Number,
      default: 0, // If user age is between 18 - 30 will get 2 point, 31 - 45 will get 4 points and above that will get 6 points
    },
  },

  rockClimbingInfo: {
    duration: {
      type: Number,
      default: 0,
      enum: [0, 0.3, 1, 1.3, 2, 2.3, 3], //if user is between 0.30 - 1.30 will get 2 point and between 2.00 - 4 will get 2 marks and above that 6 marks
    },
    accuracyOfClimbing: {
      type: String,
      enum: ['Average', 'Good', 'Excellent', 'Not Specified Yet'], // Average - 2, Good - 4, Excellent - 6
      default: 'Not Specified Yet',
    },

    heightClimbed: {
      type: Number,
      default: 0, //between 0 - 500 so 0 - 100 1 point and 100 - 250 2 points and more than that 3 points
    },

    obstacles: {
      type: String,
      default: 'Not Specified Yet',
      enum: ['Not Specified Yet', 'Few', 'Moderate', 'Many'], //Few 2 Mark and Moderate 4 marks and Many will  get 6 marks
    },
    teamWork: {
      type: String,
      default: 'Not Specified Yet',
      enum: ['Not Specified Yet', 'Bad', 'Average', 'Good'], //Bad -2, Average-4, Good- 6
    },
    age: {
      type: Number,
      default: 0, // If user age is between 18 - 30 will get 2 point, 31 - 45 will get 4 points and above that will get 6 points
    },
  },

  trekkingInfo: {
    duration: {
      type: Number,
      default: 0,
      enum: [0, 0.3, 1, 1.3, 2, 2.3, 3], //if user is between 0.30 - 1.30 will get 1 point and between 2.00 - 2 will get 2 marks and above that 3 marks
    },
    distance: {
      type: Number,
      default: 0, // 1-20 is point 1 and 21 - 50 points 2 and above than that 3 points
    },
    weather: {
      type: String,
      default: 'Sunny',
      enum: ['Sunny', 'Cloudy', 'Rainy'], //Sunny 1 Mark and Cloudy 2 marks and Rainy will get 3 marks
    },
    altitude: {
      type: Number,
      default: 0, // 0 -750 1 point and 751 - 1500 2 points and 1500+ 3 points
    },
    teamWork: {
      type: String,
      default: 'Not Specified Yet',
      enum: ['Not Specified Yet', 'Bad', 'Average', 'Good'], //Bad - 1 , Average- 2, Good- 3
    },
    age: {
      type: Number,
      default: 0, // If user age is between 18 - 30 will get 1 point, 31 - 45 will get 2 points and above that will get 3 points
    },
  },

  wildlifeSafariInfo: {
    distance: {
      type: Number,
      default: 0, // 1-10 km: 1 point, 11-20 km: 2 points, 21+ km: 3 points
    },
    duration: {
      type: Number,
      default: 0,
      enum: [0, 0.3, 1, 1.3, 2, 2.3, 3], //if user is between 0.30 - 1.30 will get 1 point and between 2.00 - 2 will get 2 marks and above that 3 marks
    },
    photographyOpportunities: {
      type: Number,
      default: 0, //  1-5 opportunities: 1 point, 6-10 opportunities: 2 points, 11+ opportunities: 3 points
    },

    wildlifeEncounters: {
      type: Number,
      default: 0, // For example, 0-5 encounters: 1 point, 6-10 encounters: 2 points, 11+ encounters: 3 points
    },
    age: {
      type: Number,
      default: 0, // If user age is between 18 - 30 will get 2 point, 31 - 45 will get 4 points and above that will get 6 points
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

  if (this.categoryType !== 'white water rafting') {
    this.whiteWaterRaftingInfo = undefined;
  }

  if (this.categoryType !== 'trekking') {
    this.trekkingInfo = undefined;
  }

  if (this.categoryType !== 'rock climbing') {
    this.rockClimbingInfo = undefined;
  }

  if (this.categoryType !== 'wildlife safari') {
    this.wildlifeSafariInfo = undefined;
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
