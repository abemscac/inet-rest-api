USE `inet`;

CREATE TABLE `user`
(
    `id` INT AUTO_INCREMENT NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `password` CHAR(60) NOT NULL,
    `name` NVARCHAR(50),
    `avatar_url` VARCHAR(2000),
    `refresh_token_hash` CHAR(60),
    `created_at` TIMESTAMP DEFAULT (UTC_TIMESTAMP) NOT NULL,
    `last_modified_at` TIMESTAMP,
    `removed_at` TIMESTAMP,
    `is_removed` TINYINT(1) DEFAULT 0 NOT NULL,

    PRIMARY KEY(`id`),
    UNIQUE(`username`)
);

CREATE TABLE `article_category`
(
    `id` SMALLINT AUTO_INCREMENT NOT NULL,
	`code` VARCHAR(20) NOT NULL,
	`image_url` VARCHAR(2000) NOT NULL,
	`created_at` TIMESTAMP DEFAULT (UTC_TIMESTAMP) NOT NULL,
	
	PRIMARY KEY(`id`),
	UNIQUE(`code`)
);

CREATE TABLE `article`
(
    `id` INT AUTO_INCREMENT NOT NULL,
    `category_id` SMALLINT NOT NULL,
    `cover_image_url` VARCHAR(2000) NOT NULL,
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

CREATE TABLE `article_like`
(
    `article_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT (UTC_TIMESTAMP) NOT NULL,

    PRIMARY KEY(`article_id`, `user_id`),
    FOREIGN KEY(`article_id`) REFERENCES `article`(`id`) ON DELETE CASCADE,
    FOREIGN KEY(`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE `article_comment`
(
    `id` INT AUTO_INCREMENT NOT NULL,
    `article_id` INT NOT NULL,
    `author_id` INT NOT NULL,
    `body` NVARCHAR(500) NOT NULL,
    `created_at` TIMESTAMP DEFAULT (UTC_TIMESTAMP) NOT NULL,
    `removed_at` TIMESTAMP,
    `is_removed` TINYINT(1) DEFAULT 0 NOT NULL,

    PRIMARY KEY(`id`),
    FOREIGN KEY(`article_id`) REFERENCES `article`(`id`) ON DELETE CASCADE,
    FOREIGN KEY(`author_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE `user_browse_history`
(
    `id` INT AUTO_INCREMENT NOT NULL,
    `user_id` INT NOT NULL,
    `article_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT (UTC_TIMESTAMP) NOT NULL,

    PRIMARY KEY(`id`),
    UNIQUE(`user_id`, `article_id`),
    FOREIGN KEY(`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY(`article_id`) REFERENCES `article`(`id`) ON DELETE CASCADE
);