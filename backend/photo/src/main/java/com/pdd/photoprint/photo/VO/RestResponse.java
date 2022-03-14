package com.pdd.photoprint.photo.VO;

import com.pdd.photoprint.photo.Configs.RestRepStatus;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class RestResponse {
    private String status = RestRepStatus.ERROR.name();

    private String message;

    private String error = "请求失败";

    private Object data;

    private String accessToken;

    public boolean checkResponse() {
        if(this.status != null && this.status.equals(RestRepStatus.SUCCESS.name())) {
            return true;
        }
        return false;
    }

    public void setError(String error) {
        this.error = error;
        this.message = null;
    }

    public void setMessage(String message) {
        this.message = message;
        this.error = null;
    }
}
