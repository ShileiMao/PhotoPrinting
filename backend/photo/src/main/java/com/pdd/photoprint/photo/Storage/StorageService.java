package com.pdd.photoprint.photo.Storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;
import java.util.stream.Stream;

public interface StorageService {
    void init();

	String store(MultipartFile file, String relativePath, String fileName, boolean override);

	String[] storeMultiple(List<MultipartFile> fileList, String relativePath, List<String> fileNames, boolean override);

	Stream<Path> loadAll(String relativePath);

	Path load(String relativePath, String filename);

	Resource loadAsResource(String relativePath, String filename);

	boolean fileExists(String relativePath, String fileName);
	void deleteAll();

	String getRootDirPath();
}
