import React, { Component } from 'react'
// import ImageSelect from 'react-image-select'
import Gallery from "react-photo-gallery";
import { photos } from "./photos";


export default class PhotoSelect extends Component {
  constructor(props) {
      super(props)
      this.state = {
          test: "hello"
      }
      
      this.handleImageSelect.bind(this);
  }
  handleImageSelect(images) {
    console.log("image selected: " + JSON.stringify(images));
  }

  render() {
    return (
      <div>
        <p>select Image that you want: {this.state.test}</p>
        {/* <ImageSelect onChange={this.handleImageSelect}></ImageSelect> */}
        <Gallery photos={photos} onClick={this.handleImageSelect} />
      </div>
    )
  }
}
