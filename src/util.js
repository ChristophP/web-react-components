// GENERAL PURPOSE

// compose two functions left to right
export const pipe = (f, g) => x => g(f(x));

// create an object from an array where the keys are the array items
// and the values are created from a function that is passed which gets
// the array entry as an argument
export const objectFromArray = (createValue, arr) =>
  arr.reduce((obj, val) => ({ ...obj, [val]: createValue(val) }), {});

// map an object's values, the callback function gets the value,
// the key and the input object
export const mapObject = (fn, obj) => Object.keys(obj).reduce(
  (acc, key) => ({ ...acc, [key]: fn(obj[key], key, obj) })
, {});

// map an object's keys, the callback function gets the current key
export const mapObjectKeys = (fn, obj) => Object.keys(obj).reduce(
  (acc, key) => ({ ...acc, [fn(key)]: obj[key] })
, {});


// ATTRIBUTE CONVENTIONS
const boolRegex = /^!!/;
const handlerRegex = /\(\)$/;

// check if a propName corresponds to a boolean convention,
// starting with "!!"
export const isBoolConvention = prop => boolRegex.test(prop);

// check if a propName corresponds to a handler convention,
// ending in "()"
export const isHandlerConvention = prop => handlerRegex.test(prop);

// check if a propName corresponds to a handler convention,
// ending in "()"
export const sanitizeAttributeName =
  prop => prop.replace(boolRegex, '').replace(handlerRegex, '');


// IMPURE

// properly `set the value` for boolean attributes
export const setBooleanAttribute = (node, name, value) => {
  if (value) {
    node.setAttribute(name, '');
  } else {
    node.removeAttribute(name);
  }
};

