const data = require('./source');
const inputArray = data.inputArray;
const pointArray = data.pointArray;

/**
 * 打印源数组
 *
 * @param {*} inputArray
 */
function printArray(inputArray) {
  let index = 0;
  let str = '';
  let count = 0;
  for (let i = 0; i < inputArray.length; i++) {
    const value = inputArray[i];
    if (!value) {
      count++;
    }
    str += `${value || '-'} `;
    if (index == 8) {
      index = 0;
      str += '\n';
    } else {
      index++;
    }
  }
  console.log(`待计算数量：${count}`);
  console.log(str);
}

/**
 * 打印并计算map剩余计算量
 *
 * @param {*} pointMap
 * @returns
 */
function printMap(pointMap) {
  let count = 0;
  let index = 0;
  let str = '';
  pointArray.forEach(point => {
    const value = getPointValue(pointMap, point);
    const flag = Array.isArray(value);
    if (flag) {
      count++;
    }
    str += (flag ? '-' : value) + ' ';
    if (index == 8) {
      index = 0;
      str += '\n';
    } else {
      index++;
    }
  });
  if (count != 0) return false;
  console.error(`待计算数量：${count}`);
  console.error(str);
  return true;
}

/**
 * 解析源数组为map结构
 *
 * @param {*} inputArray
 * @returns
 */
function parseArray(inputArray) {
  const pointMap = new Map();
  let row = 1;
  let column = 1;
  inputArray.forEach(value => {
    pointMap.set(`${row}:${column}`, value || [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    if (column == 9) {
      column = 1;
      row++;
    } else {
      column++;
    }
  });
  return pointMap;
}

/**
 * 计算点可能的值
 *
 * @param {*} point
 * @param {*} pointMap
 * @param {*} array
 * @returns
 */
function getPossibleValues(point, pointMap, array) {
  const row = point[0];
  const column = point[1];
  // 排除行列可能存在的值
  for (let i = 1; i <= 9; i++) {
    const rowValue = pointMap.get(`${row}:${i}`);
    if (!Array.isArray(rowValue)) {
      const tempIndex = array.indexOf(rowValue);
      if (tempIndex != -1) {
        array.splice(tempIndex, 1);
        if (array.length == 0) return array;
      }
    }
    const columnValue = pointMap.get(`${i}:${column}`);
    if (!Array.isArray(columnValue)) {
      const tempIndex = array.indexOf(columnValue);
      if (tempIndex != -1) {
        array.splice(tempIndex, 1);
        if (array.length == 0) return array;
      }
    }
  }
  // 排除方块可能的值
  const rowStartIndex = Math.ceil(row / 3) * 3 - 2;
  const columnStartIndex = Math.ceil(column / 3) * 3 - 2;
  for (let rowIndex = rowStartIndex; rowIndex < rowStartIndex + 3; rowIndex++) {
    for (let columnIndex = columnStartIndex; columnIndex < columnStartIndex + 3; columnIndex++) {
      const value = pointMap.get(`${rowIndex}:${columnIndex}`);
      if (!Array.isArray(value)) {
        const tempIndex = array.indexOf(value);
        if (tempIndex != -1) {
          array.splice(tempIndex, 1);
          if (array.length == 0) return array;
        }
      }
    }
  }
  return array;
}

/**
 * 查询并过滤
 *
 * @param {*} pointMap
 */
function filter(pointMap) {
  try {
    let goFlag = true;
    while (goFlag) {
      goFlag = false;
      pointArray.forEach(point => {
        const value = getPointValue(pointMap, point);
        if (!Array.isArray(value)) return;
        // 查询可能存在的值
        const values = getPossibleValues(point, pointMap, value.concat());
        // 若为长度0，说明已经出错了
        if (values.length == 0) {
          console.warn(`E:[${point[0]},${point[1]}]`);
          throw new Error('out');
        }
        // 若为长度1，说明肯定就只是唯一的值，那么就有必要再次过滤，因为map值变动，肯定就有需要再次计算其他的可能值
        if (values.length == 1) {
          goFlag = true;
          setPointValue(pointMap, point, values[0]);
          return;
        }
        setPointValue(pointMap, point, values);
      });
    }
  } catch (err) {}
}

/**
 * 获取点的值
 *
 * @param {*} pointMap
 * @param {*} point
 * @returns
 */
function getPointValue(pointMap, point) {
  const key = `${point[0]}:${point[1]}`;
  return pointMap.get(key);
}

/**
 * 设置点的值
 *
 * @param {*} pointMap
 * @param {*} point
 * @param {*} value
 */
function setPointValue(pointMap, point, value) {
  const key = `${point[0]}:${point[1]}`;
  pointMap.set(key, value);
}

/**
 * 深拷贝,避免数据污染
 *
 * @param {*} map
 * @returns
 */
function deepCopy(map) {
  const newMap = new Map();
  map.forEach((value, key) => newMap.set(key, value));
  return newMap;
}

/**
 * 尝试Case
 *
 * @param {*} pointMap
 */
function tryCase(pointMap) {
  // 开始前先过滤一次,提高效率
  filter(pointMap);
  let stopFlag = false;
  pointArray.forEach(point => {
    if (stopFlag) return;
    const value = getPointValue(pointMap, point);
    if (!Array.isArray(value)) return;
    value.forEach(v => {
      if (stopFlag) return;
      console.log(`T:[${point[0]},${point[1]}]:${v}`);
      const tempMap = deepCopy(pointMap);
      setPointValue(tempMap, point, v);
      filter(tempMap);
      stopFlag = printMap(tempMap);
      if (stopFlag) {
        console.log(`S:[${point[0]},${point[1]}]:${v}`);
      }
    });
  });
}

/**
 * 开始
 *
 */
function start() {
  const startTime = new Date();
  // 打印数独
  printArray(inputArray);
  // 转化为map
  const pointMap = parseArray(inputArray);
  // 尝试case
  tryCase(pointMap);
  const endTime = new Date();
  console.log(`耗时：${endTime.getTime() - startTime.getTime()}ms`);
}

start();
