import mongoose from 'mongoose';

const ProductoSchema = mongoose.Schema({
    NombreProducto: {
        type: String,
        required: [true , 'El nombre del producto es obligatorio'],
        unique: true
    },
    Descripcion: {
        type: String,
        required: [true, "The description is required"],
    },
    Precio: {
        type: Number,
        default: 0
    },
    Stock: {
        type: Number,
        default: 0
    },
    Categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
});

export default mongoose.model('Producto', ProductoSchema)
