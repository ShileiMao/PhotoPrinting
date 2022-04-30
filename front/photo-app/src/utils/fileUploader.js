import { apiPost } from './apiHelper'

export async function uploadImage(images, url, orderNumber) {
  const formData = new FormData();
  formData.append('orderNumber', orderNumber);
  images.forEach(element => {
    formData.append('files', element);
  });
  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  }
  
  return await apiPost(url, formData, config)
}
