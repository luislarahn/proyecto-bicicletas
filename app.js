const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const jwt = require('jsonwebtoken');

const Bicicleta = require('./models/bicicleta');
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

function validarUsuario(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Debe autenticarse. Token requerido'
    });
  }

  jwt.verify(token, req.app.get('secretKey'), (error, decoded) => {
    if (error) {
      return res.status(401).json({
        status: 'error',
        message: 'Token inválido o expirado'
      });
    }

    req.apiUser = decoded;
    next();
  });
}

mongoose.connect('mongodb://127.0.0.1:27017/red_bicicletas');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión con MongoDB:'));
db.once('open', function () {
  console.log('Conectado a MongoDB: red_bicicletas');
});

const app = express();
app.set('secretKey', 'Bicicletas_API_2026_*_JWT_Seguro_!_CHICO');

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

// API protegida con JWT
app.get('/api/bicicletas', validarUsuario, async (req, res, next) => {
  try {
    const bicicletas = await Bicicleta.find();
    return res.json({
      status: 'success',
      data: bicicletas
    });
  } catch (error) {
    next(error);
  }
});

// ruta protegida web al final
app.use('/', loggedIn, indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (req.originalUrl.startsWith('/api/')) {
    return res.status(err.status || 500).json({
      status: 'error',
      message: err.message
    });
  }

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;