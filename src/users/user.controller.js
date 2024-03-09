import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import Usuario from './user.model.js';

export const usuariosGet = async (req = request, res = response) => {
    const query = { estado: true };
    const listaUsuarios = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query).select('-carrito') // Excluir el campo 'carrito'
    ]);
    res.json({
        listaUsuarios
    });
}

export const usuariosPost = async (req, res) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();

    res.json({
        msg: 'Registered user!',
        usuario
    });

}

export const usuariosPost2 = async (req, res) => {
    const { nombre, correo, password } = req.body;
    const rol = 'CLIENT_ROLE';
    const usuario = new Usuario({ nombre, correo, password, rol });
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();

    res.json({
        msg: 'Usuario registrado exitosamente!',
        usuario
    });
};

export const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, estado, password, oldPassword, correo, ...resto } = req.body;

    try {
        await Usuario.findByIdAndUpdate(id, resto);
        const usuarioActualizado = await Usuario.findOne({ _id: id });
        res.status(200).json({
            msg: 'Usuario actualizado',
            usuario: usuarioActualizado,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al actualizar el usuario',
        });
    }
};

export const usuariosPut2 = async (req, res = response) => {
    const { id } = req.params;
    const { _id, estado, password, oldPassword, correo, ...resto } = req.body;

    try {
        if (oldPassword && password) {
            const usuario = await Usuario.findById(id);

            if (!bcryptjs.compareSync(oldPassword, usuario.password)) {
                return res.status(400).json({
                    msg: 'La contraseña anterior no es válida',
                });
            }
            const salt = bcryptjs.genSaltSync();
            resto.password = bcryptjs.hashSync(password, salt);
        }
        await Usuario.findByIdAndUpdate(id, resto);
        const usuarioActualizado = await Usuario.findOne({ _id: id });
        res.status(200).json({
            msg: 'Usuario actualizado',
            usuario: usuarioActualizado,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al actualizar el usuario',
        });
    }
};


export const usuariosDelete = async (req = request, res = response) => {
    const { id } = req.params;
    const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        msg: 'Usuario Eliminado',
        usuarioEliminado
    });
}

export const usuariosDelete2 = async (req = request, res = response) => {
    const { id } = req.params;
    const { oldPassword } = req.body;

    try {
        if (!oldPassword) {
            return res.status(400).json({
                msg: 'Debe proporcionar el antiguo password para eliminar el perfil',
            });
        }

        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({
                msg: 'Usuario no encontrado',
            });
        }

        if (!bcryptjs.compareSync(oldPassword, usuario.password)) {
            return res.status(400).json({
                msg: 'La contraseña anterior no es válida',
            });
        }

        const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { estado: false });
        
        res.json({
            msg: 'Usuario eliminado',
            usuarioEliminado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al eliminar el usuario',
        });
    }
}

