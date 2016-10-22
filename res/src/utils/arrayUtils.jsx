import React from 'react';

let ArrayUtils = {
  randomArray: function (length) {
    var i,
      index,
      temp,
      arr = [];
    length = typeof(length) === 'undefined' ? 9 : length;
    for (i = 0; i < length; i++) {
      arr.push(i);
    }
    // 打乱数组
    for (i = 0; i < length; i++) {
      // 产生从 i 到 length 之间的随机数
      index = parseInt(Math.random() * (length - i)) + i;
      if (index != i) {
        temp = arr[i];
        arr[i] = arr[index];
        arr[index] = temp;
      }
    }
    return arr;
  },
  arrayDiff(a1, a2) {
    var min = Math.min(a1.length, a2.length);
    var max = Math.min(a1.length, a2.length);
    var diff = max - min;
    for (var i = 0; i < min; i ++) {
      if (a1[i] != a2[i]) diff ++;
    }
    return diff;
  }
}

export default ArrayUtils;