// Archivo de propiedades
// const moment = require('moment');
// moment.tz.setDefault('UTC');

require('dotenv').config();
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cors = require("cors");
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const publicRoutes = require('./app-api/routes/publicRoutes');
const privateRoutes = require('./app-api/routes/index');
const catchError = require('./app-api/helpers/catchError');
const JwtStrategy = require('./app-api/middlewares/passport');

const app = express();
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(cors({}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
passport.use(JwtStrategy);

app.use('/api', publicRoutes);
app.use('/api', privateRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Ruta no encontrada');
    err.status = 404;
    next(err);
});

// Error handlers

// Development error handler
// Will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        catchError(err, res);
    });
}

// Production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ "mensaje": "not found" });
});

console.log('________________________________________________________');
console.log("|\t\t\tSERVIDOR\t\t\t|");
console.log('|_______________________________________________________|');

module.exports = app;