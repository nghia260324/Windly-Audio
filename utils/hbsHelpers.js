module.exports = {
  eq: (a, b) => a === b,
  not: (v) => !v,
  and: (a, b) => a && b,
  or: (a, b) => a || b,
  gt: (a, b) => a > b,
  ifCond: function (v1, v2, options) {
    return v1 === v2 ? options.fn(this) : options.inverse(this);
  },
  plusOne: (value) => {
    return parseInt(value) + 1;
  },
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  },
  includes: (array, value) => Array.isArray(array) && array.includes(value),
  map: function (array, key, separator) {
    if (!Array.isArray(array)) return '';
    return array.map(item => item[key]).join(separator || ', ');
  },
  contains: function (value, array) {
    if (!Array.isArray(array)) return false;
    return array.includes(value.toString());
  },
  formatDuration: function (seconds) {
    seconds = Number(seconds) || 0;

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const pad = (n) => String(n).padStart(2, '0');

    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  },
  formatDurationShort: function (seconds) {
    seconds = Number(seconds) || 0;

    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);

    const pad = (n) => String(n).padStart(2, '0');

    return `${pad(m)}:${pad(s)}`;
  },
  json: function (context) {
    return JSON.stringify(context).replace(/</g, '\\u003c');
  }
};
