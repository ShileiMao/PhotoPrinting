import React, { useCallback } from 'react'
import Gallery from "react-photo-gallery";
import SelectedImage from './SelectedImage'

export const PrintLayout = React.forwardRef((props, ref) => {

  const allPhotos = props.images.map((item, index) => {
    return {
      src: item.src,
      // width: item.width,
      // height: item.height
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
    <div ref={ref}>
      <Gallery photos={allPhotos} renderImage={imageRenderer} />
    </div>
  )
})
