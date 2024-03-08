import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import Producto from './product.model.js';
import Categoria from '../category/category.model.js'

export const productosGet = async (req, res) => {
    try {
        // Utilizar populate para obtener la información de la categoría
        const productos = await Producto.find({ estado: true }).populate('Categoria', 'NombreCategoria');

        res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al obtener los productos.',
            error: error.message
        });
    }
};

export const productosAgotadosGet = async (req, res) => {
    try {
        const productos = await Producto.find({ estado: true, Stock: 0 }).populate('Categoria', 'NombreCategoria');
        res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al obtener los productos.',
            error: error.message
        });
    }
};


export const getProductoById = async (req, res) => {
    const { id } = req.params;
    const producto = await Producto.findOne({ _id: id });

    res.status(200).json({
        producto
    })
};

export const productosPost = async (req, res) => {
    try {
        const { NombreProducto, Descripcion, Precio, Stock, Categoria: categoriaId, estado } = req.body;
        const productoExistente = await Producto.findOne({ NombreProducto });
        const categoria = await Categoria.findById(categoriaId);
        if (productoExistente) {
            return res.status(400).json({ msg: `El producto ${productoExistente.NombreProducto} ya existe.` });
        }
        if (!categoria) {
            return res.status(404).json({ msg: 'Categoría no encontrada.' });
        }
        const nuevoProducto = new Producto({
            NombreProducto,
            Descripcion,
            Precio,
            Stock,
            Categoria: categoria._id,
            estado: estado || true,
        });

        await nuevoProducto.save();

        // Utilizar populate para obtener la información de la categoría
        const productoConCategoria = await Producto.findById(nuevoProducto._id).populate('Categoria', 'NombreCategoria');

        res.status(201).json(productoConCategoria);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al ingresar producto.' });
    }
};

export const productosPut = async (req, res) => {
    try {
        const productoId = req.params.id;
        const { NombreProducto, Descripcion, Precio, Stock, Categoria: categoriaId, estado } = req.body;
        const categoria = await Categoria.findById(categoriaId);
        if (!categoria) {
            return res.status(404).json({ msg: 'Categoría no encontrada.' });
        }

        const datosActualizados = {
            NombreProducto,
            Descripcion,
            Precio,
            Stock,
            Categoria: categoria._id,
        };

        // Actualizar el producto por su ID
        const productoActualizado = await Producto.findByIdAndUpdate(productoId, datosActualizados, { new: true })
            .populate('Categoria', 'NombreCategoria');
        if (!productoActualizado) {
            return res.status(404).json({ msg: 'Producto no encontrado.' });
        }
        res.json({
            msg: 'Producto actualizado exitosamente.',
            producto: productoActualizado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar el producto.' });
    }
};

export const productosDelete = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        // Verificar si el producto con el ID proporcionado existe
        const productoExistente = await Producto.findById(id);
        if (!productoExistente) {
            return res.status(404).json({ msg: 'Producto no encontrado.' });
        }

        // Eliminar el producto por su ID
        const productoEliminado = await Producto.findByIdAndUpdate(id, { estado: false });

        res.json({
            msg: 'Producto eliminado exitosamente.',
            producto: productoEliminado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar el producto.' });
    }
};