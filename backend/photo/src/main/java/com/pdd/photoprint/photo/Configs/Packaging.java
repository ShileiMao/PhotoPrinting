package com.pdd.photoprint.photo.Configs;


public enum Packaging {
    DEFAULT("default", "默认"),
    PLASTIC("plastic", "塑封"),
    SUEDE("suede", "绒面");


    private final String value;
    private final String description;


    Packaging(String value, String description) {
        this.value = value;
        this.description = description;
    }
    public String getValue() {
        return value;
    }

    public String getDescription() {
        return description;
    }

    public static Packaging toReadablePackaging(String value) {
        if(Packaging.DEFAULT.getValue().equals(value)) {
            return Packaging.DEFAULT;
        }

        if(Packaging.PLASTIC.getValue().equals(value)) {
            return Packaging.PLASTIC;
        }

        if(Packaging.SUEDE.getValue().equals(value)) {
            return Packaging.SUEDE;
        }

        return Packaging.DEFAULT;
    }
}
