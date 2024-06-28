export const validateRequiredFields = <T extends string>(
  params: object,
  fields: T[]
): T[] => {
  const invalidRequiredFields = fields.filter((field) => !Object.keys(params).includes(field) && field);

  return invalidRequiredFields;
};

export const searchInvalidFields = <T extends string>(
  params: object,
  fields: T[]
): string[] => {
  const invalidFields = Object.keys(params).filter((field) => !fields.includes(field as T) && field);

  return invalidFields;
};
