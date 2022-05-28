import React, { useState, useCallback } from "react";
import { render } from "react-dom";
import Gallery from "react-photo-gallery";
import SelectedImage from './SelectedImage'
import { photos } from "../photoList/photos";

const NormalLayout = (props) => {
  const allPhotos = props.images.map((item, index) => {
    return {
      src: item.src,
      width: item.width,
      height: item.height,
      status: item.status
    }
  })

  const appendSelected = props.appendSelected || (() => {})


  const imageRenderer = useCallback(
    ({ index, left, top, key, photo }) => (
      <SelectedImage
        selected={props.selectAll ? true : false}
        key={key}
        margin={"2px"}
        index={index}
        photo={photo}
        left={left}
        top={top}
        appendSelected={appendSelected}
      />
    ),
    [props.selectAll]
  );

  return (
    <div>
      <Gallery photos={allPhotos} direction='row' renderImage={imageRenderer} />
    </div>
  )
}

export default NormalLayout;