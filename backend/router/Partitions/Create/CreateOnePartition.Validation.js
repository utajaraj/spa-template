const { executeValidation } = require("../../../factors/login/validate");
const { UTC, Integer, LongDecimal } = require("../../../utlis/regex");

const isDecimal = (string) => {
  return /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/.test(string)
}


const AddOnePartitionsValidation = async (body, verbose = false) => {
  const requiredParameters = {
    partition_name: {
      missingMessage: "Nombre de articulo es obligatorio",
    },
    description: {
      missingMessage: "Descripción de articulo es obligatorio",
    },
    unit: {
      missingMessage: "Unidad es obligatoria",
      invalidMessage: "Unidad inválida",
      function: (value) => {
        return ["pzs", "lt", "kg", "unt", "mt", "mt3"].includes(value)
      }
    },
    quoteID: {
      missingMessage: "Cotización es obligatoria",
      invalidMessage: "Cotización inválida",
    },
    edd: {
      missingMessage: "Fecha de entrega",
      invalidMessage: "Fecha de entrega inválida",
      dataType: UTC,
    },
    quantity: {
      missingMessage: "Cantidad es obligatorio",
      invalidMessage: "Cantidad inválido",
      dataType: LongDecimal,
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
    categoryID: {
      invalidMessage: "Categoría inválida",
      dataType: Integer,
    },
    part_number: {
      missingMessage: "Número de parte es obligatorio",
    },
    brandID: {
      invalidMessage: "Marca inválida",
      dataType: Integer,
    },
    cost: {
      invalidMessage: "Costo inválido",
      dataType: LongDecimal,
    },
    factor: {
      invalidMessage: "Factor es inválido",
      function: (value) => {
        return value >= 0 && value <= 100
      },
    },
    amount: {
      invalidMessage: "Monto es inválido",
      function: (value, body) => {
        const { cost, factor, quantity } = body
        if (isDecimal(cost) && isDecimal(factor) && isDecimal(quantity)) {
          const amount = parseFloat((Number(cost) * (1 + (Number(factor) / 100))).toFixed(4)) * quantity
          return amount === value
        } else {
          return false
        }
      },
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
  AddOnePartitionsValidation: AddOnePartitionsValidation,
};
