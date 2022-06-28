const express = require('express');
const cors = require('cors');
const expressSanitizer = require('express-sanitizer');
const morgan = require('morgan');
const methodOverride = require('method-override');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('express-async-errors');

// requiring routes
const viewRoute = require('./routes/views');
const blogRoute = require('./routes/blogs');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const NotFoundError = require('./errors/notFound');
const helpers = require('./helpers/helpers');

const app = express();

// GLOBAL MIDDLEWARES
// implement CORS
app.use(cors());

// Access-Control-Allow-Origin
app.options('*', cors());

// development logging
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
}

// ejs view engine
app.set('view engine', 'ejs');

// serving static files
app.use(express.static(path.join(`${__dirname}/public`)));

// limit request from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 60,
  message: 'Too many requests from this IP, Please try again in an hour!',
});

app.use('/api', limiter);

// body Parser, reading data from body into req.body
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

app.use(expressSanitizer());
app.use(methodOverride('_method'));

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// prevent parameter pollution
app.use(hpp());

// compression middleware
app.use(compression());

// pass variables to templates
app.use((req, res, next) => {
  res.locals.h = helpers;
  next();
});

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

// routes middleware
app.use('/blogs', viewRoute);
app.use('/api/v1/blogs', blogRoute);

app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server`));
});

app.use(errorHandlerMiddleware);

module.exports = app;
