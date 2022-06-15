USE `inet`;

CREATE TABLE `user` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `username` VARCHAR(30) NOT NULL,
  `hashed_password` CHAR(60) NOT NULL,
  `name` NVARCHAR(50),
  `avatar_image_hash` VARCHAR(20),
  `avatar_image_ext` VARCHAR(5),
  `hashed_refresh_token` CHAR(60),
  `created_at` TIMESTAMP DEFAULT (UTC_TIMESTAMP) NOT NULL,
  `last_modified_at` TIMESTAMP,
  `removed_at` TIMESTAMP,
  `is_removed` TINYINT(1) DEFAULT 0 NOT NULL,
  PRIMARY KEY(`id`),
  UNIQUE(`username`)
);

CREATE TABLE `article_category` (
  `id` SMALLINT AUTO_INCREMENT NOT NULL,
  `code` VARCHAR(20) NOT NULL,
  `image_hash` VARCHAR(20) NOT NULL,
  `image_ext` VARCHAR(5) NOT NULL,
  `created_at` TIMESTAMP DEFAULT (UTC_TIMESTAMP) NOT NULL,
  PRIMARY KEY(`id`),
  UNIQUE(`code`)
);

CREATE TABLE `article` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `category_id` SMALLINT NOT NULL,
  `cover_image_hash` VARCHAR(20) NOT NULL,
  `cover_image_ext` VARCHAR(5) NOT NULL,
  `title` NVARCHAR(100) NOT NULL,
  `body` TEXT NOT NULL,
  `views` INT DEFAULT 0 NOT NULL,
  `author_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT (UTC_TIMESTAMP) NOT NULL,
  `last_modified_at` TIMESTAMP,
  `removed_at` TIMESTAMP,
  `is_removed` TINYINT(1) DEFAULT 0 NOT NULL,
  PRIMARY KEY(`id`),
  FOREIGN KEY(`category_id`) REFERENCES `article_category`(`id`) ON DELETE CASCADE,
  FOREIGN KEY(`author_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE `article_like` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `article_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT (UTC_TIMESTAMP) NOT NULL,
  PRIMARY KEY(`id`),
  UNIQUE(`article_id`, `user_id`),
  FOREIGN KEY(`article_id`) REFERENCES `article`(`id`) ON DELETE CASCADE,
  FOREIGN KEY(`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE `article_comment` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `article_id` INT NOT NULL,
  `author_id` INT NOT NULL,
  `body` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT (UTC_TIMESTAMP) NOT NULL,
  `removed_at` TIMESTAMP,
  `is_removed` TINYINT(1) DEFAULT 0 NOT NULL,
  PRIMARY KEY(`id`),
  FOREIGN KEY(`article_id`) REFERENCES `article`(`id`) ON DELETE CASCADE,
  FOREIGN KEY(`author_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE `article_sub_comment` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `parent_comment_id` INT NOT NULL,
  `author_id` INT NOT NULL,
  `body` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT (UTC_TIMESTAMP) NOT NULL,
  `removed_at` TIMESTAMP,
  `is_removed` TINYINT(1) DEFAULT 0 NOT NULL,
  PRIMARY KEY(`id`),
  FOREIGN KEY(`parent_comment_id`) REFERENCES `article_comment`(`id`) ON DELETE CASCADE,
  FOREIGN KEY(`author_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE `user_browse_history` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `user_id` INT NOT NULL,
  `article_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT (UTC_TIMESTAMP) NOT NULL,
  PRIMARY KEY(`id`),
  UNIQUE(`user_id`, `article_id`),
  FOREIGN KEY(`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  FOREIGN KEY(`article_id`) REFERENCES `article`(`id`) ON DELETE CASCADE
);

CREATE TABLE `collection` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `user_id` INT NOT NULL,
  `article_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT (UTC_TIMESTAMP) NOT NULL,
  PRIMARY KEY(`id`),
  UNIQUE(`user_id`, `article_id`),
  FOREIGN KEY(`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  FOREIGN KEY(`article_id`) REFERENCES `article`(`id`) ON DELETE CASCADE
);