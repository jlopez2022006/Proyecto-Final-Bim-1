import { response, request } from "express";
import Factura from './receipt.model.js';
import Usuario from '../users/user.model.js';


const generateCodigoFactura = () => {
    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    return 'FACT-' + randomNumber;
};

export const crearFactura = async (req, res) => {
    try {
        const { idUsuario, Direccion, MetodoPago } = req.body;
        const usuario = await Usuario.findById(idUsuario);
        if (!usuario) {
            return res.status(401).json({
                msg: 'Usuario no encontrado en la base de datos',
            });
        }

        const precioTotal = usuario.carrito.reduce((total, producto) => total + producto.precio, 0);

        const crearInstanciaFactura = (usuario, Direccion, precioTotal, MetodoPago, body) => {
            return new Factura({
                idUsuario: usuario._id,
                Direccion: Direccion,
                nombreUsuario: usuario.nombre,
                carritoUsuario: usuario.carrito,
                PrecioTotal: precioTotal,
                MetodoPago: MetodoPago,
                FechaFactura: body.FechaFactura || Date.now(),
                estado: body.estado ?? true,
                NoFactura: generateCodigoFactura()
            });
        };

        const factura = crearInstanciaFactura(usuario, Direccion, precioTotal, MetodoPago, req.body);

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
                'Direccion del comprador': factura.Direccion,
                'Nombre del comprador': factura.nombreUsuario,
                Productos: factura.carritoUsuario,
                'Precio total': factura.PrecioTotal,
                'Metodo de Pago': factura.MetodoPago,
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
            facturas: facturas.map(({ _id, FechaFactura, Direccion, nombreUsuario, carritoUsuario, PrecioTotal, MetodoPago, estado }) => ({
                'factura': {
                    _id,
                    'Fecha de Compra': FechaFactura,
                    'Direccion del comprador': Direccion,
                    'Nombre del comprador': nombreUsuario,
                    'Productos': carritoUsuario.map(({ productoId, nombre, descripcion, precio }) => ({
                        productoId,
                        nombre,
                        descripcion,
                        precio
                    })),
                    'Precio total': PrecioTotal,
                    'Metodo de pago': MetodoPago,
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


export const getFacturasByUserId = async (req = request, res = response) => {
    try {
        const { idUsuario } = req.params;

        // Verificar si se proporciona un ID de usuario válido
        if (!idUsuario) {
            return res.status(400).json({ msg: 'Por favor, proporciona un ID de usuario válido.' });
        }

        // Buscar las facturas asociadas al ID de usuario proporcionado
        const facturas = await Factura.find({ idUsuario }).sort({ FechaFactura: -1 });

        res.status(200).json(facturas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener las facturas del usuario.' });
    }
};

export const actualizarFactura = async (req, res) => {
    try {
        const { id } = req.params;
        const { Direccion, MetodoPago } = req.body;

        // Verificar si se proporciona un ID de factura válido
        if (!id) {
            return res.status(400).json({ msg: 'Por favor, proporciona un ID de factura válido.' });
        }

        // Buscar la factura por su ID
        let factura = await Factura.findById(id);
        if (!factura) {
            return res.status(404).json({ msg: 'Factura no encontrada.' });
        }

        // Actualizar los campos Direccion y MetodoPago si se proporcionan en el cuerpo de la solicitud
        if (Direccion) {
            factura.Direccion = Direccion;
        }
        if (MetodoPago) {
            factura.MetodoPago = MetodoPago;
        }

        // Guardar los cambios en la factura
        await factura.save();

        res.status(200).json({ msg: 'Factura actualizada exitosamente.', factura });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};