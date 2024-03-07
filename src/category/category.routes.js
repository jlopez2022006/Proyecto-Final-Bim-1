import { Router } from "express";
import { check } from "express-validator";


import { validarCampos } from "../middlewares/validar-campos.js";
import { categoriasGet, categoriasPost } from "../category/category.controller.js";


const router = Router();


router.get('/', categoriasGet);


router.post(
    '/agregar',
    [
        check('NombreCategoria', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    categoriasPost
);


export default router;