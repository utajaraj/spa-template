const { executeValidation } = require("../../../factors/login/validate");
const { UTC, Integer } = require("../../../utlis/regex");



const AddOneQuotesValidation = async (body,verbose=false) => {
  const requiredParameters = {
    reference: {
      missingMessage: "Referencia es obligatorio",
    },
     currency: {
      missingMessage: "Moneda es obligatorio",
      options:["MXN","USD"],
      invalidMessage:"Moneda solo puede ser MXN o USD"
    },
    clientID: {
      missingMessage: "Cliente es obligatorio",
      invalidMessage: "Cliente inválido",
      dataType:Integer,
    },
    buyerID: {
      missingMessage: "Comprador es obligatorio",
      invalidMessage: "Comprador inválido",
      dataType:Integer,
    },
    agentID: {
      missingMessage: "Agente es obligatorio",
      invalidMessage: "Agente inválido",
      dataType:Integer,
    },
    expirationDate:{
      missingMessage: "Fecha de vencimineto es obligatoria",
      invalidMessage: "Fecha inválida",
      dataType:UTC,
    }
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
