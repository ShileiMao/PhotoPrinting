package com.pdd.photoprint.photo.Storage;

public class StorageDuplicateFileException extends StorageException {
    public StorageDuplicateFileException(String message) {
        super(message);
    }

    public StorageDuplicateFileException(String message, Throwable cause) {
        super(message, cause);
    }
}
