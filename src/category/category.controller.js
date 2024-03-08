import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import Categoria from './category.model.js';

export const categoriasGet = async (req, res) => {
    try {
        const categorias = await Categoria.find({estado: true});
        res.status(200).json(categorias);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error al obtener las categorías.',
            error: error.message
        });
    }
};


export const categoriasPost = async (req, res) => {
    try {
        const { NombreCategoria, Descripcion, estado } = req.body;
        const categoriaExistente = await Categoria.findOne({ NombreCategoria });
        if (categoriaExistente) {
            return res.status(400).json({ msg: `La categoría ${categoriaExistente.NombreCategoria} ya existe.` });
        }
        const nuevaCategoria = new Categoria({
            NombreCategoria,
            Descripcion,
            estado: estado || true,
        });
        await nuevaCategoria.save();
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al crear la categoría.' });
    }
};

export const editarCategoria = async (req, res = response) => {
    try {
        const categoriaId = req.params.id; 
        const { NombreCategoria, Descripcion } = req.body;

        // Verificar si la categoría con el ID proporcionado existe
        const categoriaExistente = await Categoria.findById(categoriaId);
        if (!categoriaExistente) {
            return res.status(404).json({ msg: 'Categoría no encontrada.' });
        }

        // Actualizar la categoría con los nuevos datos
        categoriaExistente.NombreCategoria = NombreCategoria || categoriaExistente.NombreCategoria;
        categoriaExistente.Descripcion = Descripcion || categoriaExistente.Descripcion;

        // Guardar la categoría actualizada en la base de datos
        await categoriaExistente.save();

        // Devolver la categoría actualizada en la respuesta
        res.json({
            msg: 'Categoría actualizada exitosamente.',
            categoria: categoriaExistente
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al editar la categoría.' });
    }
};

export const categoriasDelete = async (req = request, res = response) => {
    try {
        const categoriaId = req.params.id; // Se asume que la ruta tiene un parámetro llamado 'id'

        // Verificar si la categoría con el ID proporcionado existe
        const categoriaExistente = await Categoria.findById(categoriaId);
        if (!categoriaExistente) {
            return res.status(404).json({ msg: 'Categoría no encontrada.' });
        }

        // Eliminar la categoría de la base de datos
        const categoriaEliminada = await Categoria.findByIdAndUpdate(categoriaId, { estado: false });

        res.json({
            msg: 'Categoría eliminada exitosamente.',
            categoria: categoriaEliminada
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar la categoría.' });
    }
};