const { executeValidation } = require("../../../factors/login/validate");
const { UTC, Integer } = require("../../../utlis/regex");


const UpdateOneCompanySiteValidation = async (body, verbose = false) => {
  const optionalParameters = {
    company_site_name: {
      missingMessage: "Nombre es requerido",
    },
    address: {
      missingMessage: "Dirección es requerida",
    },
    modified_by: {
      missingMessage: "Usuario modificando es requerido",
      invalidMessge: "Usuario modificando es inválido",
      dataType: Integer,
    },
  };
  const requiredParameters = {
    id:{
      missingMessage: "ID es requerido",
      invalidMessge: "Sucursal Inválida",
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
  UpdateOneCompanySiteValidation: UpdateOneCompanySiteValidation,
};
