const { executeValidation } = require("../../../factors/login/validate");
const { UTC, Integer, TrueFalse, LongDecimal } = require("../../../utlis/regex");



const UpdateOneQuotesValidation = async (body, verbose = false) => {
  const requiredParameters = {
    id: {
      missingMessage: "Cotización es requerida",
      invalidMessage: "Cotización inválida",
      dataType: Integer
    }

  };
  const optionalParameters = {
    exchange_rate: {
      dataType:LongDecimal,
      invalidMessage: "Tasa de conversión tiene que ser un número valido"
    },
    company: {
      invalidMessage: "Empresa solo puede ser Garle S. de R.L de C.V o GR Industrial Inc.",
      function: (value) => {
        return ["Garle", "GR Industrial"].includes(value)
      }
    },
    currency: {
      options: ["MXN", "USD"],
      invalidMessage: "Moneda solo puede ser MXN o USD"
    },
    clientID: {
      invalidMessage: "Cliente inválido",
      dataType: Integer,
    },
    buyerID: {
      invalidMessage: "Comprador inválido",
      dataType: Integer,
    },
    agentID: {
      invalidMessage: "Agente inválido",
      dataType: Integer,
    },
    expiration_date: {
      invalidMessage: "Fecha inválida",
      dataType: UTC,
    },
    created_by: {
      invalidMessge: "Usuario creador es inválido",
      dataType: Integer,
    },
    modified_by: {
      invalidMessge: "Usuario modificando es inválido",
      dataType: Integer,
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
  UpdateOneQuotesValidation: UpdateOneQuotesValidation,
};
