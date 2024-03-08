import { Router } from "express";
import { check } from "express-validator";


import { validarCampos } from "../middlewares/validar-campos.js";
import { categoriasDelete, categoriasGet, categoriasPost, editarCategoria } from "../category/category.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js"
import { existeCategoriaById } from "../helpers/db-validators.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();


router.get('/', categoriasGet);


router.post(
    '/agregar',
    [
        validarJWT,
        tieneRole('ADMIN_ROLE'),
        check('NombreCategoria', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    categoriasPost
);

router.put(
    "/editar/:id",
    [
        validarJWT,
        tieneRole('ADMIN_ROLE'),
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeCategoriaById),
        validarCampos,
    ],
    editarCategoria
);

router.delete(
    '/eliminar/:id',
    [
        validarJWT,
        tieneRole('ADMIN_ROLE'),
    ],
    categoriasDelete
);

export default router;