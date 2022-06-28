const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
require('colors');

// models
const Blog = require('../../model/Blog');

dotenv.config({ path: './config.env' });

// db local
const db = process.env.DATABASE_LOCAL;

// atlas mongo uri
const mongoURI = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const devEnv = process.env.NODE_ENV !== 'production';

// MongoDB connection
mongoose
  .connect(`${devEnv ? db : mongoURI}`)
  .then(() =>
    console.log(
      `Connected to MongoDB Successfully → ${devEnv ? db : mongoURI}`.gray.bold
    )
  )
  .catch((err) => console.log(`Couldn't connect to MongoDB → ${err}`.red.bold));

// read JSON file
const blogs = JSON.parse(fs.readFileSync(`${__dirname}/blogs.json`, 'utf-8'));

// import data into database
const loadData = async () => {
  try {
    await Blog.create(blogs);
    console.log('👍👍👍👍👍👍👍👍 Done!'.green.bold);
    process.exit();
  } catch (err) {
    console.log(err);
    console.log(
      '\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n'
        .red.bold
    );
    process.exit();
  }
};

// delete data from database
const removeData = async () => {
  try {
    await Blog.deleteMany();
    console.log(
      'Data Deleted. To load sample data, run\n\n\t npm run sample\n\n'.green
        .bold
    );
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

if (process.argv.includes('--import')) {
  loadData();
} else {
  removeData();
}
