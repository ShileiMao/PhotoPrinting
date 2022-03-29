// import React, { useCallback, useEffect, useState } from 'react'
import React, { Component } from 'react'
import NormalLayout from '../photosLayouts/NormalLayout'
import '../../style/OrderDetails.css'
import UploadPhoto from '../photoList/UploadPhoto'
import { deleteSelectedPhotos, queryPhotos } from '../../utils/apiHelper'
import Config from '../../config/webConf'
import ToastHelper from '../../utils/toastHelper'


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
    this.deletePhotos = this.deletePhotos.bind(this);
  }

  async refreshPhotoList() {
    let response = await queryPhotos(this.props.order.pddOrderNumber)
    
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

  appendSelected(photo, index, selected) {
    photo.isSelected = selected;

    let allPhotos = this.state.allPhotos;
    allPhotos[index].isSelected = selected;
    this.setState({
      allPhotos: allPhotos
    })
  }

  toggleSelectAll() {
    this.setState({selectAll: !this.state.selectAll});
    this.state.allPhotos.forEach((photo, index) => {
      photo.isSelected = !this.state.selectAll
    })
  };
  
  toggleAddPhoto() {
    this.setState({uploadingPhoto: !this.state.uploadingPhoto})
  }

  async deletePhotos() {
    let selectedPhotos = this.state.allPhotos.filter(photo => {
      return photo.isSelected === true
    });

    if(selectedPhotos.length === 0) {
      ToastHelper.showWarning("请选择要删除的照片");
      return;
    }

    const photoIds = selectedPhotos.map(item => {
      return item.pictureId;
    })
    const result = await deleteSelectedPhotos(this.props.order.pddOrderNumber, photoIds)

    this.refreshPhotoList();
  }

  componentDidMount() {
    this.refreshPhotoList();
  }
  
  render() {
    return (
      <div className="row">
      { !this.state.uploadingPhoto &&
        <div>

          <div className="card border-secondary mb-3 Order-Overview-Container">
            <div className="card-header">订单信息</div>
            <div className="card-body">
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
                  <span>/</span>
                  <span style={{color: `rosybrown`}}>{this.state.allPhotos.length}</span>
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
              <br/>
              <button className='btn btn-primary' onClick={this.deletePhotos}>删除照片</button>
            </p>
          </div>
        </div>
      }

      {
        this.state.uploadingPhoto &&
        <UploadPhoto orderNumber={this.props.order.pddOrderNumber} hideUpload={this.toggleAddPhoto} ></UploadPhoto>
      }
    </div>
    )
  }
}