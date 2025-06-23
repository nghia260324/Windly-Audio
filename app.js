require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const exphbs = require('express-handlebars');
const helpers = require('./utils/hbsHelpers');
const session = require('express-session');

var apiRouter = require('./routes/api');

var app = express();
app.use(express.static('public'));

const connectDB = require('./config/ConnectDB');

app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: false,
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: [
    path.join(__dirname, 'views/partials'),
  ],
  helpers: helpers
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use('/api', apiRouter);
app.get('/keep-alive', (req, res) => {
    res.status(200).send('Server is up and running!');
});
app.use((req, res) => {
    res.status(403).send('Forbidden: Access Denied');
});

connectDB();
// warmUp();
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
