import React, { Component, useContext } from 'react'
import { PrintLayout } from '../photosLayouts/PrintLayout';
import { loadOrders, queryPhotos, toDataURL, updatePhotoStatus } from '../../utils/apiHelper';
import myLogger from '../../utils/logger';
import ReactToPrint from "react-to-print"
import Config from '../../config/webConf';
import NormalLayout from '../photosLayouts/NormalLayout';
import { withRouter } from '../../utils/react-router';

import ic_print from '../../imgs/ic_print.svg'
import OrderOverView from '../../Components/OrderOverView';
import { Dialog } from '../../Components/Dialog';

class AdminOrderDetails extends Component {
  constructor(props) {
      super(props);
      this.state = {
          order: null,
          allPhotos: [],
          photoToPrint: [],
          selectAll: false,
          orderNumber: this.props.match.params.orderNum,
          showAlert: false
      }
      // const orderNumber = this.props.match.params.orderNum;

      this.refreshPhotoList = this.refreshPhotoList.bind(this);
      this.appendSelected = this.appendSelected.bind(this);
      this.getpageStyle = this.getpageStyle.bind(this);
      this.downloadPrintintImages = this.downloadPrintintImages.bind(this);
      this.photoPrintFinished = this.photoPrintFinished.bind(this);
      this.setAlertShow = this.setAlertShow.bind(this);
      this.printedAlertCancel = this.printedAlertCancel.bind(this);
      this.printedAlertConfirm = this.printedAlertConfirm.bind(this);
  }
  
  async refreshPhotoList() {
    const result = await loadOrders(this.state.orderNumber);
    if(result.status.toLowerCase() === 'error') {
        console.log("error loading order: " + result.error);
        return;
    }
    console.log("order: " + JSON.stringify(result.data));
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
      object.src = Config.BASE_URL + item.src
      return object;
    })

    this.setState({
      allPhotos: photoList
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

  async downloadPrintintImages() {
    const selectedPhotos = this.state.allPhotos.filter(photo => {
      return photo.isSelected === true;
    });

    const array = selectedPhotos.filter(item => {
      return item.isSelected === true;
    })
    /*
    const array = await Promise.all(selectedPhotos.map(async (element) => {
      const imageURL = element.src;
      const imageData = await toDataURL(imageURL);
      console.log("image data: " + imageData);

      return imageData;
    }));
    */
    this.setState({
      photoToPrint: array
    });
    console.log("photo print finished: " );
  }

  async photoPrintFinished(params) {
    console.log("photo print finished: " + params);
    this.setState({
      showAlert: true
    })
  }

  setAlertShow(show) {
    this.setState({
      showAlert: show
    });
  }

  getPrintFinishedDialog() {
    return(<>
      照片已打印？
    </>)
  }

  printedAlertCancel() {

  }

  async printedAlertConfirm() {
    await Promise.all(this.state.photoToPrint.map(async (element) => {
      const imageId = element.pictureId;
      const orderNum = element.pddOrderNumber;

      await updatePhotoStatus(orderNum, imageId, 1);
    }));
    
    window.location.reload()
    // this.forceUpdate();
  }

  render() {
    return (
        <div className="Order-Overview-Container">
        {
          this.state.order &&
          <div>
              <OrderOverView order={this.state.order} photoCount={this.state.allPhotos.length} />

              <div className='preview-container'>
                <NormalLayout images={this.state.allPhotos} selectAll={this.state.selectAll} appendSelected={this.appendSelected}/>
              </div>

              <div>
                  <PrintLayout images={this.state.photoToPrint} 
                  selectAll={false} 
                  appendSelected={this.appendSelected} 
                  ref={el => (this.componentRef = el)}/>
              </div>
              {
                this.state.showAlert &&
                <Dialog show={this.state.showAlert} 
                  setShow={this.setAlertShow} 
                  generateContent={this.getPrintFinishedDialog} 
                  title="更新状态？" 
                  cancelClicked={this.printedAlertCancel} 
                  confirmClicked={this.printedAlertConfirm} />
              }
              <div z-index="1000" className="Bottom-Floating-Options">
                <ReactToPrint
                  trigger={() => { return <a href='#'><img src={ic_print} style={{width: `45px`, height: `45px`}}></img></a>}}
                  content={() => this.componentRef}
                  onBeforeGetContent={this.downloadPrintintImages}
                  onAfterPrint={this.photoPrintFinished}
                >
                </ReactToPrint>
              </div>
          </div>
        }

      </div>
    )
  }
}

export default withRouter(AdminOrderDetails);