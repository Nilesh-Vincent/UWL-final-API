const dotenv = require('dotenv');
dotenv.config({ path: '../../config.env' });

const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require(`./../../models/tourModel`);
const User = require(`./../../models/userModel`);
const Review = require(`./../../models/reviewModel`);

const DATABASE = process.env.DB_STRING.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD
);

mongoose
  .connect(DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database Is Successfully Connected');
  })
  .catch(() => {
    console.log('Database is not Connected ');
  });

//Reading the JSON File
const tours = JSON.parse(fs.readFileSync('./tours.json', 'utf-8'));
const reviews = JSON.parse(fs.readFileSync('./reviews.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));

// Seed DB cluster
const seedData = async (req, res) => {
  try {
    await Tour.create(tours);
    await Review.create(reviews, { validateBeforeSave: false });
    await User.create(users, { validateBeforeSave: false });
    console.log('Data Is Successfully Seeded');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

//Reset The Database Cluster
const resetDatabase = async (req, res) => {
  try {
    await Tour.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();

    console.log('Successfully DB Cluster reseted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--seed') {
  console.log('Seeding');
  seedData();
} else if (process.argv[2] === '--reset') {
  console.log('Reseting ');
  resetDatabase();
}
