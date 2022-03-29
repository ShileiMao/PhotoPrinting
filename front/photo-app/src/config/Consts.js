

export const OrderStatus = [
  {
    value: `NEW`,
    dbValue: 0,
    text: "待处理"
  },
  {
    value: `PRINTED`,
    dbValue: 1,
    text: "已打印"
  },
  {
    value: `POSTED`,
    dbValue: 2,
    text: "已邮递"
  },
  {
    value: `COLLECTED`,
    dbValue: 3,
    text: "已收货"
  },
  {
    value: `CONFIRMED`,
    dbValue: 4,
    text: "已确认"
  },
  {
    value: `FINISH`,
    dbValue: 5,
    text: "结束"
  },
  {
    value: `INVALID`,
    dbValue: 6,
    text: "失效"
  },
  {
    value: `REPORT_WAITING`,
    dbValue: 7,
    text: "投诉待处理"
  },
  {
    value: `REPORT_PROCESSING`,
    dbValue: 8,
    text: "投诉处理中"
  },
  {
    value: `REPORT_PROCESSED`,
    dbValue: 9,
    text: "投诉已处理"
  },
  {
    value: `REPORT_REJECTED`,
    dbValue: 10,
    text: "投诉已驳回"
  },
]


export const Packaging = [
  {
    value: `DEFAULT`,
    dbValue: `default`,
    text: "默认"
  }, 
  {
    value: `PLASTIC`,
    dbValue: `plastic`,
    text: "塑封"
  },
  {
    value: `SUEDE`,
    dbValue: `suede`,
    text: "绒面"
  },
]


export const PhotoSize = [
  {
    value: `DEFAULT`,
    dbValue: `default`,
    text: "默认"
  },
  {
    value: `THREE_INCH`,
    dbValue: `3inch`,
    text: "3寸"
  },
  {
    value: `FOUR_INCH`,
    dbValue: `4inch`,
    text: "4寸"
  },
  {
    value: `FIVE_INCH`,
    dbValue: `5inch`,
    text: "5寸"
  },
  {
    value: `SIX_INCH`,
    dbValue: `6inch`,
    text: "6寸"
  },
  {
    value: `SEVEN_INCH`,
    dbValue: `7inch`,
    text: "7寸"
  },
]


export const PhotoPrintStatus = [
  {
    value: `NEW`,
    dbValue: 0,
    text: '新创建'
  },
  {
    value: `PRINTED`,
    dbValue: 1,
    text: '已打印'
  },
  {
    value: `PRINT_FAIL`,
    dbValue: 3,
    text: '打印失败'
  },
]