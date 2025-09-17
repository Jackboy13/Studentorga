export const toCamel = (s) => {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
};

export const keysToCamel = (o) => {
  if (Array.isArray(o)) {
    return o.map(v => keysToCamel(v));
  } else if (o !== null && typeof o === 'object' && !(o instanceof Date)) {
    return Object.keys(o).reduce((acc, key) => {
      acc[toCamel(key)] = keysToCamel(o[key]);
      return acc;
    }, {});
  }
  return o;
};

export const toSnake = (s) => {
  return s.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

export const keysToSnake = (o) => {
  if (Array.isArray(o)) {
    return o.map(v => keysToSnake(v));
  } else if (o !== null && typeof o === 'object' && !(o instanceof Date)) {
    return Object.keys(o).reduce((acc, key) => {
      acc[toSnake(key)] = keysToSnake(o[key]);
      return acc;
    }, {});
  }
  return o;
};
