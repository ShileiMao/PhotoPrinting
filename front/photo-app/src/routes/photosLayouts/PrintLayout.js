import React, { useCallback, useEffect, useState } from 'react'
import SelectedImage from './SelectedImage'
import '../../style/Printing.css'
import { useParams } from 'react-router-dom'
import { loadOrders, queryPhotos } from '../../utils/apiHelper'
import myLogger from '../../utils/logger'
import Config from '../../config/webConf'

export const PrintLayout = React.forwardRef((props, ref) => {

  const allPhotos = props.images

  const [allPhotos1, setAllPhotos1] = useState()

  const orderNumber = useParams().orderNumber

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

  useEffect(() => {
    if(orderNumber !== null && orderNumber !== undefined) {
      refreshPhotoList(orderNumber)
    }
  }, [])

  const refreshPhotoList = async (orderNumber) => {
    const result = await loadOrders(orderNumber);
    if(result.status.toLowerCase() === 'error') {
        console.log("error loading order: " + result.error);
        return;
    }

    let response = await queryPhotos(orderNumber)
    
    if(response.status.toLowerCase() === 'error') {
      this.setState({allPhotos: []}) 
      return
    }

    let photoList = response.data.map(item => {
      let object = {...item};
      object.src = Config.BASE_URL + item.src
      return object;
    })

    setAllPhotos1(photoList)
  }

  const getLandscapeStyle = function(image) {
    const width = image.width;
    const height = image.height;

    // const scale = width > height ? height / width : 1
    // const yshift = -100 * scale
    // const style = {transform: `rotate(90deg) translateY("+yshift+"%) scale("+scale+")`};
    // return style;

    if(width > height) {
      // const scale = height / width;
      // console.log("scale number: " + scale);
      // const yshift = -100 * scale
      const style = {transform: `rotate(90deg)`};
      return style;
      // return {transform: `scale(${scale}) rotate(90deg)`}
    }

    return {}
  }

  // const rotateImage = (event) => {
  //   // Create a canvas object.
  //   let canvas = document.getElementById("myCanvas");
    
  //   let img = new Image();
  //   img.src = event.target.src;

  //   // Create canvas context.
  //   let ctx = canvas.getContext("2d");	

  //   // Assign width and height.
  //   canvas.width = img.width;
  //   canvas.height = img.height;

  //   ctx.translate(canvas.width / 2,canvas.height / 2);

  //   // Rotate the image and draw it on the canvas. 
  //       // (I am not showing the canvas on the webpage.
  //   ctx.rotate(Math.PI / 2);
  //   ctx.drawImage(img, -img.width / 2, -img.height / 2);


  //   img.src = canvas.toDataURL();
  // }

  const allPhotos2 = allPhotos || allPhotos1 || []

  const getClassName = (element,index) => {
    const isLandscape = element.width > element.height;
    let className = "photo-pic"
    if(isLandscape) {
      className += " img-landscape"
    } else {
      className += " img-portrait"
    }

    return className;
  }

  return (
    <div ref={ref} className="print-container">
      {/* <canvas id="myCanvas" width="200" height="100" style={{display: `none`}} /> */}
      {
        allPhotos2.map((element, index) => {
          return(
            index % 2 == 0 ?
          <div className='page photo-container' key={index}>
            <img className={getClassName(element, index)} src={element.src} />
          </div> 
          :
          
          <div className='page_1 photo-container' key={index}>
            <img className={getClassName(element, index)} src={element.src} />
          </div>
          );
        })
      }
      {/* <Gallery photos={allPhotos} renderImage={imageRenderer} /> */}
    </div>
  )
})
