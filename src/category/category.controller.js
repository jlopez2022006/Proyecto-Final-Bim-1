import { response, request } from "express";
import bcryptjs from 'bcryptjs';
import Categoria from './category.model.js';

export const categoriasGet = async (req, res) => {
    try {
        const categorias = await Categoria.find();
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