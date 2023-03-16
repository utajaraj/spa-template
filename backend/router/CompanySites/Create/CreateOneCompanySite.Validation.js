const { executeValidation } = require("../../../factors/login/validate");
const { UTC, Integer } = require("../../../utlis/regex");


const AddOneCompanySitesValidation = async (body, verbose = false) => {
  const requiredParameters = {
    companyID: {
      missingMessage: "Nombre de sucursal es requerido",
    },
    company_site_address: {
      missingMessage: "Dirección de sucursal es requerido",
    },
    company_site_name: {
      missingMessage: "Nombre de sucursal es requerido",
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
  AddOneCompanySitesValidation: AddOneCompanySitesValidation,
};
