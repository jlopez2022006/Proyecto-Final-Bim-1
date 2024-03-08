import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import Producto from './product.model.js';

export const productosGet = async (req, res) => {
    try {
        const productos = await Producto.find({estado: true});
        res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al obtener los productos.',
            error: error.message
        });
    }
};

export const productosPost = async (req, res) => {
    try {
        const { NombreProducto, Descripcion, Precio, Stock, Categoria, estado } = req.body;
        const productoExistente = await Producto.findOne({ NombreProducto });
        if (productoExistente) {
            return res.status(400).json({ msg: `El producto ${productoExistente.NombreProducto} ya existe.` });
        }
        const nuevoProducto = new Producto({
            NombreProducto,
            Descripcion,
            Precio,
            Stock,
            Categoria,
            estado: estado || true,
        });
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al ingresar producto.' });
    }
};
