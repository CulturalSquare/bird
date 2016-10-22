let DateUtils = {
  formatSec: function(sec) {
    let second = parseInt(sec) % 60;
    let minute = parseInt(sec - second) / 60;
    if (second < 0) second = 0;
    if (second < 10) second = '0' + second;
    if (minute < 10) minute = '0' + minute;
    return minute + ':' + second;
  },
}

export default DateUtils;