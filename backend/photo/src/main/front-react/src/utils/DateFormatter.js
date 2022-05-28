import moment from "moment";

export default class DateFormatter {
  constructor() {

  }

  toString(date, formate) {
    const dateStr = moment(date).format(formate);
    return dateStr;
  }
  
}