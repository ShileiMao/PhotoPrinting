import React, { Component, useContext } from 'react'
import { PrintLayout } from '../photosLayouts/PrintLayout';
import { queryPhotos } from '../../utils/apiHelper';
import myLogger from '../../utils/logger';
import ReactToPrint from "react-to-print"


export default class AdminOrderDetails extends Component {
  constructor(props) {
      super(props);
      this.state = {
          order: {...props.order},
          allPhotos: []
      }

      this.refreshPhotoList = this.refreshPhotoList.bind(this)
  }

  
  async refreshPhotoList() {
    let response = await queryPhotos(this.props.order.pddOrderNumber)
    
    myLogger.debug("order response: " + JSON.stringify(response))
    if(response.status.toLowerCase() === 'error') {
      this.setState({allPhotos: []}) 
      return
    }
    this.setState({
      allPhotos: response.data
    })
  }

  printPhotos() {

  }

  componentDidMount() {
    this.refreshPhotoList()
  }

  render() {
    return (
        <div className="Order-Overview-Container">
        
        <div>
            <div className="order-overview">
                <div>
                    <span>{this.props.order.title}</span>
                </div>
                <div>
                    <span>{this.props.order.numPhotos}</span>
                </div>
                <div>
                    <span>{this.props.order.description}</span>
                </div>
            </div>

            <div>
                <PrintLayout images={this.state.allPhotos} 
                selectAll={false} 
                appendSelected={this.appendSelected} 
                ref={el => (this.componentRef = el)}/>
            </div>
            
            
            <div z-index="1000" className="Bottom-Floating-Options">
              <ReactToPrint
                trigger={() => { return <button>打印</button>}}
                content={() => this.componentRef}
              >
              </ReactToPrint>
            </div>
        </div>

      </div>
    )
  }
}
