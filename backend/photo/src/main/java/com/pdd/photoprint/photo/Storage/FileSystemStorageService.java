package com.pdd.photoprint.photo.Storage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Stream;

@Service
public class FileSystemStorageService implements StorageService {

	private final Path rootLocation;

	@Autowired
	public FileSystemStorageService(StorageProperties properties) {
		this.rootLocation = Paths.get(properties.getLocation());
	}

	@Override
	public String store(MultipartFile file, String relativePath, @Nullable String fileName, boolean override) {
		try {
			if (file.isEmpty()) {
				throw new StorageException("Failed to store empty file " + file.getOriginalFilename());
			}

			Path dirPath = this.rootLocation.resolve(relativePath);
			if(!dirPathExists(dirPath)) {
				makeDirs(dirPath);
			}
			String name = StringUtils.isEmpty(fileName) ? file.getOriginalFilename() : fileName;
			Path filePath = dirPath.resolve(name);
			if (Files.exists(filePath) && !override) {
				throw new StorageDuplicateFileException("File exists " + file.getOriginalFilename());
			}
			Files.copy(file.getInputStream(), filePath);
			return this.rootLocation.relativize(filePath).toString();
		} catch (IOException e) {
			throw new StorageException("Failed to store file " + file.getOriginalFilename(), e);
		}
	}

	@Override
	public String[] storeMultiple(List<MultipartFile> fileList, String relativePath,
							  @Nullable List<String>fileNames, boolean override) {
		Path dirPath = this.rootLocation.resolve(relativePath);
		if(!dirPathExists(dirPath)) {
			makeDirs(dirPath);
		}
		var ref = new Object() {
			int index = 0;
		};
		String[] paths = new String[fileList.size()];

		fileList.forEach(file -> {
			try {
				String name = file.getOriginalFilename();
				if(fileNames != null) {
					name = fileNames.get(ref.index);
				}
				Path filePath = dirPath.resolve(name);
				if(Files.exists(filePath) && !override) {
					throw new StorageDuplicateFileException("File exists");
				}

				Files.copy(file.getInputStream(), filePath);

				paths[ref.index] = this.rootLocation.relativize(filePath).toString();
				ref.index++;
			} catch (IOException e) {
				throw new StorageException("Failed to store files", e);
			}
		});

		return paths;
	}

	@Override
	public Stream<Path> loadAll(String relativePath) {
		try {
			Path dirPath = this.rootLocation.resolve(relativePath);
			return Files.walk(dirPath, 1)
					.filter(path -> !path.equals(dirPath))
					.map(path -> dirPath.relativize(path));
		} catch (IOException e) {
			throw new StorageException("Failed to read stored files", e);
		}
	}

	@Override
	public Path load(String relativePath, String filename) {
		Path relPath = Paths.get(relativePath);
		Path dirPath = rootLocation.resolve(relPath);
		return dirPath.resolve(filename);
	}

	@Override
	public Resource loadAsResource(String relativePath, String filename) {
		try {
			Path file = load(relativePath, filename);
			Resource resource = new UrlResource(file.toUri());
			if(resource.exists() || resource.isReadable()) {
				return resource;
			}
			else {
				throw new StorageFileNotFoundException("Could not read file: " + filename);
			}
		} catch (MalformedURLException e) {
			throw new StorageFileNotFoundException("Could not read file: " + filename, e);
		}
	}

	@Override
	public void deleteAll() {
		FileSystemUtils.deleteRecursively(rootLocation.toFile());
	}

	@Override
	public void init() {
		if(!dirPathExists(this.rootLocation)){
			makeDirs(this.rootLocation);
		}
	}

	private void makeDirs(Path path) {
		try {
			Files.createDirectory(path);
		} catch (IOException e) {
			throw new StorageException("Could not initialize storage", e);
		}
	}

	private boolean dirPathExists(Path path) {
		if(Files.exists(path) && Files.isDirectory(path)) {
			return true;
		}
		return false;
	}

	public boolean fileExists(String relativePath, String fileName) {
		Path relPath = Paths.get(relativePath);
		Path filePath = rootLocation.resolve(relPath).resolve(fileName);
		if(Files.exists(filePath) && !Files.isDirectory(filePath)) {
			return true;
		}
		return false;
	}

	@Override
	public String getRootDirPath() {
		return this.rootLocation.toAbsolutePath().toString();
	}
}

