let PosUtils = {
  posInRect: function(p, rect) {
    if (p[0] <= rect.x2 && p[0] >= rect.x1 &&
      p[1] <= rect.y2 && p[1] >= rect.y1) {
      return true;
    }
    return false;
  },
  inWhichRect: function(p, positons) {
    let len = positons.length, i;
    for (i = 0; i < len; i ++) {
      if (this.posInRect(p, positons[i])) {
        return i;
      }
    }
    return -1;
  }
}

export default PosUtils;