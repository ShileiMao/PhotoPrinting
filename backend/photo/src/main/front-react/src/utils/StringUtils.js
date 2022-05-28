export const StringUtils = {
  isEmpty: function(value) {
    if(value === null || value === undefined || value.length === 0) {
      return true;
    }

    return false;
  }
}