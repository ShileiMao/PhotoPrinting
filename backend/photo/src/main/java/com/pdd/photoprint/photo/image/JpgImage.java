package com.pdd.photoprint.photo.image;

import org.imgscalr.Scalr;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.FileImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Iterator;
import java.util.NoSuchElementException;

public class JpgImage {
    public static final String FILE_EXT = "jpg";

    private final File sourceFile;

    private final CompressionFmt compressionFmt;


    public JpgImage(File sourceFile, CompressionFmt compressionFmt) {
        this.sourceFile = sourceFile;
        this.compressionFmt = compressionFmt;
    }

    public void compressTo(File target) throws IOException {
        FileImageOutputStream targetFileOut = new FileImageOutputStream(target);
        BufferedImage resizedImage = resize(sourceFile);

        ImageWriter imageWriter = getWriter();
        ImageWriteParam param = getWriterSettings(imageWriter);

        try {
            imageWriter.setOutput(targetFileOut);
            imageWriter.write(null, new IIOImage(resizedImage, null, null), param);
        } finally {
            imageWriter.dispose();
            targetFileOut.close();
            resizedImage.flush();
        }
    }

    private BufferedImage resize(File imageFile) throws IOException {
        BufferedImage image = ImageIO.read(imageFile);

        return Scalr.resize(image, Scalr.Mode.AUTOMATIC, compressionFmt.width(), compressionFmt.height());
    }

    private ImageWriter getWriter() {
        Iterator<ImageWriter> imageWriterIterator = ImageIO.getImageWritersByFormatName(FILE_EXT);

        if(!imageWriterIterator.hasNext()) {
            throw new NoSuchElementException(
                    String.format("Could not find image writer for format: %s", FILE_EXT)
            );
        }
        return imageWriterIterator.next();
    }

    private ImageWriteParam getWriterSettings(ImageWriter imageWriter) {
        ImageWriteParam imageWriteParam = imageWriter.getDefaultWriteParam();
        imageWriteParam.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
        imageWriteParam.setCompressionQuality(compressionFmt.compression());

        return imageWriteParam;
    }
}
