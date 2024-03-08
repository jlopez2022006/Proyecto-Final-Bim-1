import mongoose from 'mongoose';

const ProductoSchema = mongoose.Schema({
    NombreProducto: {
        type: String,
        required: [true , 'El nombre de la cateogira es obligatorio'],
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
    stock: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
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
