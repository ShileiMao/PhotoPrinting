package com.pdd.photoprint.photo.Utils;

import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Component
public class ZipLibrary {
    public File zipItems(String path) throws IOException {
        File file = new File(path);

        if(file.exists() && file.isFile()) {
            String fileName = file.getName() + ".zip";
            File zipFile = new File(file.getParent() + File.separator + fileName);
            ZipOutputStream zipOutputStream = new ZipOutputStream(new FileOutputStream(zipFile));
            ZipEntry zipEntry = new ZipEntry(file.getName());
            zipOutputStream.putNextEntry(zipEntry);
            Files.copy(file.toPath(), zipOutputStream);

            zipOutputStream.closeEntry();
            zipOutputStream.close();

            return zipFile;
        }

        if(file.exists() && file.isDirectory()) {
            File[] fileArr = file.listFiles();
            if(fileArr == null || fileArr.length == 0) {
                System.out.println("No file under folder: " + file.getPath());
                return null;
            }

            String fileName = file.getName() + ".zip";
            File zipfile = new File(file.getParent() + File.separator + fileName);
            ZipOutputStream zipOut = new ZipOutputStream(new FileOutputStream(zipfile));

            Path sourceDir = Path.of(file.getPath());
            Files.walkFileTree(sourceDir, new SimpleFileVisitor<Path>(){
                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attributes) {
                    try {
                        Path targetFile = sourceDir.relativize(file);
                        zipOut.putNextEntry(new ZipEntry(targetFile.toString()));

                        byte[] bytes = Files.readAllBytes(file);
                        zipOut.write(bytes,0, bytes.length);
                        zipOut.closeEntry();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    return FileVisitResult.CONTINUE;
                }
            });

            zipOut.close();

            return zipfile;
        }

        System.out.println("file not exists or something goes wrong!");
        return null;
    }
}
