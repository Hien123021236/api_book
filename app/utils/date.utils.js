const moment = require('moment-timezone');

const getDaysBetweenDates = function(startDate, endDate) {
  const now = startDate.clone();
  const dates = {};

  while (now.isSameOrBefore(endDate)) {
    dates[now.format('YYYYMMDD')] = now.format('YYYY-MM-DD');
    now.add(1, 'days');
  }
  return dates;
};

const getDurationFromString = (duration) => {
  duration = duration.toLowerCase();

  let res = {};
  if (duration === 'today') {
    const startDate = moment().format().format('YYYY-MM-DD');
    const endDate = moment().format().format('YYYY-MM-DD');
    const arrField = {};

    for (let i = 0; i <= 23; i++) {
      if (i <= 9) {
        arrField['0' + i] = '0' + i + ':00';
      } else {
        arrField[i] = i + ':00';
      }
    }

    res = {
      'dimension': 'ga:hour',
      'start_date': startDate,
      'end_date': endDate,
      'arr_field': arrField,
    };
  } else if (duration === 'week' || duration === '7daysago') {
    const startDate = moment().format().subtract(7, 'days');
    const endDate = moment().format().subtract(1, 'days');
    const arrField = getDaysBetweenDates(startDate, endDate);
    res = {
      'dimension': 'ga:date',
      'start_date': startDate.format('YYYY-MM-DD'),
      'end_date': endDate.format('YYYY-MM-DD'),
      'arr_field': arrField,
    };
  } else if (duration === 'month' || duration === '30daysago') {
    const startDate = moment().format().subtract(30, 'days');
    const endDate = moment().format();
    const arrField = getDaysBetweenDates(startDate, endDate);
    res = {
      'dimension': 'ga:date',
      'start_date': startDate.format('YYYY-MM-DD'),
      'end_date': endDate.format('YYYY-MM-DD'),
      'arr_field': arrField,
    };
  } else if (duration === 'year') {
    const startDate = moment().format().subtract(12, 'months');
    const endDate = moment().format();
    const now = startDate.clone();
    const arrField = {};

    while (now.isSameOrBefore(endDate)) {
      arrField[now.format('YYYYMM')] = now.format('YYYY-MM');
      now.add(1, 'months');
    }

    res = {
      'dimension': 'ga:yearMonth',
      'start_date': startDate.format('YYYY-MM-DD'),
      'end_date': endDate.format('YYYY-MM-DD'),
      'arr_field': arrField,
    };
  }
  return res;
};

module.exports = {
  getDurationFromString,
  getDaysBetweenDates,
};
