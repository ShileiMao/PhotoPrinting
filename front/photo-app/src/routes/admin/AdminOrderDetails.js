import React, { Component, useContext } from 'react'
import { PrintLayout } from '../photosLayouts/PrintLayout';
import { apiGet, apiGetDownload, deleteSelectedPhotos, loadOrders, queryPhotos, toDataURL, updateOrderStatus, updatePhotoStatus } from '../../utils/apiHelper';
import myLogger from '../../utils/logger';
import ReactToPrint from "react-to-print"
import Config from '../../config/webConf';
import NormalLayout from '../photosLayouts/NormalLayout';
import { withRouter } from '../../utils/react-router';

import ic_print from '../../imgs/ic_print.svg'
import OrderOverView from '../../Components/OrderOverView';
import { Dialog } from '../../Components/Dialog';
import { findOptionForDbValue, getPhotoPrintSize, OrderStatus, OrderStatusHash, PhotoPaperSize, PhotoPrintStatus, PhotoSize, PhotoSizePrint } from '../../config/Consts';
import { Toast, ToastHeader } from 'react-bootstrap';
import ToastHelper from '../../utils/toastHelper';
import { createPdf } from '../../utils/pdfWriter';

class AdminOrderDetails extends Component {
  constructor(props) {
      super(props);
      this.state = {
          order: null,
          allPhotos: [],
          previewPhotos: [],
          photoToPrint: [],
          selectAll: false,
          orderNumber: this.props.match.params.orderNum,
          showAlert: false,
          alertTitle: "",
          alertText: "",
          customAlertContent: null,
          alertCancelCallback: null,
          alertConfirmCallback: null,
          downloadingImgs: false,
          paperSize: PhotoPaperSize.R3,
      }
      // const orderNumber = this.props.match.params.orderNum;

      this.refreshPhotoList = this.refreshPhotoList.bind(this);
      this.appendSelected = this.appendSelected.bind(this);
      this.getpageStyle = this.getpageStyle.bind(this);
      this.downloadPrintintImages = this.downloadPrintintImages.bind(this);
      this.photoPrintFinished = this.photoPrintFinished.bind(this);
      this.dismissAlert = this.dismissAlert.bind(this);
      this.approvalOrder = this.approvalOrder.bind(this);
      this.maintainOrderStatus = this.maintainOrderStatus.bind(this)
      this.getAlertContent = this.getAlertContent.bind(this);
      this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
      this.toggleSelectAll = this.toggleSelectAll.bind(this);
      this.hasSelectedPhoto = this.hasSelectedPhoto.bind(this);
      this.showPrintConfirm = this.showPrintConfirm.bind(this);
      this.downloadSelected = this.downloadSelected.bind(this)
  }
  
  async refreshPhotoList() {
    const result = await loadOrders(this.state.orderNumber);
    if(result.status.toLowerCase() === 'error') {
        console.log("error loading order: " + result.error);
        return;
    }
    // console.log("order: " + JSON.stringify(result.data));
    this.setState({
        order: result.data[0]
    })

    let response = await queryPhotos(this.state.orderNumber)
    
    if(response.status.toLowerCase() === 'error') {
      this.setState({allPhotos: []}) 
      return
    }

    let photoList = response.data.map(item => {
      let object = {...item};
      if(item.thumbnail != null && item.thumbnail != undefined) {
        object.thumbnail = Config.BASE_URL + item.thumbnail;
      }
      
      object.src = Config.BASE_URL + item.src;
      
      return object;
    })

    let previewPhotos = photoList.map(item => {
      let object = {...item}
      if(item.thumbnail != null && item.thumbnail != undefined) {
        object.src = item.thumbnail;
      } 
      return object;
    })

    this.setState({
      allPhotos: photoList,
      previewPhotos: previewPhotos
    }, () => {
      this.maintainOrderStatus()
    })
  }

  printPhotos() {

  }

  appendSelected(photo, index, selected) {
    photo.isSelected = selected;

    let allPhotos = this.state.allPhotos;
    allPhotos[index].isSelected = selected;
    this.setState({
      allPhotos: allPhotos
    })
  }

  toggleSelectAll() {
    const selectedAll = this.state.selectAll;
    let allPhotos = this.state.allPhotos;
    
    allPhotos.forEach(item => {
      item.isSelected = !selectedAll;
    })
    
    this.setState({
      selectAll: !selectedAll,
      allPhotos: allPhotos
    });
  }

  hasSelectedPhoto() {
    const allPhotos = this.state.allPhotos;
    for(let index = 0; index < allPhotos.length; index ++) {
      if(allPhotos[index].isSelected === true) {
        return true;
      }
    }
    return false;
  }

  componentDidMount() {
    this.refreshPhotoList()
  }

  getpageStyle() {
    const pageStyle = `
      @page {
        size: 80mm 50mm;
      }

      @media all {
        .pagebreak {
          display: none;
        }
      }

      @media print {
        .pagebreak {
          page-break-before: always;
        }
      }
    `;

    return pageStyle;
  }

  showPrintConfirm() {
    const printConfirmCallback = async () => {
      this.setState({
        customAlertContent: null
      }, () => {
        const photoSize = findOptionForDbValue(PhotoSize, this.state.order.photoSize);
        const photoPrintSize = getPhotoPrintSize(photoSize)

        if(this.state.paperSize.height < photoPrintSize.height || this.state.paperSize.width < photoPrintSize.width) {
          this.setState({
            showAlert: true,
            alertTitle: "错误提示",
            alertText: "纸张尺寸太小，请重新选择",
            alertCancelCallback: null,
            alertConfirmCallback: null
          })

          return;
        }

        this.downloadPrintintImages()
        this.maintainOrderStatus();
      })
      
      // this.refreshPhotoList()
    }

    const printCancelCallback = () => {
      this.setState({
        customAlertContent: null
      })
    }

    const paperSelected = (e) => {
      this.setState({paperSize: JSON.parse(e.target.value)})
    }

    const alertContent = () => {
      return (
        <>
          <label htmlFor="paper-size">打印纸尺寸</label>
          <select id='paper-size' className="form-control" onChange={paperSelected} value="R3">
            {
              Object.entries(PhotoPaperSize).map(([key, value]) => {
                return (
                  <option key={value.name} value={JSON.stringify(value)}>{value.desc}</option>
                )
              })
            }
          </select>
        </>
      )
    }

    // console.log("photo print finished: " + );
    this.setState({
      showAlert: true,
      alertTitle: "请确认打印纸型号",
      customAlertContent: alertContent,
      alertCancelCallback: printCancelCallback,
      alertConfirmCallback: printConfirmCallback
    })
  }

  async downloadPrintintImages() {
    const selectedPhotos = this.state.allPhotos.filter(photo => {
      return photo.isSelected === true;
    });
    
    this.setState({
      // photoToPrint: array
      downloadingImgs: true
    }, async () => {

      const downloadedImgs = await Promise.all(selectedPhotos.map(async (element) => {
        const imageURL = element.src;
        const imageData = await toDataURL(imageURL);
        // console.log("image data: " + imageData);
        // return {
        //   ... element,
        //   src: imageData
        // }
        return {
          ... element,
          imageData: imageData
        }
      }));

      const photoSize = findOptionForDbValue(PhotoSize, this.state.order.photoSize);
      const photoPrintSize = getPhotoPrintSize(photoSize)

  
      await createPdf({pddOrderNumber: this.state.orderNumber, description: this.state.order.description || this.state.phoneNumber}, 
        this.state.paperSize, photoPrintSize, downloadedImgs)

      this.setState({
        downloadingImgs: false,
        photoToPrint: downloadedImgs
      }, this.photoPrintFinished)
    });
  }

  async photoPrintFinished(params) {
    const printedAlertConfirm = async () => {
      await Promise.all(this.state.photoToPrint.map(async (element) => {
        const imageId = element.pictureId;
        const orderNum = element.pddOrderNumber;
  
        await updatePhotoStatus(orderNum, imageId, 1);
      }));
  
      this.maintainOrderStatus();
      this.refreshPhotoList()
    }

    this.setState({
      showAlert: true,
      alertText: "照片已打印？",
      alertCancelCallback: null,
      alertConfirmCallback: printedAlertConfirm
    })
  }

  
  async showDeleteConfirm() {
    const selected = this.state.allPhotos.filter(item => {
      return item.isSelected === true
    })

    if(selected.length === 0) {
      this.setState({
        showAlert: true,
        alertTitle: "提示",
        alertText: "未选择照片",
        alertCancelCallback: null,
        alertConfirmCallback: null
      })
      return;
    }

    const deleteConfirmed = async () => {
      const selected = this.state.allPhotos.filter(item => {
        return item.isSelected === true
      })
      const photoIds = selected.map (item => {
        return item.pictureId
      })

      const response = await deleteSelectedPhotos(this.state.orderNumber, photoIds)
      if(response.status.toLowerCase() !== 'success') {
        ToastHelper.showError("操作失败");
        this.refreshPhotoList()
        return;  
      }

      this.refreshPhotoList()
    }
    
    this.setState({
      showAlert: true,
      alertTitle: "删除照片",
      alertText: "删除照片？",
      alertCancelCallback: null,
      alertConfirmCallback: deleteConfirmed
    })
  } 

  dismissAlert(show) {
    this.setState({
      showAlert: show
    });
  }

  getAlertContent() {
    return(<>
      {
        this.state.customAlertContent !== null ?
        this.state.customAlertContent() 
        :
        this.state.alertText
      }
    </>)
  }

  async downloadSelected() {
    const selected = this.state.allPhotos.filter(item => {
      return item.isSelected === true
    })

    if(selected.length === 0) {
      this.setState({
        showAlert: true,
        alertTitle: "提示",
        alertText: "未选择照片",
        alertCancelCallback: null,
        alertConfirmCallback: null
      })
      return;
    }

    const selectedIds = selected.map (item => {
      return item.pictureId + ""
    }).join(",");

    const params = 
    {
      pddOrderNumber: this.state.orderNumber, 
      photos: selectedIds,
    }
    apiGetDownload("/files/downloadMutiple", params)
    .then(response => {
      const link = document.createElement('a');
      const url = URL.createObjectURL(response);
      link.href = url;
      link.download = this.state.orderNumber + ".zip"
      link.click();

      // const url = window.URL
      //       .createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // document.body.appendChild(link);
      // link.setAttribute('download', 'download.zip')
      // link.click();
      // document.body.removeChild(link);
    })
  }


  // 审核通过
  async approvalOrder() {
    const approved = findOptionForDbValue(OrderStatus, 0);  // 获取审核通过的状态
    await updateOrderStatus(this.state.orderNumber, approved.value)

    this.refreshPhotoList()
  }


  async maintainOrderStatus() {
    //已打印的照片
    const printedStatus = findOptionForDbValue(PhotoPrintStatus, 1);
    const unprintedPhoto = this.state.allPhotos.filter(item => {
      return item.status !== printedStatus.dbValue;
    })
    const printedPhoto = this.state.allPhotos.filter (item => {
      return item.status === printedStatus.dbValue;
    })

    if(unprintedPhoto.length === 0 && printedPhoto.length >= this.state.order.numPhotos) {
      const printedState = OrderStatusHash.PRINTED;
      const result = await updateOrderStatus(this.state.orderNumber, printedState.value);
    } else {
      console.log("not all printed")
    }
  }

  render() {
    return (
        <div className="Order-Overview-Container">
        {
          this.state.order &&
          <div>
              <OrderOverView order={this.state.order} photoCount={this.state.allPhotos.length} />

              <div className='preview-container'>
                <NormalLayout images={this.state.previewPhotos} selectAll={this.state.selectAll} appendSelected={this.appendSelected} showStatus={true}/>
              </div>

              {/* <div>
                  <PrintLayout images={this.state.photoToPrint} 
                  selectAll={this.state.selectAll} 
                  appendSelected={this.appendSelected} 
                  ref={el => (this.componentRef = el)}/>
              </div> */}
              {
                this.state.showAlert &&
                <Dialog show={this.state.showAlert} 
                  dismiss={this.dismissAlert} 
                  generateContent={this.getAlertContent} 
                  title={this.state.alertTitle}
                  cancelClicked={this.state.alertCancelCallback} 
                  confirmClicked={this.state.alertConfirmCallback} />
              }
              <div z-index="1000" className="Bottom-Floating-Options">
                {
                  this.state.order.status >= findOptionForDbValue(OrderStatus, 0).dbValue
                  //订单状态为已审核
                  ? 
                  <div>
                    {/* <ReactToPrint
                      trigger={() => { return <a href='#'><img src={ic_print} style={{width: `45px`, height: `45px`}}></img></a>}}
                      content={() => this.componentRef}
                      onBeforeGetContent={this.downloadPrintintImages}
                      onAfterPrint={this.photoPrintFinished}
                    >
                    </ReactToPrint> */}

                    <button className='btn btn-info btn-sm' onClick={this.toggleSelectAll}>全选</button>
                    &nbsp;
                    {
                      this.hasSelectedPhoto() &&
                      <>
                      <button className='btn btn-primary btn-sm' onClick={this.showPrintConfirm} >打印</button>
                        {/* <ReactToPrint
                          trigger={() => { return <button className='btn btn-primary btn-sm' onClick={this.showDeleteConfirm}>打印</button>}}
                          content={() => this.componentRef}
                          onBeforeGetContent={this.downloadPrintintImages}
                          onAfterPrint={this.photoPrintFinished}
                        >
                        </ReactToPrint> */}
                        &nbsp;

                        <button className='btn btn-secondary btn-sm' onClick={this.downloadSelected}>下载</button>
                        &nbsp;
                      </>
                    }
                    <button className='btn btn-secondary btn-sm' onClick={this.showDeleteConfirm}>删除</button>
                  </div>
                    
                  //订单状态为未审核
                  : 
                   <button className='btn btn-primary btn-sm' onClick={this.approvalOrder}>
                     审核通过
                   </button>
                }
              </div>
          </div>
        }

        {
          this.state.downloadingImgs &&
          <div className="text-center p-3">
            <span className="spinner-border spinner-border-sm align-center"></span>
            <span className="sr-only">下载中...</span>
          </div>
        }

      </div>
    )
  }
}

export default withRouter(AdminOrderDetails);