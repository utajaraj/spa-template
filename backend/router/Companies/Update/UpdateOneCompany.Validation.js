const { executeValidation } = require("../../../factors/login/validate");
const { UTC, Integer, TrueFalse } = require("../../../utlis/regex");


const UpdateOneCompanyValidation = async (body, verbose = false) => {
  const optionalParameters = {
    company_name: {
      missingMessage: "Nombre es requerido",
    },
    company_address: {
      missingMessage: "Dirección es requerida",
    },
    tax_id: {
      missingMessage: "Número identificador fiscal",
    },
    modified_by: {
      missingMessage: "Usuario modificando es requerido",
      invalidMessge: "Usuario modificando es inválido",
      dataType: Integer,
    },
    active: {
      invalidMessge: "Estatus de empresa",
      dataType: TrueFalse,
    },
  };
  const requiredParameters = {
    id:{
      missingMessage: "ID es requerido",
      invalidMessge: "Empresa Inválida",
      dataType: Integer,
    },
  };
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
  UpdateOneCompanyValidation: UpdateOneCompanyValidation,
};
