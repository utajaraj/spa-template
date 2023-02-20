const { executeValidation } = require("../../../factors/login/validate");
const { UTC, Integer, LongString, Alphabetical, Email } = require("../../../utlis/regex");


const AddOneUserValidation = async (body, verbose = false) => {
    const requiredParameters = {
        user_name: {
            dataType: Alphabetical,
            missingParameter: "Nombre es obligatorio",
            invalidParameter: "Nombre inválido"
        },
        user_last_name: {
            dataType: Alphabetical,
            missingParameter: "Apellido es obligatorio",
            invalidParameter: "Apellido inválido"
        },
        email: {
            dataType: Email,
            missingParameter: "Correo es obligatorio",
            invalidParameter: "Correo inválido"
        },
        password: {
            missingParameter: "Contraseña es obligatoria",
        },
        company_siteID: {
            dataType: LongString,
            missingParameter: "Planta es obligatorio",
            invalidParameter: "Planta inválido"
        },
        roleID: {
            dataType: Integer,
            missingParameter: "Rol es obligatorio",
            invalidParameter: "Rol inválido"
        },
        created_by: {
            missingParameter: "Fecha de creación es obligatoria",
        },
        modified_by: {
            missingParameter: "Fecha de edición es obligatoria",
        },
    };
    const optionalParameters = {
        user_middle_name: {
            dataType: Alphabetical,
            invalidParameter: "Nombre inválido"
        },
    };
    return executeValidation(
        body,
        requiredParameters,
        optionalParameters,
        false,
        false,
        verbose
    );
};
module.exports = {
    AddOneUserValidation: AddOneUserValidation,
};
