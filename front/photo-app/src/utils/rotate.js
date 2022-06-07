// function rotate(srcBase64, degrees, callback) {
//   const canvas = document.createElement('canvas');
//   let ctx = canvas.getContext("2d");
//   let image = new Image();

//   image.onload = function () {
//     canvas.width = degrees % 180 === 0 ? image.width : image.height;
//     canvas.height = degrees % 180 === 0 ? image.height : image.width;

//     ctx.translate(canvas.width / 2, canvas.height / 2);
//     ctx.rotate(degrees * Math.PI / 180);
//     ctx.drawImage(image, image.width / -2, image.height / -2);

//     callback(canvas.toDataURL());
//   };

//   image.src = srcBase64;
// }

// // Usage:
// const imageTag = document.getElementById('image');

// rotate(imageTag.attributes.src.value, 90, function(resultBase64) {
//   imageTag.setAttribute('src', resultBase64);
// });




export const rotateBase64Image = (base64data, degrees) => {
  // const canvas = document.createElement("canvas");
  // const ctx = canvas.getContext("2d");
  // const image = new Image();
  // image.src = base64data;
  // return new Promise(resolve => {
  //   image.onload = () => {
  //     ctx.translate(image.width, image.height);
  //     ctx.rotate(degrees * Math.PI / 180);
  //     ctx.drawImage(image, 0, 0);
  //     resolve(canvas.toDataURL())
  //   };
  // })


  const canvas = document.createElement('canvas');
  let ctx = canvas.getContext("2d");
  let image = new Image();
  image.src = base64data;

  return new Promise(resolve => {
    image.onload = function () {
      canvas.width = degrees % 180 === 0 ? image.width : image.height;
      canvas.height = degrees % 180 === 0 ? image.height : image.width;
  
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(degrees * Math.PI / 180);
      ctx.drawImage(image, image.width / -2, image.height / -2);

      resolve(canvas.toDataURL());
    };
  })
}

// (async () => {
//   const rotatedImg = await rotateBase64Image(img)
//   const imgEl = document.querySelector('img')
//   imgEl.src = rotatedImg
// })()