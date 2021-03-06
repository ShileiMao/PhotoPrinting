package com.pdd.photoprint.photo.Configs.Security;

import com.pdd.photoprint.photo.interceptor.RequestLogInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AppConfiguration implements WebMvcConfigurer {
    @Autowired
    RequestInterceptor requestInterceptor;

    private RequestLogInterceptor requestLogInterceptor;

    @Autowired
    public void setRequestInterceptor(RequestLogInterceptor requestInterceptor) {
        this.requestLogInterceptor = requestInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(requestInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns("/admin/login")
                .excludePathPatterns("/pdd/queryOrder")
                .excludePathPatterns("/orders/*/photos")
                .excludePathPatterns("/orders/*/photos/*")
                .excludePathPatterns("/pdd/order/add")
                .excludePathPatterns("/pdd/order/edit")
                .excludePathPatterns("/files/uploadMultiple")
                .excludePathPatterns("/*/photos/deleteMultiple")
                .excludePathPatterns("/files/download/*/*")
                .excludePathPatterns("/files/download/*/*/*");

        registry.addInterceptor(this.requestLogInterceptor);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
//                .allowedOrigins("http://39.105.223.206")
                .allowedMethods("GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS")
                .allowCredentials(true)
                .maxAge(3600)
                .allowedHeaders("*");
    }

}
