export default class DateUtils {

  constructor() {
    this.refereceDate = new Date();
  }

  getDate() {
    return this.refereceDate;
  }

  setMonth(value, relative = false) {
    if(!relative) {
      this.refereceDate.setMonth(value);
    } else {
      this.refereceDate.setMonth(this.refereceDate.getMonth() + value);
    }
  }

  setDate(value, relative = false) {
    if(!relative) {
      this.refereceDate.setDate(value)
    } else {
      this.refereceDate.setDate(this.refereceDate.getDate() + value);
    }
  }

  setHour(value, relative = false) {
    if(!relative) {
      this.refereceDate.setHours(value);
    } else {
      this.refereceDate.setHours(this.refereceDate.getHours() + value);
    }
  }

  getEndOfDay() {
    let date = new Date(this.refereceDate);
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    date.setMilliseconds(999);
    return date;
  }

  getStartOfDay() {
    let date = new Date(this.refereceDate);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }
}
