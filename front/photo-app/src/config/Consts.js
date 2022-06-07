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

export const PhotoPrintStatusHash = {
  NEW: {
    value: `NEW`,
    dbValue: 0,
    text: '新创建'
  },
  PRINTED: {
    value: `PRINTED`,
    dbValue: 1,
    text: '已打印'
  },
  PRINT_FAIL: {
    value: `PRINT_FAIL`,
    dbValue: 3,
    text: '打印失败'
  },
}

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



// $pageSize: 3.5in 5in; // 3R
// $pageSize: 4in 6in; // 4R
// $pageSize: 5in 7in; // 5R
// $pageSize: 6in 8in; // 6R
// $pageSize: 8in 10in; // 8R
// $pageSize: 10in 12in; // 10R

export const PhotoPaperSize = {
  R3: {
    name: '3R',
    unit: 'cm',
    width: 8.9,
    height: 12.7,
    desc: "3R (8.9 * 12.7 cm)"
  },
  R4: {
    name: '4R',
    unit: 'cm',
    width: 10.2,
    height: 15.2,
    desc: "4R (10.2 * 15.2 cm)"
  },
  R5: {
    name: '5R',
    unit: 'cm',
    width: 12.7,
    height: 17.8,
    desc: "5R (12.7 * 17.8 cm)"
  },
  R6: {
    name: '6R',
    unit: 'cm',
    width: 15.2,
    height: 20.3,
    desc: "6R (15.2 * 20.3 cm)"
  },
  R8: {
    name: '8R',
    unit: 'cm',
    width: 20.3,
    height: 25.4,
    desc: "8R (15.2 * 20.3 cm)"
  },
  R10: {
    name: '10R',
    unit: 'cm',
    width: 25.4,
    height: 30.5,
    desc: "10R (25.4 * 30.5 cm)"
  }
}

export const PhotoSizePrint = {
  DEFAULIT: {
    unit: 'cm',
    width: 5.08,
    height: 7.62
  },
  THREE_INCH: {
    unit: 'cm',
    width: 5.08,
    height: 7.62
  },
  FOUR_INCH: {
    unit: 'cm',
    width: 7.6,
    height: 10.16
  },
  FIVE_INCH: {
    unit: 'cm',
    width: 8.89,
    height: 12.7
  },
  SIX_INCH: {
    unit: 'cm',
    width: 10.16,
    height: 15.24
  },
  SEVEN_INCH: {
    unit: 'cm',
    width: 12.7,
    height: 17.78
  },
}

export const getPhotoPrintSize = (photoSize) => {
  console.log("----")
  switch(photoSize.dbValue) {
    case '3inch':
      return PhotoSizePrint.THREE_INCH
    case '4inch':
      return PhotoSizePrint.FOUR_INCH;
    case '5inch':
      return PhotoSizePrint.FIVE_INCH
    case '6inch':
      return PhotoSizePrint.SEVEN_INCH;

    case '7inch':
      return PhotoSizePrint.SEVEN_INCH
    
    default:
      return PhotoSizePrint.DEFAULIT
  }
}