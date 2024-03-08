import { Router } from "express";
import { check } from "express-validator";


import { validarCampos } from "../middlewares/validar-campos.js";
import { getProductoById, productosAgotadosGet, productosDelete, productosGet, productosPost, productosPut } from "../product/product.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js"
import { tieneRole } from "../middlewares/validar-roles.js";
import { existeProductoById } from "../helpers/db-validators.js";

const router = Router();


router.get('/', productosGet);

router.get('/agotados', productosAgotadosGet);


router.get(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeProductoById),
        validarCampos,
    ],
    getProductoById
);

router.post(
    '/agregar',
    [
        validarJWT,
        tieneRole('ADMIN_ROLE'),
        check('NombreProducto', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    productosPost
);

router.put(
    "/:id",
    [
        validarJWT,
        tieneRole('ADMIN_ROLE'),
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeProductoById),
        validarCampos,
    ],
    productosPut
);

router.delete('/:id',
    [
        validarJWT,
        tieneRole('ADMIN_ROLE'),
    ], 
    productosDelete
);



export default router;