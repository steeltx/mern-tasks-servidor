const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // leer el token del header
    const token = req.header('x-auth-token');

    // revisar si no hay token
    if (!token) {
        return res.status(401).json({ msj: 'No hay token, permiso no valido' });
    }

    // validar el token
    try {
        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario;
        // pasar al siguiente middleware
        next();
    } catch (err) {
        res.status(401).json({ msj: 'Token no valido' });
    }
}