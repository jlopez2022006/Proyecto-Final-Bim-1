import { response, request } from "express";
import Factura from './receipt.model.js';
import Usuario from '../users/user.model.js';


const generateCodigoFactura = () => {
    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    return 'FACT-' + randomNumber;
};

export const crearFactura = async (req, res) => {
    try {
        const usuarioId = req.body.idUsuario;
        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            return res.status(401).json({
                msg: 'Usuario no encontrado en la base de datos',
            });
        }

        const precioTotal = usuario.carrito.reduce((total, producto) => total + producto.precio, 0);

        const crearInstanciaFactura = (usuario, precioTotal, body) => {
            return new Factura({
                idUsuario: usuario._id,
                nombreUsuario: usuario.nombre,
                carritoUsuario: usuario.carrito,
                PrecioTotal: precioTotal,
                FechaFactura: body.FechaFactura || Date.now(),
                estado: body.estado ?? true,
                NoFactura: generateCodigoFactura()
            });
        };

        const factura = crearInstanciaFactura(usuario, precioTotal, req.body);

        await factura.save();

        // Eliminar los productos del carrito del usuario
        usuario.carrito = [];
        await usuario.save();

        const respuesta = {
            message: 'Factura creada exitosamente',
            factura: {
                'Factura No.': factura.codigoFactura,
                _id: factura._id,
                'Fecha de Compra': factura.FechaFactura,
                'Nombre del comprador': factura.nombreUsuario,
                Productos: factura.carritoUsuario,
                'Precio total': factura.PrecioTotal,
                estado: factura.estado,
            }
        };
        res.status(201).json(respuesta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const verFactura = async (req, res) => {
    try {
        const idUsuario = req.usuario._id;  // Obtener el ID del usuario a partir del token de autenticación
        const facturas = await Factura.find({ idUsuario }); // Buscar todas las facturas asociadas al usuario sin hacer "populate"
        if (!facturas || facturas.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron facturas asociadas a este usuario' });
        }
        const respuesta = {         // Construir la respuesta formateada con todas las facturas encontradas
            message: 'Facturas encontradas exitosamente',
            facturas: facturas.map(({ _id, FechaFactura, nombreUsuario, carritoUsuario, PrecioTotal, estado }) => ({
                'factura': {
                    _id,
                    'Fecha de Compra': FechaFactura,
                    'Nombre del comprador': nombreUsuario,
                    'Productos': carritoUsuario.map(({ productoId, nombre, descripcion, precio }) => ({
                        productoId,
                        nombre,
                        descripcion,
                        precio
                    })),
                    'Precio total': PrecioTotal,
                    estado,
                }
            }))
        };
        res.status(200).json(respuesta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};