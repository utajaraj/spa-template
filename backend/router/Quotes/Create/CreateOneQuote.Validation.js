const { executeValidation } = require("../../../factors/login/validate");
const { UTC, Integer } = require("../../../utlis/regex");



const AddOneQuotesValidation = async (body, verbose = false) => {
  const requiredParameters = {
    reference: {
      missingMessage: "Referencia es obligatorio",
    },
    company: {
      missingMessage: "Empresa es obligatoria",
      invalidMessage: "Empresa solo puede ser Garle S. de R.L de C.V o GR Industrial Inc.",
      function: (value) => {
        return ["Garle", "GR Industrial"].includes(value)
      }
    },
    currency: {
      missingMessage: "Moneda es obligatorio",
      options: ["MXN", "USD"],
      invalidMessage: "Moneda solo puede ser MXN o USD"
    },
    clientID: {
      missingMessage: "Cliente es obligatorio",
      invalidMessage: "Cliente inválido",
      dataType: Integer,
    },
    buyerID: {
      missingMessage: "Comprador es obligatorio",
      invalidMessage: "Comprador inválido",
      dataType: Integer,
    },
    agentID: {
      missingMessage: "Agente es obligatorio",
      invalidMessage: "Agente inválido",
      dataType: Integer,
    },
    expiration_date: {
      missingMessage: "Fecha de vencimineto es obligatoria",
      invalidMessage: "Fecha inválida",
      dataType: UTC,
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
  AddOneQuotesValidation: AddOneQuotesValidation,
};
