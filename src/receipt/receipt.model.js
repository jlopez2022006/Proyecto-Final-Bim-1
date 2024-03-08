import mongoose from 'mongoose';

const FacturaSchema = mongoose.Schema({
    idUsuario: {
        type: String,
        required: [true , 'El nombre del producto es obligatorio'],
        unique: true
    },
    PrecioTotal: {
        type: Number,
        default: 0
    },
    FechaFactura: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
});

export default mongoose.model('Factura', FacturaSchema)
