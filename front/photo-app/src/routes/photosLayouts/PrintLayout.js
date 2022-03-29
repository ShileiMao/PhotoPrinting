import React, { useCallback } from 'react'
import SelectedImage from './SelectedImage'

export const PrintLayout = React.forwardRef((props, ref) => {

  const allPhotos = props.images

  const appendSelected = props.appendSelected || (() => {})

  // const imageRenderer = useCallback(
  //   ({ index, left, top, key, photo }) => (
  //     <SelectedImage
  //       selected={props.selectAll ? true : false}
  //       key={key}
  //       margin={"2px"}
  //       index={index}
  //       photo={photo}
  //       left={left}
  //       top={top}
  //       appendSelected={appendSelected}
  //     />
  //   ),
  //   [props.selectAll]
  // );

  const getLandscapeStyle = function(image) {
    const width = image.width;
    const height = image.height;
    if(width > height) {
      const scale = height / width;
      console.log("scale number: " + scale);
      
      return {transform: `scale(${scale}) rotate(90deg)`}
    }

    return {}
  }

  return (
    <div ref={ref}>
      {
        allPhotos.map((element, index) => {
          console.log("generating image on index " + index + ", src: " + element);
          const isLandscape = element.width > element.height;

          return(
          <div className='page photo-container' key={index}>
            <img className={isLandscape ? 'photo-pic img-landscape' : 'photo-pic'} style={getLandscapeStyle(element)} src={element.src} />
          </div>);
        })
      }
      {/* <Gallery photos={allPhotos} renderImage={imageRenderer} /> */}
    </div>
  )
})
