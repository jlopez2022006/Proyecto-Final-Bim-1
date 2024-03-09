import mongoose from 'mongoose';


const FacturaSchema = mongoose.Schema({
    NoFactura: {
        type: String
    },
    FechaFactura: {
        type: Date,
        default: Date.now
    },
    Direccion: {
        type: String,
        required: true
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
    MetodoPago: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
});

FacturaSchema.pre('save', async function (next) {
    try {
        const totalFacturas = await this.constructor.countDocuments();
        this.codigoFactura = `${totalFacturas + 1}`.padStart(4, '0');
        next();
    } catch (error) {
        next(error);
    }
});

export default mongoose.model('Factura', FacturaSchema);