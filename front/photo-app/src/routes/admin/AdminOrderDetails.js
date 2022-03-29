import React, { Component, useContext } from 'react'
import { PrintLayout } from '../photosLayouts/PrintLayout';
import { loadOrders, queryPhotos } from '../../utils/apiHelper';
import myLogger from '../../utils/logger';
import ReactToPrint from "react-to-print"
import Config from '../../config/webConf';
import NormalLayout from '../photosLayouts/NormalLayout';
import { withRouter } from '../../utils/react-router';

import '../../style/Printing.scss'

import ic_print from '../../imgs/ic_print.svg'

class AdminOrderDetails extends Component {
  constructor(props) {
      super(props);
      this.state = {
          order: null,
          allPhotos: [],
          selectAll: false,
          orderNumber: this.props.match.params.orderNum
      }
      const orderNumber = this.props.match.params.orderNum;

      console.log("params: " + orderNumber);
      this.refreshPhotoList = this.refreshPhotoList.bind(this);
      this.appendSelected = this.appendSelected.bind(this);
  }

  
  async refreshPhotoList() {
    const result = await loadOrders(this.state.orderNumber);
    console.log("result: " + JSON.stringify(result))
    if(result.status.toLowerCase() === 'error') {
        console.log("error loading order: " + result.error);
        return;
    }
    this.setState({
        order: result.data[0]
    })

    let response = await queryPhotos(this.state.orderNumber)
    
    myLogger.debug("order response: " + JSON.stringify(response))
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

  render() {
    return (
        <div className="Order-Overview-Container">
        
        {
          this.state.order &&
          <div>
              <div className="order-overview">
                  <div>
                      <span>{this.state.order.title}</span>
                  </div>
                  <div>
                      <span>{this.state.order.numPhotos}</span>
                  </div>
                  <div>
                      <span>{this.state.order.description}</span>
                  </div>
              </div>

              <div className='preview-container'>
                <NormalLayout images={this.state.allPhotos} selectAll={this.state.selectAll} appendSelected={this.appendSelected}/>
              </div>

              <div className='print-container'>
                  <PrintLayout images={this.state.allPhotos} 
                  selectAll={false} 
                  appendSelected={this.appendSelected} 
                  ref={el => (this.componentRef = el)}/>
              </div>
              
              
              <div z-index="1000" className="Bottom-Floating-Options">
                <ReactToPrint
                  trigger={() => { return <a href='#'><img src={ic_print} style={{width: `45px`, height: `45px`}}></img></a>}}
                  content={() => this.componentRef}
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