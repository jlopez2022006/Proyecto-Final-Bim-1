import { request, response } from "express";

//Verificador si es admin
export const esAdminRole = (req = request, res = response, next) => {
    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se require verificar el role sin validar el token primero'
        });
    }
    const { rol, nombre } = req.usuario;
    if ( rol !== 'ADMIN_ROLE' ) {
        return res.status(500).json({
            msg: `${ nombre } no es Administrador - No tiene acceso a esta función`
        });
    }
    next();
}


//Operador rest u operador spread 
export const tieneRole = ( ...roles ) => {

    return (req = request, res= response, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            })
        }

        if (!roles.includes( req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${ roles }`
            })

        }

        next();

    }

}

