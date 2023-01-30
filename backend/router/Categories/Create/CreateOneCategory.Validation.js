const { executeValidation } = require("../../../factors/login/validate");
const { UTC, Integer } = require("../../../utlis/regex");


const AddOneCategoriesValidation = async (body, verbose = false) => {
  const requiredParameters = {
    category_name: {
      missingMessage: "Nombre es requerido",
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
    false,
    verbose
  );
};
module.exports = {
  AddOneCategoriesValidation: AddOneCategoriesValidation,
};
