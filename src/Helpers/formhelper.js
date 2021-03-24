function getErrors(errors) {
  const returnErrors = {};

  Object.keys(errors).forEach((key) => {
    returnErrors[key] = errors[key].join();
  });
  return returnErrors;
}

export function mergeErrors(error) {
  let validation = {};
  let input = {};
  let message = '';
  if (error.response) {
    if (error.response.data) {
      if (error.response.data.message) {
        message = error.response.data.message;
      }

      if (error.response.data.errors) {
        // input = error.response.data.errors;
        input = getErrors(error.response.data.errors);
        message = '';
      }
    }

    if (error.response.data && error.response.data.data) {
      validation = error.response.data.data.errors;
    }
  }

  return {
    ...input,
    form: message,
    ...validation,
  };
}

export function getFirstValidationError(error, field) {
  if (error.response.data.errors && error.response.data.errors[field]) {
    return error.response.data.errors[field][0];
  }
  return '';
}
