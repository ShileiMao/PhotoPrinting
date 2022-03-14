import { apiGet, apiPost } from './apiHelper'
import myLogger from './logger';

export async function uploadImage(images, url, orderNumber) {
  const formData = new FormData();
  formData.append('orderNumber', orderNumber);
  images.forEach(element => {
    formData.append('files', element);
  });
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  }
  
  return await apiPost(url, formData, config)
}
