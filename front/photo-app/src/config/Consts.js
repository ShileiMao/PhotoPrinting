export const OrderStatus = [
  {
    value: `UNPROVED`,
    dbValue: -1,
    text: "未审核"
  },
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

export const OrderStatusHash = {
  UNPROVED: {
    value: `UNPROVED`,
    dbValue: -1,
    text: "未审核"
  },
  NEW: {
    value: `NEW`,
    dbValue: 0,
    text: "待处理"
  },
  PRINTED: {
    value: `PRINTED`,
    dbValue: 1,
    text: "已打印"
  },
  POSTED: {
    value: `POSTED`,
    dbValue: 2,
    text: "已邮递"
  },
  COLLECTED: {
    value: `COLLECTED`,
    dbValue: 3,
    text: "已收货"
  },
  CONFIRMED: {
    value: `CONFIRMED`,
    dbValue: 4,
    text: "已确认"
  },
  FINISH: {
    value: `FINISH`,
    dbValue: 5,
    text: "结束"
  },
  INVALID: {
    value: `INVALID`,
    dbValue: 6,
    text: "失效"
  },
  REPORT_WAITING: {
    value: `REPORT_WAITING`,
    dbValue: 7,
    text: "投诉待处理"
  },
  REPORT_PROCESSING: {
    value: `REPORT_PROCESSING`,
    dbValue: 8,
    text: "投诉处理中"
  },
  REPORT_PROCESSED: {
    value: `REPORT_PROCESSED`,
    dbValue: 9,
    text: "投诉已处理"
  },
  REPORT_REJECTED: {
    value: `REPORT_REJECTED`,
    dbValue: 10,
    text: "投诉已驳回"
  },
}

/**
 * 
 * @param {Object} option 定义的enum列表
 * @param {Int} dbValue 数据库的值
 * @returns 
 */
export const findOptionForDbValue = (option, dbValue) => {
  const item = option.find(element => {
    return element.dbValue === dbValue
  });
  return item;
}
/**
 * 由于Java的enum类型自动转换，需要将数据库存储类型转换成定义的Enum名称，所以此处需要转换一下
 * @param {Integer} dbValue 数据库中存储的值
 * 
 * @returns 后台定义的枚举类型名称
 */
export const parsOrderStatusDbValue = (dbValue) => {
  switch(dbValue) {
    case -1:
      return `UNPROVED`;
      
    case 0:
      return `NEW`;

      case 1:
        return `PRINTED`;

      case 2:
        return `POSTED`;

      case 3:
        return `COLLECTED`;

      case 4:
        return `CONFIRMED`;

      case 5:
        return `FINISH`;

      case 6:
        return `REPORT_WAITING`;

      case 7:
        return `REPORT_WAITING`;

      case 8:
        return `REPORT_PROCESSING`;

      case 9:
        return `REPORT_PROCESSED`;

      case 10:
        return `REPORT_REJECTED`;

      default:
        return `NEW`;

  }
}

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


export const parsePackagingDbValue = (dbValue) => {
  switch (dbValue) {
    case `default`:
      return `DEFAULT`;
    case `plastic`:
      return `PLASTIC`;
    case `suede`:
      return `suede`;

    default:
      return `DEFAULT`;
  }
}

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


export const parsePhotoSizeDbValue = (dbValue) => {
  switch(dbValue) {
    case `default`:
      return `DEFAULT`;
    case `3inch`:
      return `THREE_INCH`;
    case `4inch`:
      return `FOUR_INCH`;

    case `5inch`:
      return `FIVE_INCH`;

    case `6inch`:
      return `SIX_INCH`;

    case `7inch`:
      return `SEVEN_INCH`;
      
    default:
      return `DEFAULT`;
      

  }
}

export const toRedableOptionText = (options, dbValue) => {
  const option = options.filter(item => {
    if(item.dbValue === dbValue) {
      return true;
    }
    return false;
  });

  if(option.length > 0) {
    return option[0].text;
  }
  return "默认";
}


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

export const parsePhotoPrintStatusDbValue = (dbValue) => {
  switch(dbValue) {
    case 0:
      return `NEW`;
    case 1:
      return `PRINTED`;

    case 3:
      return `PRINT_FAIL`;
  }
}