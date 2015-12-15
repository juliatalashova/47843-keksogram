/**
 * @function getMessage
 * @param {boolean|number|Array} a
 * @param {Array} [b]
 * @returns {string}
 */
function getMessage(a, b) {
  if (typeof a === 'boolean') {
    if (a === true) {
      return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
    } else {
      return 'Переданное GIF-изображение не анимировано';
    }
  }

  if (typeof a === 'number') {
    return 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + b * 4 + ' аттрибутов';
  }

  if (Array.isArray(a) && (!b)) {
    return 'Количество красных точек во всех строчках изображения: ' + arraySum(a);
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return 'Общая площадь артефактов сжатия: ' + arraySquare(a, b) + ' пикселей';
  }
}
/**
 * @function arraySum
 * @param array
 * @type number
 * @returns {number}
 */
function arraySum(array){
  var sum = 0;
  for(var i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
}
/**
 * @function arraySquare
 * @param {number} a
 * @param (number) b
 * @returns {number}
 */
function arraySquare(a, b) {
  var square = 0;
  for(var i = 0; i < a.length; i++) {
    square += a[i] * b[i];
  }
  return square;
}
