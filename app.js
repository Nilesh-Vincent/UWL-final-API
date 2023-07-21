const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const adminTourRouter = require('./routes/admin/adminTourRoutes');
const adminReviewRouter = require('./routes/admin/adminReviewRoutes');
const adminBookingRouter = require('./routes/admin/adminBookingRoutes');
const adminUserRouter = require('./routes/admin/adminUserRoutes');

const hostTourRoutes = require('./routes/host/hostTourRoutes');
const hostBookingRoutes = require('./routes/host/hostBookingRoutes');

const userRouter = require('./routes/user/userRoutes');
const userTourRoutes = require('./routes/user/userTourRoutes');
const userReviewRoutes = require('./routes/user/userReviewRoutes');
const userBookingRoutes = require('./routes/user/userBookingRoutes');

const app = express();
app.use(express.json());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//app.use(cors());
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://uwl-final-frontend.vercel.app'],
    credentials: true,
  })
);
app.options('*', cors());

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
// uncomment this after finishing the application in here u can add duplication fields in query strings in search
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// //our own middleware
app.use((req, res, next) => {
  //.id = Math.random().toString();
  console.log(req.cookies);
  next();
});

app.use('/api/v1/admin/tours', adminTourRouter);
app.use('/api/v1/admin/reviews', adminReviewRouter);
app.use('/api/v1/admin/bookings', adminBookingRouter);
app.use('/api/v1/admin/users', adminUserRouter);

app.use('/api/v1/host/tours', hostTourRoutes);
app.use('/api/v1/host/bookings', hostBookingRoutes);

app.use('/api/v1/tours', userTourRoutes);
app.use('/api/v1/reviews', userReviewRoutes);
app.use('/api/v1/bookings', userBookingRoutes);
app.use('/api/v1/user', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
