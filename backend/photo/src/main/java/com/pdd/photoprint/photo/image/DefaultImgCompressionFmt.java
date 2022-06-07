package com.pdd.photoprint.photo.image;

import org.apache.commons.imaging.Imaging;
import org.springframework.web.multipart.MultipartFile;

import java.awt.*;

public class DefaultImgCompressionFmt implements CompressionFmt {
    private int actWidth = 0;
    private int actHeight = 0;
    private float actCompression = 1;

    @Override
    public int width() {
        return actWidth;
    }

    @Override
    public int height() {
        return actHeight;
    }

    @Override
    public float compression() {
        return actCompression;
    }

    public DefaultImgCompressionFmt(Dimension dimension, float size) {
        int oriWidth = dimension.width;
        int oriHeight = dimension.height;

        this.actWidth = Math.min(oriWidth, 500);
        this.actHeight = Math.min((int)(this.actWidth * 1.0f / oriWidth * oriHeight), 500);
        this.actCompression = Math.min(0.7f, 400 * 1024 / size); // maximum 400kb

        System.out.printf("Compress image: (%d*%d), compression: %f\n", this.actWidth, this.actHeight, this.actCompression);
    }
}
