function generateValidationErrorMessage(errors) {
  const { dataPath, keyword, params } = errors[0];

  if (keyword === 'required') {
    return `The '${dataPath}.${params.missingProperty}' field is missing`;
  }

  if (keyword === 'type') {
    return `The '${dataPath}' field must be of type '${params.type}'`;
  }

  if (keyword === 'format') {
    return `The '${dataPath}' field must be a valid ${params.format}`;
  }

  if (keyword === 'additionalProperties') {
    return `The '${dataPath}' object does not support the field '${params.additionalProperty}'`;
  }

  return 'The object is invalid'
};

export default generateValidationErrorMessage;

