// import React, { useCallback, useEffect, useState } from 'react'
import React, { Component } from 'react'
import myLogger from '../../utils/logger'
import NormalLayout from '../photosLayouts/NormalLayout'
import '../../style/OrderDetails.css'
import UploadPhoto from '../photoList/UploadPhoto'
import { queryPhotos } from '../../utils/apiHelper'




export default class OrderItemOverview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectAll: false,
      allPhotos: [],
      uploadingPhoto: false
    }

    this.refreshPhotoList = this.refreshPhotoList.bind(this);
    this.appendSelected = this.appendSelected.bind(this);
    this.toggleSelectAll = this.toggleSelectAll.bind(this);
    this.toggleAddPhoto = this.toggleAddPhoto.bind(this);
  }

  async refreshPhotoList() {
    let response = await queryPhotos(this.props.order.pddOrderNumber)
    
    if(response.status.toLowerCase() === 'error') {
      this.setState({allPhotos: []}) 
      return
    }
    this.setState({
      allPhotos: response.data
    })
  }

  appendSelected(photo, index, selected) {
    console.log("allphotos: " + JSON.stringify(this.state.allPhotos))
    
    // photo.isSelected = selected
  }

  toggleSelectAll() {
    this.setState({selectAll: !this.state.selectAll});
  };
  
  toggleAddPhoto() {
    this.setState({uploadingPhoto: !this.state.uploadingPhoto})
  }


  componentDidMount() {
    this.refreshPhotoList();
  }
  render() {
    return (
      <div className="row">
      { !this.state.uploadingPhoto &&
        <div>

          <div class="card border-secondary mb-3 Order-Overview-Container">
            <div class="card-header">订单信息</div>
            <div class="card-body">
              <div className='order-row'>
                <div className='order-row-item'>
                  <div>
                    <span>{this.props.order.title}</span>
                  </div>
                  <div>
                    <span>{this.props.order.description}</span>
                  </div>
                </div>
                <div className='order-row-accessory'>
                  <span>{this.props.order.numPhotos}</span>
                </div>
              </div>
            </div>
          </div>
          
        
          <div className='row'>
            <NormalLayout images={this.state.allPhotos} selectAll={this.state.selectAll} appendSelected={this.appendSelected}/>
          </div>
          
          <div z-index="1000" className="Bottom-Floating-Options">
            <p>
              {/* <button className='btn btn-primary' onClick={this.toggleSelectAll}>选定所有</button>
              <br/> */}
              <button className='btn btn-primary' onClick={this.toggleAddPhoto}>添加照片</button>
            </p>
          </div>
        </div>
      }

      {
        this.state.uploadingPhoto &&
        <UploadPhoto orderNumber={this.props.order.pddOrderNumber} ></UploadPhoto>
      }
    </div>
    )
  }
}