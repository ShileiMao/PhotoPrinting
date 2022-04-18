package com.pdd.photoprint.photo.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePwdDTO {
    private String userName;
    private String currPwd;
    private String newPwd;
}
