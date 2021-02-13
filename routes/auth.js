// rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');

// autentica un usuario
// api/auth
router.post('/',
    [
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe ser minimo 6 caracteres').isLength({ min: 6 })
    ],
    authController.autenticarUsuario
);

module.exports = router;