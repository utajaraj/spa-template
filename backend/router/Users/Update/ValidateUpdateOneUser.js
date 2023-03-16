const { executeValidation } = require("../../../factors/login/validate");
const { UTC, Integer, LongString, Alphabetical, Email, AlphabeticalSpace } = require("../../../utlis/regex");


const UpdateOneUserValidation = async (body, verbose = false) => {
    const optionalParameters = {
        user_middle_name: {
            dataType: Alphabetical,
            invalidMessage: "Segundo nombre inválido"
        },
        user_name: {
            dataType: AlphabeticalSpace,
            missingMessage: "Nombre es obligatorio",
            invalidMessage: "Nombre inválido"
        },
        user_last_name: {
            dataType: AlphabeticalSpace,
            missingMessage: "Apellido es obligatorio",
            invalidMessage: "Apellido inválido"
        },
        email: {
            dataType: Email,
            missingMessage: "Correo es obligatorio",
            invalidMessage: "Correo inválido"
        },
        password: {
            missingMessage: "Contraseña es obligatoria",
        },
        company_siteID: {
            dataType: LongString,
            missingMessage: "Planta es obligatorio",
            invalidMessage: "Planta inválido"
        },
    };
    const requiredParameters = {
        id: {
            dataType: Integer,
            missingMessage: "Usario Inválido",
            invalidMessage: "Usuario es obligatorio",
        },
        created_by: {
            missingMessage: "Fecha de creación es obligatoria",
        },
        modified_by: {
            missingMessage: "Fecha de edición es obligatoria",
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
    UpdateOneUserValidation: UpdateOneUserValidation,
};
