export const transformFieldIntoValue = (field) => {
  if (field && field.type) {
    switch (field.type) {
      case 'single_line_text_field':
        return field.value;
        break;
      case 'multi_line_text_field':
        return field.value;
        break;
      case 'color':
        return field.value;
        break;
      case 'file_reference':
        return (field.media_image && field.media_image.image) || {url: false};
        break;
      case 'list.product_reference':
        return field.collection;
        break;
    }

    return {...field};
  }
};

export const transformFieldsArrayToJsObject = (fieldsArray) => {
  let newObj = {};

  if (fieldsArray && fieldsArray.length > 0) {
    fieldsArray.map((field) => {
      newObj[field.key] = transformFieldIntoValue(field);
      return true;
    });
  }
  return newObj;
};

export const transformReferenceNodeToJsObject = (node) => {
  if (node && node.fields) {
    return {
      ...transformFieldsArrayToJsObject(node.fields),
      id: node.id,
      type: node.type,
    };
  }
  return {};
};

export const transformReferencesArrayToJsObjectArray = (references) => {
  return references.map((ref) => transformReferenceNodeToJsObject(ref));
};
