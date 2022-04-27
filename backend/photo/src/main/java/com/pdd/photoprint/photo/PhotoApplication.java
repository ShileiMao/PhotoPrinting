package com.pdd.photoprint.photo;

import com.pdd.photoprint.photo.Storage.StorageProperties;
import com.pdd.photoprint.photo.Storage.StorageService;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication(scanBasePackages = {"com.pdd.photoprint.photo"})
@EnableConfigurationProperties(StorageProperties.class)
//@EnableRedisHttpSession
@MapperScan(basePackages = {"com.pdd.photoprint.photo.mapper"})
public class PhotoApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(PhotoApplication.class, args);
	}

	@Bean
	CommandLineRunner init(StorageService storageService) {
		return (args) -> {
//			storageService.deleteAll();
			storageService.init();
		};
	}

}
