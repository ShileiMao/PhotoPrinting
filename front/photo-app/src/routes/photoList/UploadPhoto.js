import React, { Component } from 'react'
import ImageUploading from 'react-images-uploading'
import Config from '../../config/webConf'
import { uploadImage } from '../../utils/fileUploader'
import myLogger from '../../utils/logger'
import ToastHelper from '../../utils/toastHelper'

export default class UploadPhoto extends Component {

  constructor(props) {
      super(props)
      this.state = {
          images: [],
          orderNumber: props.orderNumber
      }
      this.onImageUpload = this.onImageUpload.bind(this);
      this.onChange = this.onChange.bind(this);
      this.onImageRemoveAll = this.onImageRemoveAll.bind(this);
      this.onImageRemove = this.onImageRemove.bind(this);
      this.uploadAll = this.uploadAll.bind(this);
  }

  onImageUpload() {
    console.log("on image upload ")
  }

  onChange(imageList, addUpdateIndex) {
    this.setState({
        images: imageList
    });
  }

  onImageRemoveAll() {
    console.log("on image remove all")
  }

  onImageRemove() {
    console.log("on image remove")
  }

  async uploadAll() {
    console.log("upload all")
    let url = `/files/uploadMultiple` 
    let files = this.state.images.map( (item, index) => {
      myLogger.debug("item: " + JSON.stringify(item.file));
      return item.file;
    });
    
    const response = await uploadImage(files, url, this.props.orderNumber);
    if(response.status.toLowerCase() !== 'success') {
      ToastHelper.showError(response.error || "上传失败");
      return;
    }
    console.log("response: " + JSON.stringify(response));
    ToastHelper.showDefault("上传成功！");

    this.props.hideUpload();
    this.props.refreshPhotoList();
  }

  render() {
    const MAX_FILE_SIZE = 1024 * 1024 * 6
    const imageFiles = [];
    const maxNumber = 10;
    
    const getImageItem = () => {
      
    }
    return (
      <>
        <ImageUploading
          multiple
          value={this.state.images}
          onChange={this.onChange}
          maxNumber={maxNumber}
          dataURLKey="data_url"
        >
          {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps,
          }) => (
            // write your building UI
            <div className="card border-secondary mb-3" >
              <div className="card-header">上传照片</div>
              <div className="card-body">
                  <button
                  className='btn btn-secondary btn-sm'
                  style={isDragging ? { color: 'red' } : undefined}
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  上 传
                </button>
                &nbsp;
                {
                  this.state.images.length > 0 &&
                  <button className='btn btn-secondary btn-sm' onClick={onImageRemoveAll}>删除所有</button>
                }
                &nbsp;
                <button className='btn btn-secondary btn-sm' onClick={this.props.hideUpload}>返回</button>
                
                <div className='upload-container'>
                  {
                    imageList.map((image, index) => (
                      <div key={index} className="image-item">
                        <img src={image['data_url']} alt="" width="100" />
                        <div className="image-item__btn-wrapper">
                          <button className='btn btn-secondary btn-sm' onClick={() => onImageUpdate(index)}>修改</button>
                          <button className='btn btn-secondary btn-sm' onClick={() => onImageRemove(index)}>删除</button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          )}
        </ImageUploading>

        {
          this.state.images.length > 0 &&
          <div>
            <button className='btn btn-primary btn-sm' onClick={this.uploadAll}>
              上传
            </button>
          </div>
        }
      </>
    )
  }
}
