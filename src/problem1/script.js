
/**
  *  Calculate sum of all numbers from 1 to n using formula
  * 
  * @param {*} n: number
  * @returns sum of all numbers from 1 to n
  */
var sum_to_n_a = function (n) {
  return n * (n + 1) / 2;
};


/**
  *  Calculate sum of all numbers from 1 to n using reduce function
  * 
  * @param {*} n: number
  * @returns sum of all numbers from 1 to n
  */
var sum_to_n_b = function (n) {
  return [...Array(n + 1).keys()].reduce((sum, num) => sum + num);
}


/**
  * Calculate sum of all numbers from 1 to n using bitwise operator
  * 
  * @param {*} n: number
  * @returns sum of all numbers from 1 to n
  */
var sum_to_n_c = function (n) {
  if (n === 0) return 0;
  return (n * (n + 1)) >> 1;
}