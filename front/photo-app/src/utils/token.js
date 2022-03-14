

/**
 * 存储access_token
 * @param {string} accessToken
 */
export function saveAccessToken(accessToken) {
  localStorage.setItem('access_token', `${accessToken}`)
}

/**
 * 获得某个token
 * @param {string} tokenKey
 */
export function getToken(tokenKey) {
  return localStorage.getItem(tokenKey)
}

/**
 * 保存一个键值对
 * @param {String} tokenKey 
 * @param {String} token 
 */
export function storeToken(tokenKey, token) {
  localStorage.setItem(tokenKey, token);
}

/**
 * 移除token
 */
export function removeToken() {
  localStorage.removeItem('access_token')
}
