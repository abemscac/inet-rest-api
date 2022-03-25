USE `inet`;

-- users
INSERT INTO `user`
    (`username`, `hashed_password`, `name`, `avatar_image_hash`, `avatar_image_ext`)
VALUES
    ('user0', '$2a$10$ushVd/LnAQsV/7UrbAmzOOIScbMjWEYchllw8R9usFs0n6WLOeu4.', N'人類一號', 'MT0npFn', 'jpg');

INSERT INTO `user`
    (`username`, `hashed_password`, `name`, `avatar_image_hash`, `avatar_image_ext`)
VALUES
    ('user1', '$2a$10$LI0vyuzA/9FolRnRYLfV9eQ4b5VxDFHAzyH3CM5y.gzBMyeTLjTEC', N'普通狗', 'Q3NCNdy', 'jpg');

INSERT INTO `user`
    (`username`, `hashed_password`, `name`, `avatar_image_hash`, `avatar_image_ext`)
VALUES
    ('user2', '$2a$10$nBjgHeAa4HWAzgoqL8EWN.1ZatbQIcsvyZQIiz5cX/sVNiVakPhU2', NULL, NULL, NULL);

-- article_categories
INSERT INTO `article_category`
    (`code`, `image_hash`, `image_ext`)
VALUES
    ('chat', 'cnGUSeY', 'jpg');

INSERT INTO `article_category`
    (`code`, `image_hash`, `image_ext`)
VALUES
    ('animal', 'JR2xyV6', 'jpg');

INSERT INTO `article_category`
    (`code`, `image_hash`, `image_ext`)
VALUES
    ('food', 'VpthdjV', 'jpg');

INSERT INTO `article_category`
    (`code`, `image_hash`, `image_ext`)
VALUES
    ('programming', 'xMqW5bp', 'jpg');

INSERT INTO `article_category`
    (`code`, `image_hash`, `image_ext`)
VALUES
    ('sports', 's4PDhtL', 'jpg');
