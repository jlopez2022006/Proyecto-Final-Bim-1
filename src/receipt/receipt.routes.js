import { Router } from "express";
import { crearFactura, verFactura } from './receipt.controller.js';
import { validarJWT} from '../middlewares/validar-jwt.js'

const router = Router();


router.get('/factura', [
    validarJWT
], verFactura);


router.post(
    '/factura',
    crearFactura
);

export default router;