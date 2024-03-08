import express from 'express';
import { check } from "express-validator";

import { agregarProductoAlCarrito, getCarrito } from './cart.controller.js';
import { validarJWT} from '../middlewares/validar-jwt.js'


const router = express.Router();

router.get('/mostrar', [
    validarJWT
] , getCarrito);


router.post('/agregar-producto-carrito/:idUsuario', agregarProductoAlCarrito);


export default router;