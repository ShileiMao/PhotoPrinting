package com.pdd.photoprint.photo.controllers;

import java.awt.*;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import com.pdd.photoprint.photo.Configs.OrderPictureStatus;
import com.pdd.photoprint.photo.Configs.OrderStatus;
import com.pdd.photoprint.photo.Configs.RestRepStatus;
import com.pdd.photoprint.photo.Storage.StorageFileNotFoundException;
import com.pdd.photoprint.photo.Storage.StorageService;
import com.pdd.photoprint.photo.Utils.ZipLibrary;
import com.pdd.photoprint.photo.VO.PddOrderSummary;
import com.pdd.photoprint.photo.VO.PrintPhotoSummary;
import com.pdd.photoprint.photo.VO.RestResponse;
import com.pdd.photoprint.photo.image.DefaultImgCompressionFmt;
import com.pdd.photoprint.photo.image.JpgImage;
import com.pdd.photoprint.photo.mapper.OrderMapper;
import com.pdd.photoprint.photo.mapper.OrderPictureMapper;
import com.pdd.photoprint.photo.mapper.PictureMapper;
import com.pdd.photoprint.photo.model.OrderPicture;
import com.pdd.photoprint.photo.model.Pictures;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.imaging.ImageFormat;
import org.apache.commons.imaging.ImageFormats;
import org.apache.commons.imaging.ImageReadException;
import org.apache.commons.imaging.Imaging;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


@Slf4j
@Controller
@RequestMapping("/files")
public class PictureUploadController {

	@Autowired
	private OrderPictureMapper orderPictureMapper;

	@Autowired
	private OrderMapper orderMapper;

	@Autowired
	private PictureMapper pictureMapper;

	private final StorageService storageService;

	@Autowired
	ZipLibrary zipLibrary;

	@Autowired
	public PictureUploadController(StorageService storageService) {
		this.storageService = storageService;
	}

	@GetMapping("/list")
	public String listUploadedFiles(Model model) throws IOException {
		log.debug("the file root dir: " + this.storageService.getRootDirPath());
		log.info("the file root dir -- info: " + this.storageService.getRootDirPath());

		model.addAttribute("files", storageService.loadAll("").map(
				path -> MvcUriComponentsBuilder.fromMethodName(DownloadController.class,
						"serveFile", path.getFileName().toString()).build().toUri().toString())
				.collect(Collectors.toList()));

		return "uploadForm";
	}

	@GetMapping("list/{relativePath}")
	public String listUploadedFiles1(Model model, @PathVariable String relativePath) throws IOException {
		String relPath = "";
		if(relativePath != null) {
			relPath = relativePath;
		}
		model.addAttribute("files", storageService.loadAll(relPath).map(
						path -> MvcUriComponentsBuilder.fromMethodName(PictureUploadController.class,
								"serveFile", path.getFileName().toString()).build().toUri().toString())
				.collect(Collectors.toList()));

		return "uploadForm";
	}

	@PostMapping("/upload")
	@ResponseBody
	public String handleFileUpload(@RequestParam("file") MultipartFile file, @RequestParam(required = false) String fileName,
			RedirectAttributes redirectAttributes) {
		String filePath = storageService.store(file, "images", fileName, false);
		redirectAttributes.addFlashAttribute("message",
				"You successfully uploaded " + file.getOriginalFilename() + "!");

		return filePath;
	}

	@PostMapping("/uploadMultiple")
	@ResponseBody
	public RestResponse handleFileUploadMultiple(@RequestParam("files") MultipartFile[] fileList,
																	@RequestParam(required = false) List<String> fileNames,
																	@RequestParam String orderNumber) {
		RestResponse response = new RestResponse();
		PddOrderSummary orderSummary = orderMapper.queryOrderByNumber(orderNumber);

		List<String> localFileNames = fileNames;
		/* 允许上传重复照片
		if(localFileNames == null) {
			localFileNames = new ArrayList<>();
			for(int i =0; i < fileList.length; i ++) {
				String fileName = UUID.randomUUID().toString();
				MultipartFile file = fileList[i];
				String originalFilename = file.getOriginalFilename();
				if(originalFilename.lastIndexOf('.') != -1) {
					String extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
					fileName += extension;
				}
				localFileNames.add(fileName);
			}
		}
		*/
		if(orderSummary == null) {
			response.setStatus(RestRepStatus.ERROR.name());
			response.setError("订单信息不存在，请重试！");
			return response;
		}

		if(orderSummary.getStatus() > OrderStatus.PRINTED.getValue()) {
			response.setStatus(RestRepStatus.ERROR.name());
			response.setError("订单不可编辑。");
			return response;
		}

		// 检查文件格式
		for (int index = 0; index < fileList.length; index ++) {
			try {
				MultipartFile file = fileList[index];
				byte[] bytes = file.getBytes();
				ImageFormat minType = Imaging.guessFormat(file.getBytes());
				if(minType != ImageFormats.JPEG && minType != ImageFormats.PNG) {
					response.setStatus(RestRepStatus.ERROR.name());
					response.setError("文件格式有误，请上传正确的图片格式!");
					return response;
				}

				String fileName = file.getOriginalFilename();
				if(localFileNames != null) {
					fileName = localFileNames.get(index);
				}

				if(storageService.fileExists(orderNumber, fileName)) {
					response.setStatus(RestRepStatus.ERROR.name());
					response.setError("文件已存在，请重试: " + fileName);
					return response;
				}

			} catch (ImageReadException e) {
				e.printStackTrace();
				response.setStatus(RestRepStatus.ERROR.name());
				response.setError("文件格式有误，请上传正确的图片格式!");
				return response;
			} catch (IOException e) {
				e.printStackTrace();
				response.setStatus(RestRepStatus.ERROR.name());
				response.setError("文件格式有误，请上传正确的图片格式!");
				return response;
			}
		}

		Integer totalCopies = orderPictureMapper.queryTotalPictures(orderNumber);
		if(totalCopies == null) {
			totalCopies = 0;
		}
		if(totalCopies + fileList.length > orderSummary.getNumPhotos()) {
			response.setStatus(RestRepStatus.ERROR.name());
			response.setError("照片达到最大数量，不可继续上传!");
			return response;
		}
		String[] paths = storageService.storeMultiple(Arrays.asList(fileList), orderNumber, localFileNames, false);


		int index = 0;
		for (index = 0; index < paths.length; index ++) {
			String relativePath = paths[index];
			MultipartFile file = fileList[index];

			try {
				byte[] bytes = fileList[index].getBytes();
				Dimension dimension = Imaging.getImageSize(bytes);

				Path rootPath = Paths.get(storageService.getRootDirPath());
				Path imageFullPath = rootPath.resolve(relativePath);
				Path thumbnailDirPath = imageFullPath.getParent().resolve("thumbnail");
				if(Files.notExists(thumbnailDirPath) || !Files.isDirectory(thumbnailDirPath)) {
					Files.createDirectory(thumbnailDirPath);
				}
				Path thumbnailPath = thumbnailDirPath.resolve(imageFullPath.getFileName());

				JpgImage jpgImage = new JpgImage(imageFullPath.toFile(), new DefaultImgCompressionFmt(dimension, bytes.length));
				jpgImage.compressTo(thumbnailPath.toFile());

				Pictures picture = new Pictures();
				picture.setName(file.getName());
				picture.setLocation(relativePath);
				picture.setDescription("打印照片");
				picture.setWidth(dimension.width);
				picture.setHeight(dimension.height);
				picture.setThumbnail(rootPath.relativize(thumbnailPath).toString());

				log.debug("thumbnail path: %s", rootPath.resolve((thumbnailPath)).toString());

				pictureMapper.insert(picture);

				OrderPicture orderPicture = new OrderPicture(picture.getId(), orderSummary.getId(), "default", 1, OrderPictureStatus.NEW.getValue());
				orderPictureMapper.insert(orderPicture);
			} catch (IOException | ImageReadException e) {
				e.printStackTrace();

				response.setStatus(RestRepStatus.ERROR.name());
				response.setMessage("上传失败, 请重试");
				return response;
			}
		}

		response.setStatus(RestRepStatus.SUCCESS.name());
		response.setMessage("上传成功");

		return response;
	}

	@ExceptionHandler(StorageFileNotFoundException.class)
	public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
		return ResponseEntity.notFound().build();
	}

	@GetMapping("/downloadMutiple")
	public ResponseEntity<Resource> downloadPhotos(@RequestParam("pddOrderNumber") String orderNumber, @RequestParam String photos) throws IOException {

		if(StringUtils.isEmpty(photos)) {
			return ResponseEntity.notFound().build();
		}
		List<Integer> photoIds = Arrays.stream(photos.split(","))
				.map(part -> {
			 return Integer.valueOf(part);
		}).collect(Collectors.toList());

		List<PrintPhotoSummary> printPhotoSummaries = this.orderPictureMapper.queryPicturesOfOrder(orderNumber, "");
		ArrayList<PrintPhotoSummary> photosToDownload = new ArrayList<>();

		for(PrintPhotoSummary photoSummary : printPhotoSummaries) {
			for(Integer photoId : photoIds) {
				if(photoId.intValue() == photoSummary.getPictureId()) {
					photosToDownload.add(photoSummary);
					break;
				}
			}
		}

		if(photosToDownload.isEmpty()) {
			return ResponseEntity.notFound().build();
		}

		Path rootPath = Path.of(this.storageService.getRootDirPath());
		String firstImgPath = photosToDownload.get(0).getSrc();
		if(firstImgPath.startsWith("/")) {
			firstImgPath = firstImgPath.substring(1);
		}

		Path dirPath = rootPath.resolve(firstImgPath).getParent();
		Path tempDirPath = dirPath.resolve(dirPath.getFileName());

		tempDirPath.toFile().mkdirs();

		File [] fileList = tempDirPath.toFile().listFiles();
		for(File file : fileList) {
			file.delete();
		}

		File zipFile = new File(tempDirPath.toFile().getPath() + ".zip");
		zipFile.deleteOnExit();

		for(PrintPhotoSummary photoSummary : photosToDownload) {
			String relativePath = photoSummary.getSrc();
			if(relativePath.startsWith("/")) {
				relativePath = relativePath.substring(1);
			}
			Path srcPath = rootPath.resolve(relativePath);
			Path destPath = tempDirPath.resolve(srcPath.getFileName());
			Files.copy(srcPath, destPath);
		}

		zipFile = this.zipLibrary.zipItems(tempDirPath.toString());

		return ResponseEntity.ok()
				.contentLength(zipFile.length())
				.contentType(MediaType.APPLICATION_OCTET_STREAM)
				.header("Content-disposition", "attachment; filename="+ zipFile.getName())
				.body(new InputStreamResource(new FileInputStream(zipFile)));
	}
}
