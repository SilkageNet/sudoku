const inputArray = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  6,
  3,
  0,
  2,
  0,
  9,
  1,
  7,
  0,
  0,
  0,
  1,
  8,
  2,
  0,
  0,
  0,
  9,
  0,
  0,
  0,
  0,
  0,
  8,
  0,
  0,
  0,
  0,
  0,
  8,
  0,
  4,
  3,
  0,
  0,
  0,
  0,
  0,
  7,
  9,
  1,
  2,
  0,
  6,
  3,
  8,
  0,
  0,
  1,
  0,
  7,
  0,
  0,
  4,
  2,
  9,
  2,
  3,
  0,
  0,
  0,
  0,
  6,
  0,
  8,
  4,
  7,
  0,
  0,
  0,
  0,
  0,
  9
];

function initPointArray() {
  const pointArray = [];
  let row = 1;
  let column = 1;
  for (let i = 0; i < inputArray.length; i++) {
    pointArray.push([row, column]);
    if (column == 9) {
      column = 1;
      row++;
    } else {
      column++;
    }
  }
  return pointArray;
}

const pointArray = initPointArray();

module.exports = init = {
  inputArray,
  pointArray
};
