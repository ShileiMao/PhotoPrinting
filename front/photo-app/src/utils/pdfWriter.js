import { jsPDF } from 'jspdf'

/**
 * @typedef OrderDetails
 * @param {String} pddOrderNumber - order number
 * @param {String} description - description
 */
/**
 * @typedef Size 
 * @param {String} unit
 * @param {Number} width
 * @param {Number} height
 */

/**
 * @typedef Photo
 * @param {Number} width - width of the photo 
 * @param {Number} height - height of the photo
 */
/**
 * create pdf based on the parameters
 * 
 * @param {OrderDetails} orderDetails - order information
 * @param {Size} pageSize - page size config
 * @param {Size} photoSize - photo size config
 * @param {Array} photos - photos to print
 * @param {Object} printerConf - printer resolution settings
 * 
 * @returns pdf document
 */
export const createPdf = async (orderDetails, pageSize, photoSize, photos, printerConf = {ppi: 300, photoGap: 0.2, margin: 1}) => {
  
  console.log("creating pdf document")

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: pageSize.unit,
    format: [pageSize.width, pageSize.height]
  });

  
  const inchToCM = (inch) => {
    return inch * 2.54
  }

  const pixelToInch = (pixel, ppi) => {
    return pixel / ppi
  }

  let numCol = Math.max(parseInt(pageSize.width / photoSize.width), parseInt((pageSize.width + printerConf.photoGap) / (photoSize.width + printerConf.photoGap)), 1)
  let numRow = Math.max(parseInt(pageSize.height / photoSize.height), parseInt( (pageSize.height + printerConf.photoGap) / (photoSize.height + printerConf.photoGap)), 1)

  let photosPerPage = numCol * numRow

  let rowWidth = (photoSize.width * numCol) + (numCol - 1) * printerConf.photoGap
  let columnHeight = (photoSize.height * numRow) + (numRow - 1) * printerConf.photoGap

  let leftEdge = rowWidth > pageSize.width ? (pageSize.width - (numCol * photoSize.width)) / 2 : (pageSize.width - rowWidth) / 2;
  let topEdge = columnHeight > pageSize.height ? (pageSize.height - (numRow * photoSize.height)) / 2 : (pageSize.height - columnHeight) / 2;

  // if the margin configured, we need to make sure the margin not too big that make the image go outside of the paper
  leftEdge = Math.max(0, leftEdge - printerConf.margin, leftEdge)
  topEdge = Math.max(0, topEdge - printerConf.margin, topEdge)
  
  let colGap = rowWidth > pageSize.width ? 0 : printerConf.photoGap;
  let rowGap = columnHeight > pageSize.height ? 0 : printerConf.photoGap;

  let offSetX = leftEdge
  let offsetY = topEdge

  let processed =  photos; 

  // 只可能是portrait了
  processed.forEach((item, index) => {
    let pixelW = item.width
    let pixelH = item.height
    let rotate = 0

    let expectedPhotoWidth = inchToCM(pixelToInch(pixelW, printerConf.ppi))
    let expectedPhotoHeight = inchToCM(pixelToInch(pixelH, printerConf.ppi))

    let marginX = 0
    let marginY = 0;

    if (item.width > item.height) {
    // 注意：旋转中心在图片左下角
    //     .-------------.
    //     |             |
    //     |             |
    //     *-------------*
    //  __/\__ 
    //    ||
    //    这里是旋转中心，旋转后的形状：
    //    .-------------.
    //    |             |
    //    |             |
    //    *-----.-------*
    //    |     |
    //    |     |
    //    |     |
    //    |     |
    //    *-----.
    //    我们需要吧假想后的这个图像中心点平移到原图的中心点上

      let actualPhotoWidth = Math.min(expectedPhotoWidth, photoSize.height)
      let actualPhotoHeight = Math.min(expectedPhotoHeight, photoSize.width)
      
      marginX = (photoSize.width - actualPhotoWidth) / 2 + actualPhotoWidth / 2 - actualPhotoHeight / 2
      marginY = - (photoSize.height - actualPhotoHeight) / 2 - actualPhotoWidth / 2 

      rotate = -90;

      console.log("roate")

      doc.addImage(item.imageData, 
        'jpeg',
        offSetX + marginX, 
        offsetY + marginY,
        actualPhotoWidth, 
        actualPhotoHeight, 
        null, 
        'NONE', 
        rotate);
      // marginX
      // x --> marginY
      // y -> pageheight - marginX - imageWidth
    } else {
      let actualPhotoWidth = Math.min(expectedPhotoWidth, photoSize.width)
      let actualPhotoHeight = Math.min(expectedPhotoHeight, photoSize.height)

      marginX = Math.max(0, (photoSize.width - actualPhotoWidth) / 2)
      marginY = Math.max(0, (photoSize.height - actualPhotoHeight) / 2)

      doc.addImage(item.imageData, 
        'jpeg',
        offSetX + marginX, 
        offsetY + marginY,
        actualPhotoWidth, 
        actualPhotoHeight, 
        null, 
        'NONE', 
        rotate);
    }
    const numPhotos = index + 1
    if(numPhotos % photosPerPage === 0 && numPhotos < photos.length) {
      doc.addPage()
      offSetX = leftEdge;
      offsetY = topEdge;
    } else {
      if(numPhotos % numCol === 0) {
        offSetX = leftEdge;
        offsetY += photoSize.height + colGap;
      } else {
        offSetX += photoSize.width + rowGap;
      }
    }
  })

  doc.autoPrint();
  doc.save(orderDetails.pddOrderNumber + " - " + orderDetails.description)
}

function debugBase64(base64URL){
  var win = window.open();
  win.document.write('<iframe src="' + base64URL  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
}
