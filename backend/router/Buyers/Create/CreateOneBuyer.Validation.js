const { executeValidation } = require("../../../factors/login/validate");
const { UTC, Integer } = require("../../../utlis/regex");


const AddOnebuyersValidation = async (body, verbose = false) => {
  const requiredParameters = {
    buyer_name: {
      missingMessage: "Nombre es requerido",
    },
    clientID: {
      missingMessage: "Cliente es requerido",
      invalidMessge: "Cliente es inválido",
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
    last_name: {},
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
  AddOnebuyersValidation: AddOnebuyersValidation,
};
