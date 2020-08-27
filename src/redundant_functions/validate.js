function validate(fields) {
  const returnJson = {};
  fields.map((field) => {
    return (returnJson[field.id] = field.value.length === 0);
  });
  return returnJson;
}

export default validate;
