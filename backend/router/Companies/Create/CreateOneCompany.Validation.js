const { executeValidation } = require("../../../factors/login/validate");
const { UTC, Integer } = require("../../../utlis/regex");


const AddOneCompanyValidation = async (body, verbose = false) => {
  const requiredParameters = {
    company_name: {
      missingMessage: "Nombre es requerido",
    },
    company_address: {
      missingMessage: "Dirección es requerida",
    },
    tax_id: {
      missingMessage: "Número identificador fiscal",
    },
    created_by: {
      missingMessage: "Usuario creador es requerido",
      invalidMessge: "Usuario creador es inválido",
      dataType: Integer,
    },
    modified_by: {
      missingMessage: "Usuario modificando es requerido",
      invalidMessge: "Usuario modificando es inválido",
      dataType: Integer,
    },
  };
  const optionalParameters = {};
  return executeValidation(
    body,
    requiredParameters,
    optionalParameters,
    false,
    true,
    verbose
  );
};
module.exports = {
  AddOneCompanyValidation: AddOneCompanyValidation,
};
