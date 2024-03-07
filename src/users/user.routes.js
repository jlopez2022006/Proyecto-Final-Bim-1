import { Router } from "express";
import { check } from "express-validator";
import {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPost2,
} from "./user.controller.js";

import {
    existenteEmail,
    existeUsuarioById,
    esRoleValido
} from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get('/', usuariosGet);

router.post(
    "/",
    [
        check("nombre", 'The name is required').not().isEmpty(),
        check("password", 'The password must be more than 6 characters.').isLength({ min: 6 }),
        check("correo", "This is not a valid email").isEmail(),
        check("correo").custom(existenteEmail),
        check('rol'),
        validarCampos,
    ],
    usuariosPost
);

router.post(
    "/agregarCliente",
    [
        check("nombre", 'The name is required').not().isEmpty(),
        check("password", 'The password must be more than 6 characters.').isLength({ min: 6 }),
        check("correo", "This is not a valid email").isEmail(),
        check("correo").custom(existenteEmail),
        validarCampos,
    ],
    usuariosPost2
);

router.put(
    "/:id",
    [
        check("id", "It is not a valid ID").isMongoId(),
        check("id").custom(existeUsuarioById),
        check("rol"),
        validarCampos
    ],
    usuariosPut
);


router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole('ADMIN_ROLE'),
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        validarCampos
    ],
    usuariosDelete
);



export default router;

