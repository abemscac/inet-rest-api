USE `inet`;

DELETE FROM `article_comment`;
ALTER TABLE `article_comment` AUTO_INCREMENT = 1;

DELETE FROM `article_like`;

DELETE FROM `article`;
ALTER TABLE `article` AUTO_INCREMENT = 1;

DELETE FROM `article_category`;
ALTER TABLE `article_category` AUTO_INCREMENT = 1;

DELETE FROM `user_browse_history`;
ALTER TABLE `user_browse_history` AUTO_INCREMENT = 1;

DELETE FROM `user`;
ALTER TABLE `user` AUTO_INCREMENT = 1;
