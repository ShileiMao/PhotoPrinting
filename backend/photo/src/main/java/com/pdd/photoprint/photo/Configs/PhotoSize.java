package com.pdd.photoprint.photo.Configs;

public enum PhotoSize {
    DEFAULT("default", "默认"),
    THREE_INCH("3inch", "3寸"),
    FOUR_INCH("4inch", "4寸"),
    FIVE_INCH("5inch", "7寸"),
    SIX_INCH("6inch", "6寸"),
    SEVEN_INCH("7inch", "7寸");


    private final String value;
    private final String description;


    PhotoSize(String value, String description) {
        this.value = value;
        this.description = description;
    }
    public String getValue() {
        return value;
    }

    public String getDescription() {
        return description;
    }

    public static PhotoSize toRedableSize(String value) {
        if(PhotoSize.DEFAULT.getValue().equals(value)) {
            return PhotoSize.DEFAULT;
        }

        if(PhotoSize.THREE_INCH.getValue().equals(value)) {
            return PhotoSize.THREE_INCH;
        }

        if(PhotoSize.FOUR_INCH.getValue().equals(value)) {
            return PhotoSize.FOUR_INCH;
        }

        if(PhotoSize.FIVE_INCH.getValue().equals(value)) {
            return PhotoSize.FIVE_INCH;
        }

        if(PhotoSize.SEVEN_INCH.getValue().equals(value)) {
            return PhotoSize.SEVEN_INCH;
        }

        return PhotoSize.DEFAULT;
    }
}
