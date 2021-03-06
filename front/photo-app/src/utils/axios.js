// ajax 封装插件, 使用 axios
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import webConf from '../config/webConf'
import myLogger from './logger';
import ToastHelper from './toastHelper';


const config = {
  baseURL: webConf.BASE_URL,
  timeout: 30 * 1000, //   请求超时时间设置
  crossDomain: true,
  withCredentials: true, // Check cross-site Access-Control
  // 定义可获得的http响应状态码
  // return true、设置为null或者undefined，promise将resolved,否则将rejected
  validateStatus(status) {
    return status >= 200 && status < 510
  },
  handleError: (res) => {
    if(res.status === 401) {
      ToastHelper.showError("服务器响应错误", () => {
        if(res.config.url !== undefined && res.config.url.startsWith('/pdd')) {
          window.location = ''
        } else {
          window.location = "/admin"
        }
      });
      setTimeout(() => {
        if(res.config.url !== undefined && res.config.url.startsWith('/pdd')) {
        } else {
          window.location = "/admin"
        }
      }, 500);
    }
    //  else {
    //   window.location = "/admin"
    // }
  }
}

myLogger.debug("back end url: " + webConf.BASE_URL)

// const retryTime = 2 // 请求失败重试次数
// const retryDelay = 1500 // 请求失败重试间隔

// 创建请求实例
axios.defaults.withCredentials = true;
const _axios = axios.create(config)

_axios.interceptors.request.use(
  originConfig => {
    // 有 API 请求重新计时
    // Vue.prototype.$_lin_jump()
    const reqConfig = { ...originConfig }

    // step1: 容错处理
    if (!reqConfig.url) {
      /* eslint-disable-next-line */
      console.error('request need url')
      throw new Error({
        source: 'axiosInterceptors',
        message: 'request need url',
      })
    }

    if (!reqConfig.method) {
      // 默认使用 get 请求
      reqConfig.method = 'get'
    }
    // 大小写容错
    reqConfig.method = reqConfig.method.toLowerCase()

    // 参数容错
    if (reqConfig.method === 'get') {
      if (!reqConfig.params) {
        // 防止字段用错
        reqConfig.params = reqConfig.data || {}
      }
    } else if (reqConfig.method === 'post') {
      if (!reqConfig.data) {
        // 防止字段用错
        reqConfig.data = reqConfig.params || {}
      }

      // 检测是否包含文件类型, 若包含则进行 formData 封装
      let hasFile = false
      Object.keys(reqConfig.data).forEach(key => {
        if (typeof reqConfig.data[key] === 'object') {
          const item = reqConfig.data[key]
          if (item instanceof FileList || item instanceof File || item instanceof Blob) {
            hasFile = true
          }
        }
      })

      // 检测到存在文件使用 FormData 提交数据
      if (hasFile) {
        const formData = new FormData()
        Object.keys(reqConfig.data).forEach(key => {
          formData.append(key, reqConfig.data[key])
        })
        reqConfig.data = formData
      }
    } else {
      // TODO: 其他类型请求数据格式处理
      /* eslint-disable-next-line */
      console.log("put")
      console.warn(`其他请求类型: ${reqConfig.method}, 暂无自动处理`)
    }
    return reqConfig
  },
  error => {
    console.log("error when request...")
    Promise.reject(error)
  },
)

// Add a response interceptor
_axios.interceptors.response.use(
  async res => {
    let { code, message } = res.data // eslint-disable-line
    if (res.status.toString().charAt(0) === '2') {
      return res.data
    }
    return new Promise(async (resolve, reject) => {
      // const { url } = res.config

      if (res.config.handleError) {
        return res.config.handleError(res)
      }
      reject()
    })
  },
  error => {
    // 判断请求超时
    if(error.code === 'ECONNABORTED' && error.message.indexOf(webConf.TIMEOUT_MSG) !== -1) {
      ToastHelper.showError(webConf.TIMEOUT_MSG);
    }
    console.log("请求失败: " + error)
    return Promise.reject(error)
  },
)

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export function post(url, data = {}, params = {}) {
  return _axios({
    method: 'post',
    url,
    data,
    params,
  })
}

/**
 * @param {string} url
 * @param {object} params
 */
export function get(url, params = {}) {
  return _axios({
    method: 'get',
    url,
    params,
    timeoutErrorMessage: webConf.TIMEOUT_MSG,
  })
}

export function getDownload(url, params = {}) {
  return _axios({
    method: 'get',
    url,
    params,
    responseType: 'blob',
    timeoutErrorMessage: webConf.TIMEOUT_MSG,
  })
}

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export function put(url, params = {}, data = {},) {
  return _axios({
    method: 'put',
    url,
    params,
    data,
  })
}

/**
 * @param {string} url
 * @param {object} params
 */
export function _delete(url, headers = {}, data = {}) {
  return _axios.delete(url,{
    params: headers,
    data: data
  })
}

export default _axios
