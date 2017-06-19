// check if a propName corresponds to a handler convention,
// starting with "on" and folowed by a capiltal letter
export const isHandlerConvention = prop => /^on[A-Z]/.test(prop);

// create an object from an array where the keys are the array items
// and the values are created from a function that is passed which gets
// the array entry as an argument
export const objectFromArray = (arr, createValue) =>
  arr.reduce((obj, val) => ({ ...obj, [val]: createValue(val) }), {});

// map an object's values, the callback function gets the value,
// the key and the input object
export const mapObject = (fn, obj) => Object.keys(obj).reduce(
  (acc, key) => ({ ...acc, [key]: fn(obj[key], key, obj) })
, {});
