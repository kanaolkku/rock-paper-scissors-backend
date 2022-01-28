//helper function to find the index of a specific object from an array via the property and value
const findObjectIndexFromArray = (array, property, value) => {
  return array.map((item) => item[property]).indexOf(value);
};

module.exports = { findObjectIndexFromArray };
