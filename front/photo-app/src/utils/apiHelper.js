import { post, get, put, _delete, getDownload } from "./axios";
import { getToken, removeToken } from "./token";
import TOKEN_KEYS from "./consts";
import { param } from "express/lib/request";
import axios from "axios";
import { StringUtils } from "./StringUtils";
import DateFormatter from "./DateFormatter";

function getAuthenticationHeaders() {
    let access_token = getToken(TOKEN_KEYS.ACCESS_TOKEN);
    let user_login = getToken(TOKEN_KEYS.USER_LOGIN)
    let user_type = getToken(TOKEN_KEYS.USER_TYPE)

    if(access_token === null || access_token === undefined) {
        console.log("no access token!")
        throw new Error("No access token!")
    }

    if(user_login === null || user_login === undefined) {
        console.log("no user login")
        throw new Error("No user login!")
    }

    if(user_type === null || user_type === undefined) {
        console.log("no user type")
        throw new Error("No user type!")
    }

    return {
        "user_login": user_login,
        "access_token": access_token,
        "user_type": user_type
    }
}

export function apiGet(url, params = {}) {
    let authHeaders = getAuthenticationHeaders()

    let params1 = {...params, ...authHeaders}
    return get(url, params1);
}

export function apiGetDownload(url, params = {}) {
    let authHeaders = getAuthenticationHeaders()

    let params1 = {...params, ...authHeaders}
    return getDownload(url, params1);
}

export function apiPut(url, params = {}, data = {}) {
    let authHeaders = getAuthenticationHeaders()
    let params1 = {...params, ...authHeaders}
    return put(url, params1, data);
}

export function apiPost(url, data = {}, params = {}) {
    let authHeaders = getAuthenticationHeaders()
    let params1 = {...params, ...authHeaders}
    return post(url, data, params1)
}

export function apiDelete(url, data = {}, params = {}) {
    let authHeaders = getAuthenticationHeaders()
    let params1 = {...params, ...authHeaders}

    console.log("data sending: " + JSON.stringify(data));
    return _delete(url, params1, data);
}

export async function queryPhotos(pddOrderNumber) {
    const url = `/orders/${pddOrderNumber}/photos`
    const response = await get(url)
    return response;
}

export async function updatePhotoStatus(pddOrderNumber, photoId, status) {
    const url = `/orders/${pddOrderNumber}/photos/${photoId}/editStatus/${status}`
    const response = await apiPut(url)
    return response;
}

export async function updateOrderStatus(pddOrderNumber, status) {
    const url = `/admin/order/${pddOrderNumber}/status/${status}`
    const response = await apiPut(url);
    return response;
}

export async function updateOrderStatusMultiple(orders) {
    const url = `/admin/order/status/multiple`
    const response = await apiPut(url, {}, orders);
    return response;
}

export async function checkFinishedOrders() {
    const url = `/admin/checkFinishedOrders`;
    const response = await apiPost(url);
    return response;
}

export async function userLogin(userName, pwd) {
    const url = `/admin/login`;
    const sha256 = require('js-sha256');
    const encryptedPwd = sha256.sha256(pwd);
    const postData = {
        userName: userName,
        pwd: encryptedPwd
    };

    const response = await post(url, postData)
    return response
}

export async function changePwd(userName, pwd, newPwd) {
    const url = `/admin/changePwd`;
    const sha256 = require('js-sha256');
    const encryptedPwd = sha256.sha256(pwd);
    const encryptedNewPwd = sha256.sha256(newPwd);

    const postData = {
        userName: userName,
        currPwd: encryptedPwd,
        newPwd: encryptedNewPwd
    };

    const response = await post(url, postData)
    return response
}

export async function createUser(data) {
    const url = `/admin/createUser`

    const sha256 = require('js-sha256');
    const encryptedPwd = sha256.sha256(data.pwd);
    
    let postData = {...data};
    postData.pwd = encryptedPwd;

    const response = await apiPost(url, postData);
    return response;
}

export async function getUsers() {
    const url = `/admin/getUsers`
    const response = await apiGet(url);
    return response;
}

export async function logout(userName, pwd) {
    const url = `/admin/logout`

    let postData = {
        userName: userName
    };
    if(!StringUtils.isEmpty(pwd)) {
        const sha256 = require('js-sha256');
        const encryptedPwd = sha256.sha256(pwd);

        postData.pwd = encryptedPwd;

        const response = await post(url, postData);
    }

    removeToken(TOKEN_KEYS.ACCESS_TOKEN);
    removeToken(TOKEN_KEYS.USER_TYPE);
    removeToken(TOKEN_KEYS.USER_LOGIN);
}

export async function loadOrders(pddOrderNumber, status) {
    const url = "/admin/orders/all"
    const params = {}
    if (pddOrderNumber != null) {
        params.pddOrderNumber = pddOrderNumber;
    }

    if(status !== -1) {
        params.status = status
    }
    const result = await apiGet(url, params)
    return result;
}

/**
 * 
 * @param {Integer} status 订单状态
 * @param {Integer} pageIndex 页面编号
 * @param {Integer} pageSize 页面大小
 * @param {String} orderBy 排序
 * @param {Boolean} desc 是否降序
 * @param {String} searchText 搜索关键词
 * @param {Date} startDate 开始日期
 * @param {Date} endDate 结束日期
 * @returns 
 */
export async function loadOrdersPage(status, pageIndex, pageSize, orderBy, desc, searchText, startDate, endDate) {
    const url = "/admin/orders/pageAll"
    const params = {}
    if(status != null) {
        params.orderStatus = status;
    }

    params.pageIndex = pageIndex || 0
    params.pageSize = pageSize || 10
    
    if(!StringUtils.isEmpty(orderBy)) {
        params.orderBy = orderBy
    }

    if(desc !== null) {
        params.desc = desc;
    }
    
    if(!StringUtils.isEmpty(searchText)) {
        params.searchText = searchText;
    }

    const dateFormatter = new DateFormatter();

    if(startDate !== null) {
        params.startDate = dateFormatter.toString(startDate, "yyyy-MM-DD");
    }

    if(endDate !== null) {
        params.endDate = dateFormatter.toString(endDate, "yyyy-MM-DD");
    }

    const result = await apiGet(url, params)
    return result;
}

export async function customerQueryOrder(orderNumber) {
    const response = await get("/pdd/queryOrder", {order_number: orderNumber})
    return response;
}


export async function customerAddOrder(data) {
    const url = `/pdd/order/add`
    const result = await post(url, data);
    return result;
}

export async function customerEditOrder(data) {
    const url = `/pdd/order/edit`
    const result = await apiPost(url, data);
    return result;
}

export async function adminQueryOrder(orderNumber) {
    let response = await apiGet("/admin/queryOrder", {order_number: orderNumber})
    return response
}

export async function addminAddOrder(data) {
    const url = `/admin/order/add`
    const result = await apiPost(url, data);
    return result;
}

export async function adminEditOrder(data) {
    const url = `/admin/order/edit`
    const result = await apiPost(url, data);
    return result;
}

export async function deleteOrders(data) {
    const url = `/admin/order/delete`
    const result = await apiDelete(url, data);
    return result;
}

export async function deleteSelectedPhotos(pddOrderNumber, photoIds) {
    const url = `/orders/${pddOrderNumber}/photos/deleteMultiple`
    const result = await apiDelete(url, photoIds)
    return result;
}

export function ifLoggedIn() {
    const userLogin = getToken(TOKEN_KEYS.USER_LOGIN);
    const accessToken = getToken(TOKEN_KEYS.ACCESS_TOKEN);

    return (userLogin != null && accessToken != null);
}

export function getLoggedInUser() {
    const userLogin = getToken(TOKEN_KEYS.USER_LOGIN);
    const accessToken = getToken(TOKEN_KEYS.ACCESS_TOKEN);

    return {
        name: userLogin,
        token: accessToken
    };
}


export const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    }))
