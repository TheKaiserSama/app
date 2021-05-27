const passport = require('passport');
const { HttpBadRequest, HttpNotFound } = require('../error/customError');

module.exports = (req, res, next) => {
    passport.authenticate('jwt', function(err, user, info) {
        if(typeof (info) === 'object') {
            throw new HttpBadRequest(info.message);
        }
        if (err) {
            return next(err)
        };
        if (!user) {
            throw new HttpNotFound('El usuario suministrado no existe')
        };
   
        req.logIn(user, { session: false }, function(err) {
            if (err) { return next(err); }
            return next();
        });
    })(req, res, next);
}