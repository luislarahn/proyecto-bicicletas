const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');

const passport = require('./config/passport');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');
const loginRouter = require('./routes/login');

function loggedIn(req, res, next) {
  if (req.user) {
    return next();
  }
  return res.redirect('/login');
}

mongoose.connect('mongodb://127.0.0.1:27017/red_bicicletas');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión con MongoDB:'));
db.once('open', function () {
  console.log('Conectado a MongoDB: red_bicicletas');
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// middlewares generales
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// sesiones
const memoryStore = new session.MemoryStore();

app.use(session({
  secret: 'MiClaveSuperSegura_2026_*_Bicicletas',
  resave: false,
  saveUninitialized: false,
  store: memoryStore
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

// rutas públicas primero
app.use('/', loginRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// ruta protegida al final
app.use('/', loggedIn, indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;