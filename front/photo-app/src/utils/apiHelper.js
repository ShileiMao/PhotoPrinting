import { post, get, put, _delete } from "./axios";
import { getToken } from "./token";
import TOKEN_KEYS from "./consts";
import { param } from "express/lib/request";

function getAuthenticationHeaders() {
    let access_token = getToken(TOKEN_KEYS.ACCESS_TOKEN);
    let user_login = getToken(TOKEN_KEYS.USER_LOGIN)
    let user_type = getToken(TOKEN_KEYS.USER_TYPE)

    if(access_token == null || access_token == undefined) {
        console.log("no access token!")
        throw new Error("No access token!")
    }

    if(user_login == null || user_login == undefined) {
        console.log("no user login")
        throw new Error("No user login!")
    }

    if(user_type == null || user_type == undefined) {
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

export function apiPost(url, data = {}, params = {}) {
    let authHeaders = getAuthenticationHeaders()
    let params1 = {...params, ...authHeaders}
    return post(url, data, params1)
}

export async function queryPhotos(pddOrderNumber) {
    const url = `/orders/${pddOrderNumber}/photos`
    const response = await apiGet(url)
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

export async function loadOrders(pddOrderNumber, status) {
    const url = "/admin/orders/all"
    const params = {}
    if (pddOrderNumber != null) {
        params.pddOrderNumber = pddOrderNumber;
    }

    if(status != -1) {
        params.status = status
    }
    const result = await apiGet(url, params)
    return result;
}