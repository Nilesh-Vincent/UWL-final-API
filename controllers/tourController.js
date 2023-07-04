const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');



const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files || !req.files.imageCover || !req.files.images) return next();

  // 1) Cover image
  const imageCoverFileName = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${imageCoverFileName}`);

  req.body.imageCover = imageCoverFileName;

  //Other Images

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );
  next();
});

exports.createTour = catchAsync(async (req, res, next) => {
  req.body.host = req.user.id;

  const tour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: tour,
    },
  });
});

exports.isHostPostedTour = catchAsync(async (req, res, next) => {
  if (req.user.role === 'admin') {
    return next();
  }

  try {
    const tour = await Tour.findById(req.params.id);

    if (req.user.id != tour.host._id) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
  } catch (err) {
    return next(new AppError('Error finding tour', 500));
  }

  next();
});

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  // const tours = await Tour.find({
  //   startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  // });

  const query = Tour.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  // Create a new instance of APIFeatures
  const features = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});



exports.getAllToursForHost = catchAsync(async (req, res, next) => {
  const hostId = req.params.hostId;

  const hostInfo = await User.findById(hostId);
  const tours = await Tour.find({ host: hostId });

  res.status(200).json({
    status: 'success',
    results:tours.length,
    data: {
      hostInfo,
      tours,
    },
  });
});


exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);