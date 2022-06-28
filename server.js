const dotenv = require('dotenv');
const mongoose = require('mongoose');
require('colors');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 🔥 Shutting down'.red.bold);
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const db = process.env.DATABASE_LOCAL;

const mongoURI = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const devEnv = process.env.NODE_ENV !== 'production';

mongoose
  .connect(`${devEnv ? db : mongoURI}`)
  .then(() =>
    console.log(
      `Connected to MongoDB Successfully → ${devEnv ? db : mongoURI}`.gray.bold
    )
  );

app.set('port', process.env.PORT || 8000);

const server = app.listen(app.get('port'), () =>
  console.log(`Server running on port → ${server.address().port}`.blue.bold)
);

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 🔥 Shutting down...'.red.bold);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
