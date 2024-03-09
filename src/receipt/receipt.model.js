import mongoose from 'mongoose';


const FacturaSchema = mongoose.Schema({
    NoFactura: {
        type: String
    },
    FechaFactura: {
        type: Date,
        default: Date.now
    },
    idUsuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario', // Referencia al modelo Usuario
        required: [true, 'El idUsuario es obligatorio'],
    },
    nombreUsuario: {
        type: String,
        required: true
    },
    carritoUsuario: {
        type: Array,
        default: []
    },
    PrecioTotal: {
        type: Number,
        default: 0
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
});

FacturaSchema.pre('save', async function (next) {
    try {
        // Obtener el número total de facturas en la base de datos
        const totalFacturas = await this.constructor.countDocuments();

        // Generar el próximo código de factura (ejemplo: 0001, 0002, ...)
        this.codigoFactura = `${totalFacturas + 1}`.padStart(4, '0');
        next();
    } catch (error) {
        next(error);
    }
});

export default mongoose.model('Factura', FacturaSchema);