package com.pdd.photoprint.photo.Configs.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@Component
public class RequestInterceptor extends HandlerInterceptorAdapter {
    @Autowired
    UserTokenValidator userTokenValidator;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();

        String userLogin = request.getHeader("user_login");
        String token = request.getHeader("access_token");
        String userType = request.getHeader("user_type");

        boolean isValid = userTokenValidator.validateToken(userLogin, token, userType);
        
        return isValid;
    }
}
