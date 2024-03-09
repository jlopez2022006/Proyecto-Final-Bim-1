import { Router } from "express";
import { actualizarFactura, crearFactura, getFacturasByUserId, verFactura } from './receipt.controller.js';
import { validarJWT } from '../middlewares/validar-jwt.js'
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();


router.get('/factura', [
    validarJWT
], verFactura);

router.get('/facturas/:idUsuario', [
], getFacturasByUserId);


router.post(
    '/factura',
    crearFactura
);

router.put('/factura/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
], actualizarFactura);

export default router;