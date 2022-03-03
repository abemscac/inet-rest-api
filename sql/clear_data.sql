USE `inet`;

DELETE FROM `articleComment`;
ALTER TABLE `articleComment` AUTO_INCREMENT = 1;

DELETE FROM `articleLike`;

DELETE FROM `article`;
ALTER TABLE `article` AUTO_INCREMENT = 1;

DELETE FROM `articleCategory`;
ALTER TABLE `articleCategory` AUTO_INCREMENT = 1;

DELETE FROM `user`;
ALTER TABLE `user` AUTO_INCREMENT = 1;
