import mongoose from 'mongoose';

const RoleSchema = mongoose.Schema({
    rol: {
        type: String,
        required: [true , 'El rol es obligatorio']
    },
});




export default mongoose.model('Role', RoleSchema)