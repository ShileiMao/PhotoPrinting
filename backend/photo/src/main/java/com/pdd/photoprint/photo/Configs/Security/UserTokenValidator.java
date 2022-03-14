package com.pdd.photoprint.photo.Configs.Security;

import org.springframework.stereotype.Component;

import javax.annotation.Resource;

@Component
public class UserTokenValidator {
    public boolean validateToken(String userLogin, String token, String userType) {
        System.out.println("trying to verify user : " + userLogin);

        return true;
    }
}
