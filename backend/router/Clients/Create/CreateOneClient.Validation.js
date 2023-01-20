const { executeValidation } = require("../../../factors/login/validate");
const { UTC, Integer } = require("../../../utlis/regex");


const AddOneClientsValidation = async (body, verbose = false) => {
  const requiredParameters = {
    name: {
      missingMessage: "Nombre es requerido",
    },
    accountOwnerID: {
      missingMessage: "Dueño de cuenta es requerido",
      invalidMessge: "Dueño de cuenta inválido",
      dataType: Integer,
    },
  };
  const optionalParameters = {
    street: {},
    postalCode: {},
    city: {},
    state: {},
    country: {},
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
  AddOneClientsValidation: AddOneClientsValidation,
};
