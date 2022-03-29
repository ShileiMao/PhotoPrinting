package com.pdd.photoprint.photo.controllers;

import com.pdd.photoprint.photo.Storage.StorageFileNotFoundException;
import com.pdd.photoprint.photo.Storage.StorageService;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;


@Slf4j
@RequestMapping("/files/download")
@RestController
public class DownloadController {
    private final StorageService storageService;

    @Autowired
    public DownloadController(StorageService storageService) {
        this.storageService = storageService;
    }

    @GetMapping("/{filename:.+}")
	@ResponseBody
	public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
		Resource file = storageService.loadAsResource("", filename);
		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
				"attachment; filename=\"" + file.getFilename() + "\"").body(file);
	}

    @GetMapping("**/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile1(ServletRequest request, @PathVariable(name = "filename") String filename) {
        String uri = this.getUriFromRequest(request);
        if(!uri.contains("/files/download/")) {
            throw new StorageFileNotFoundException("文件不存在");
        }
        int index = uri.indexOf("/files/download/");

        String relativePath = uri.substring(index + "/files/download/".length());
        relativePath = relativePath.substring(0, relativePath.length() - filename.length() - 1);
        log.info("requesting file at location: " + relativePath + "/" + filename);

        Resource file = storageService.loadAsResource(relativePath, filename);
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }

    private String getUriFromRequest(ServletRequest request) {
        if(request instanceof HttpServletRequest) {
            String uriStr = ((HttpServletRequest) request).getRequestURI();
            try {
                return URLDecoder.decode(uriStr, StandardCharsets.UTF_8.name());
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
        return "";
    }
}

