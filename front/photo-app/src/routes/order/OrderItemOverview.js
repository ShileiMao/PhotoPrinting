// import React, { useCallback, useEffect, useState } from 'react'
import React, { Component } from 'react'
import NormalLayout from '../photosLayouts/NormalLayout'
import '../../style/OrderDetails.css'
import UploadPhoto from '../photoList/UploadPhoto'
import { deleteSelectedPhotos, queryPhotos } from '../../utils/apiHelper'
import Config from '../../config/webConf'
import ToastHelper from '../../utils/toastHelper'
import OrderOverView from '../../Components/OrderOverView'


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

          <OrderOverView order={this.props.order} photoCount={this.state.allPhotos.length} />
          
        
          <div className='row'>
            <NormalLayout images={this.state.allPhotos} selectAll={this.state.selectAll} appendSelected={this.appendSelected}/>
          </div>
          
          <div z-index="1000" className="Bottom-Floating-Options">
            <p>
              {/* <button className='btn btn-primary' onClick={this.toggleSelectAll}>选定所有</button>
              <br/> */}
              <button className='btn btn-primary btn-sm' onClick={this.toggleAddPhoto}>
                添加&nbsp;
                <i className="fas fa-plus-circle" aria-hidden="true"></i>
              </button>
              &nbsp;
              <button className='btn btn-secondary btn-sm' onClick={this.deletePhotos}>
              删除&nbsp;
              <i className="fas fa-minus-circle"></i>
              </button>
            </p>
          </div>
        </div>
      }

      {
        this.state.uploadingPhoto &&
        <UploadPhoto orderNumber={this.props.order.pddOrderNumber} hideUpload={this.toggleAddPhoto} refreshPhotoList={this.refreshPhotoList} ></UploadPhoto>
      }
    </div>
    )
  }
}