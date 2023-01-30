// ! The following comment is an example of the object that get pass around into the validation function
// sample requiredParameter fucntion parameter
//  @param requiredParameters = {
//     "username": {
//         type: /^[A-Za-záéíóúÁÉÍÓÚÄÖÜüöÀàÂâĞğÇçÔôŒœÈèÊêËëÆæÙùÛûŸÿ]+$/,
//         invalidMessage: "Username is must only contain letters",
//         missingMessage: "Username is required"
//     },
//     "password": {
//         invalidMessage: "Password is not valid",
//         missingMessage: "Password is required"
//     },
// }
// sample optionakParameter fucntion parameter
// optionalParameters = {
//     "name": {
//         type: Alphabetical,
//         invalidMessage: "Name must only contain letters",
//     },
// }

// * this function receive the body of the request, and object with data validation information
const executeValidation = (
  body,
  requiredParameters,
  optionalParameters,
  min = false,
  disallow = false,
  verbose = false
) => {
  // variables to store the result of the validation
  const missingParameters = [];
  const invalidParameters = [];
  let bodyKeys = Object.keys(body);
  let requiredParametersKeys = Object.keys(requiredParameters);
  // ask for a minumum of characters
  if (Number.isInteger(Number(min)) && bodyKeys.length < min) {
    return {
      status: false,
      data: `The request body must have at least ${min} parameters${verbose ? ` ${requiredParametersKeys.toString()}` : "."
        }`,
    };
  }

  if (disallow) {
    let disallowed = [];
    for (let index = 0; index < bodyKeys.length; index++) {
      if (
        !requiredParametersKeys
          .concat(Object.keys(optionalParameters))
          .includes(bodyKeys[index])
      ) {
        disallowed.push(bodyKeys[index]);
      }
    }
    if (disallowed.length !== 0) {
      let verboseMessage = `it may only include the following parameters: ${requiredParametersKeys
        .concat(Object.keys(optionalParameters))
        .toString()}`;
      invalidParameters.push(`The following parameters are not recognized: ${disallowed} ${verbose ? ` ${verboseMessage}` : ""}`)
    }
  }



  // get parameter names that the body must contain from required parameters object
  let requiredParametersNames = requiredParametersKeys;
  // I'm loopoing through the names of the required parameters to see if the body of the request includes such a parameter
  for (let index = 0; index < requiredParametersNames.length; index++) {
    // get the perameter in turn
    const requiredParameter = requiredParametersNames[index];

    // if the body doesn't have the parameter key I'm adding the pertinent error message
    if (!bodyKeys.includes(requiredParameter)) {
      missingParameters.push(
        requiredParameters[requiredParameter]?.missingMessage
      );
    } else {
      // if the body does have the required parameter we need to check if the data must be validated

      // if the valdiation object has a set dataType property then we need to validate
      if (requiredParameters[requiredParameter]?.dataType !== undefined) {
        // if it's o the data type options
        if (requiredParameters[requiredParameter]?.dataType == "options") {
          if (
            !requiredParameters[requiredParameter]?.options.includes(
              body[requiredParameter]
            )
          ) {
            invalidParameters.push(
              `${requiredParameters[requiredParameter]?.invalidMessage} ${verbose
                ? `The parameter "${requiredParameter}" is of type options and it accepts only one the following: ${requiredParameters[
                  requiredParameter
                ]?.options.toString()}`
                : ""
              }`
            );
          }
        }

        // the dataType property has a regex value that we need to use to test the body value against
        // and it's not of type options
        if (
          requiredParameters[requiredParameter]?.dataType !== "options" &&
          !requiredParameters[requiredParameter]?.dataType.test(
            body[requiredParameter]
          )
        ) {
          // ! if you are here the dataType validation for the body prepertyFailed
          // ! and we append the error message to the variable for later response
          invalidParameters.push(
            `${requiredParameters[requiredParameter]?.invalidMessage} ${verbose
              ? `The paramater "${requiredParameter} must abide by the following regular expression: ${requiredParameters[requiredParameter]?.dataType}"`
              : ""
            }`
          );
        }
      }

      requiredParameters[requiredParameter].function !== undefined
        ? !requiredParameters[requiredParameter]?.function(
          body[requiredParameter],
          body
        )
          ? invalidParameters.push(
            requiredParameters[requiredParameter]?.invalidMessage
          )
          : null
        : null;
    }
  }

  // Once the we validated required parameter we validate optional parameters

  // Firt we get the object keys from the sent body
  const bodyParameters = bodyKeys;

  // we iterate through every property name sent by the requester
  for (let index = 0; index < bodyParameters.length; index++) {
    const optionalParameter = bodyParameters[index]; //* we grab a value

    //* we check if the grabbed value is part of the optional parameters passed as an object
    if (Object.keys(optionalParameters).includes(optionalParameter)) {
      // if we are here the parameter is part of an optional value
      // and we need to check if it need to be data validated

      if (
        optionalParameters[optionalParameter].canBeNull === true &&
        body[optionalParameter] === null
      ) {
        continue;
      } else {
        if (optionalParameters[optionalParameter]?.dataType !== undefined) {
          if (requiredParameters[optionalParameter]?.dataType == "options") {
            if (
              !requiredParameters[optionalParameter]?.options.includes(
                body[optionalParameter]
              )
            ) {
              invalidParameters.push(
                requiredParameters[optionalParameter]?.invalidMessage
              );
            }
          }

          // ! if we are here the optional property/value requires validation
          if (
            optionalParameters[optionalParameter]?.dataType !== "options" &&
            !optionalParameters[optionalParameter]?.dataType.test(
              body[optionalParameter]
            )
          ) {
            // ! if we are here the optional property/value falied the validation
            //  we then append the error message for the later resposne body
            invalidParameters.push(
              optionalParameters[optionalParameter]?.invalidMessage
            );
          }
        }

        optionalParameters[optionalParameter].function !== undefined
          ? !optionalParameters[optionalParameter]?.function(
            body[optionalParameter],
            body
          )
            ? invalidParameters.push(
              optionalParameters[optionalParameter]?.invalidMessage
            )
            : null
          : null;
      }
    }
  }

  // we check if both missing parameter and invalid parameters are empty
  if (missingParameters.length + invalidParameters.length > 0) {
    return {
      status: false,
      data: {
        invalidParameters: invalidParameters,
        missingParameters: missingParameters,
      },
    };
  } else {
    return {
      status: true,
    };
  }
};

module.exports = {
  executeValidation: executeValidation,
};
