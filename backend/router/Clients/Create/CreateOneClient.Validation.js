const { executeValidation } = require("../../../factors/login/validate");
const { UTC, Integer } = require("../../../utlis/regex");


const AddOneClientsValidation = async (body, verbose = false) => {
  const requiredParameters = {
    client_name: {
      missingMessage: "Nombre es requerido",
    },
    accountOwnerID: {
      missingMessage: "Dueño de cuenta es requerido",
      invalidMessge: "Dueño de cuenta inválido",
      dataType: Integer,
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
