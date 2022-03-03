USE `inet`;

CREATE TABLE `user`
(
    `id` INT AUTO_INCREMENT NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `password` CHAR(60) NOT NULL,
    `name` NVARCHAR(50),
    `avatar` VARCHAR(2000),
    `createdAt` TIMESTAMP DEFAULT (UTC_TIMESTAMP) NOT NULL,
    `lastModifiedAt` TIMESTAMP,
    `removedAt` TIMESTAMP,
    `isRemoved` BIT DEFAULT 0 NOT NULL,

    PRIMARY KEY(`id`),
    UNIQUE(`username`)
);

CREATE TABLE `articleCategory`
(
    `id` SMALLINT AUTO_INCREMENT NOT NULL,
	`code` VARCHAR(20) NOT NULL,
	`icon` VARCHAR(20) NOT NULL,
	`index` SMALLINT NOT NULL,
	`createdAt` TIMESTAMP DEFAULT (UTC_TIMESTAMP) NOT NULL,
	`removedAt`TIMESTAMP,
	`isRemoved` BIT DEFAULT 0 NOT NULL,
	
	PRIMARY KEY(`id`),
	UNIQUE(`code`),
    UNIQUE(`icon`),
	UNIQUE(`index`)
);

CREATE TABLE `article`
(
    `id` INT AUTO_INCREMENT NOT NULL,
    `categoryId` SMALLINT NOT NULL,
    `coverImage` VARCHAR(2000) NOT NULL,
    `title` NVARCHAR(100) NOT NULL,
    `body` TEXT NOT NULL,
    `views` INT DEFAULT 0 NOT NULL,
    `authorId` INT NOT NULL,
    `createdAt` TIMESTAMP DEFAULT (UTC_TIMESTAMP) NOT NULL,
    `lastModifiedAt` TIMESTAMP,
    `removedAt` TIMESTAMP,
    `isRemoved` BIT DEFAULT 0 NOT NULL,

    PRIMARY KEY(`id`),
    FOREIGN KEY(`categoryId`) REFERENCES `articleCategory`(`id`),
    FOREIGN KEY(`authorId`) REFERENCES `user`(`id`)
);

CREATE TABLE `articleLike`
(
    `articleId` INT NOT NULL,
    `userId` INT NOT NULL,
    `createdAt` TIMESTAMP DEFAULT (UTC_TIMESTAMP) NOT NULL,

    PRIMARY KEY(`articleId`, `userId`),
    FOREIGN KEY(`articleId`) REFERENCES `article`(`id`),
    FOREIGN KEY(`userId`) REFERENCES `user`(`id`)
);

CREATE TABLE `articleComment`
(
    `id` INT AUTO_INCREMENT NOT NULL,
    `articleId` INT NOT NULL,
    `authorId` INT NOT NULL,
    `body` NVARCHAR(500) NOT NULL,
    `createdAt` TIMESTAMP DEFAULT (UTC_TIMESTAMP) NOT NULL,
    `removedAt` TIMESTAMP,
    `isRemoved` BIT DEFAULT 0 NOT NULL,

    PRIMARY KEY(`id`),
    FOREIGN KEY(`articleId`) REFERENCES `article`(`id`),
    FOREIGN KEY(`authorId`) REFERENCES `user`(`id`)
);