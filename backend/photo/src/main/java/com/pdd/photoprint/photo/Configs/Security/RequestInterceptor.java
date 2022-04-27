package com.pdd.photoprint.photo.Configs.Security;

import com.github.pagehelper.util.StringUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.SessionCookieConfig;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@Slf4j
@Component
public class RequestInterceptor extends HandlerInterceptorAdapter {
    @Autowired
    UserTokenValidator userTokenValidator;

    @Autowired
    HttpSession httpSession;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
//        HttpSession session = request.getSession(false);
//        String accessToken = (String) session.getAttribute("access_token");
//        Object token = session.getAttribute("access_token");

//        String userLogin = request.getHeader("user_login");
//        String token = request.getHeader("access_token");
//        String userType = request.getHeader("user_type");
        String token = request.getParameter("access_token");
        String userLogin = request.getParameter("user_login");
        String userType = request.getParameter("user_type");

        if(StringUtil.isEmpty(token)) {
            log.info("access token not valid: " + token);
            response.setStatus(401);
           return false;
        }

        boolean isValid = userTokenValidator.validateToken(userLogin, token, userType);
        if(!isValid) {
            response.setStatus(401);
        }

        return isValid;

    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable ModelAndView modelAndView) throws Exception {
        HttpSession session = request.getSession();
        Object token = session.getAttribute("user_access_token");
        System.out.println("---");

    }
}
