import moment from 'moment';

let dateFormat = function (text) {
  return moment(text).format('Y-MM-DD HH:MM:SS');
};

module.exports = {dateFormat};
