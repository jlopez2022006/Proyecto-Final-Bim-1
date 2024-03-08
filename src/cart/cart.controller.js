import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import Usuario from '../users/user.model.js'
import Producto from '../product/product.model.js'

export const getCarrito = async (req = request, res = response) => {
    try {
        // Obtener el ID del usuario a partir del token de autenticación
        const idUsuario = req.usuario.id;
 
        // Buscar al usuario en la base de datos utilizando el ID
        const usuario = await Usuario.findById(idUsuario);
 
        // Verificar si el usuario existe
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
 
        // Devolver el carrito del usuario como respuesta
        const carrito = usuario.carrito;
        return res.status(200).json({ carrito });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error del servidor" });
    }
};

export const agregarProductoAlCarrito = async (req, res) => {
    try {
        const { idUsuario } = req.params;
        const { productoId } = req.body;

        const usuario = await Usuario.findById(idUsuario);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }

        // Buscar el producto por su ID
        const productoAgregado = await Producto.findById(productoId);
        if (!productoAgregado) {
            return res.status(404).json({ msg: 'Producto no encontrado.' });
        }

        // Agregar el producto al carrito del usuario
        usuario.carrito.push({
            productoId: productoAgregado._id,
            nombre: productoAgregado.NombreProducto,
            descripcion: productoAgregado.Descripcion,
            precio: productoAgregado.Precio
        });
        await usuario.save();

        res.status(201).json({ msg: 'Producto agregado al carrito correctamente.', usuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al agregar producto al carrito.' });
    }
};