import mongoose from 'mongoose';

const CategoriaSchema = mongoose.Schema({
    NombreCategoria: {
        type: String,
        required: [true , 'El nombre de la cateogira es obligatorio'],
        unique: true
    },
    Descripcion: {
        type: String,
        required: [true, "The description is required"],
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
});

export default mongoose.model('Categoria', CategoriaSchema)
