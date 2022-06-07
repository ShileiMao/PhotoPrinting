--------- June 6th, 2022 -------
1. 照片上传自动压缩，创建预览图片:
ALTER TABLE `photo_name`.`pictures` 
ADD COLUMN `thumbnail` VARCHAR(400) NOT NULL AFTER `height`;

