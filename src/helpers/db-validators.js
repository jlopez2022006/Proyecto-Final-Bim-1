import Usuario from '../users/user.model.js'
import Role from '../role/role.model.js'


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