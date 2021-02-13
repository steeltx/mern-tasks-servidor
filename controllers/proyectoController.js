const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {

    // revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        // crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);
        // guardar el creado via jwt
        proyecto.creador = req.usuario.id;
        // guardar el proyecto
        proyecto.save();
        res.json(proyecto);

    } catch (err) {
        console.log(err);
        res.status(500).send('Hubo un error');
    }

}

// obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });
        res.json(proyectos);
    } catch (err) {
        console.log(err);
        res.status(500).send('Hubo un error');
    }
}

// actualizar un proyecto
exports.actualizarProyecto = async (req, res) => {

    // revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    // extraer la informacion del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};
    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }
    try {
        // revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        // si el proyecto existe
        if (!proyecto) {
            return res.status(404).json({ msj: 'Proyecto no encontrado' });
        }

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msj: 'No autorizado' });
        }

        // actualizar
        proyecto = await Proyecto.findOneAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true });
        res.json({ proyecto });

    } catch (err) {
        console.log(err);
        res.status(500).send('Error en el servidor');
    }
}

// eliminar un proyecto por su ID
exports.eliminarProyecto = async (req, res) => {

    try {
        // revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);

        // si el proyecto existe
        if (!proyecto) {
            return res.status(404).json({ msj: 'Proyecto no encontrado' });
        }

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msj: 'No autorizado' });
        }

        // eliminar el proyecto
        await Proyecto.findOneAndRemove({ _id: req.params.id });
        res.json({ msj: 'Proyecto eliminado' });

    } catch (err) {
        console.log(err);
        res.status(500).send('Error en el servidor');
    }
}