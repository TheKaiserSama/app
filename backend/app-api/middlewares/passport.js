const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UsuarioDao = require('../../app-core/dao/UsuarioDao');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

module.exports = new JwtStrategy(opts, async function(payload, done) {
    try {
        const usuario = await UsuarioDao.findOneUsuario(payload.id);
        if (usuario) {
            return done(null, usuario);
        }
        return done(null, false);
    } catch (error) {
        return done(error);
    }
});