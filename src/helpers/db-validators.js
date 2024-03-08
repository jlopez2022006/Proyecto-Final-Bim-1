import Usuario from '../users/user.model.js'
import Role from '../role/role.model.js'
import Categoria from '../category/category.model.js'


export const existenteEmail = async (correo = '') => {
    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail){
        throw new Error(`This email ${correo} already exists`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario){
        throw new Error(`User with ID: ${id} don't exists`);
    }
}

export const esRoleValido = async( rol = '' ) => {
    const existeRol = await Role.findOne( { rol } );
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la DB`);
    }
}

export const existeCategoriaById = async (id = '') => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria){
        throw new Error(`Category with ID: ${id} don't exists`);
    }
}
