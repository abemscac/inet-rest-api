USE `inet`;

-- users
INSERT INTO `user`
    (`username`, `password`, `name`, `avatar_image_hash`)
VALUES
    ('user0', '$2a$10$ushVd/LnAQsV/7UrbAmzOOIScbMjWEYchllw8R9usFs0n6WLOeu4.', N'人類一號', 'MT0npFn');

INSERT INTO `user`
    (`username`, `password`, `name`, `avatar_image_hash`)
VALUES
    ('user1', '$2a$10$LI0vyuzA/9FolRnRYLfV9eQ4b5VxDFHAzyH3CM5y.gzBMyeTLjTEC', N'普通狗', 'Q3NCNdy');

INSERT INTO `user`
    (`username`, `password`, `name`, `avatar_image_hash`)
VALUES
    ('user2', '$2a$10$nBjgHeAa4HWAzgoqL8EWN.1ZatbQIcsvyZQIiz5cX/sVNiVakPhU2', NULL, NULL);

-- article_categories
INSERT INTO `article_category`
    (`code`, `image_hash`)
VALUES
    ('chat', 'cnGUSeY');

INSERT INTO `article_category`
    (`code`, `image_hash`)
VALUES
    ('animal', 'JR2xyV6');

INSERT INTO `article_category`
    (`code`, `image_hash`)
VALUES
    ('food', 'VpthdjV');

INSERT INTO `article_category`
    (`code`, `image_hash`)
VALUES
    ('programming', 'xMqW5bp');

INSERT INTO `article_category`
    (`code`, `image_hash`)
VALUES
    ('sports', 's4PDhtL');
