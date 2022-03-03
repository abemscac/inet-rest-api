const getArticleSelect = `
  SELECT
    \`article\`.\`id\`,
    \`articleCategory\`.\`code\` AS \`categoryCode\`
    \`article\`.\`coverImage\`,
    \`article\`.\`title\`,
    \`article\`.\`body\`,
    \`article\`.\`views\`,
    \`articleLikes\`.\`likes\`,
    \`article\`.\`createdAt\`,
    \`article\`.\`lastModifiedAt\`,
    \`article\`.\`authorId\`,
    \`user\`.\`id\` AS \`authorId\`,
    \`user\`.\`username\` AS \`authorUsername\`,
    \`user\`.\`name\` AS \`authorName\`,
    \`user\`.\`avatar\` AS \`authorAvatar\`
  FROM \`article\`
  JOIN \`articleCategory\`
  ON \`article\`.\`categoryId\` = \`articleCategory\`.\`id\`
  JOIN \`user\`
  ON \`article\`.\`authorId\` = \`user\`.\`id\`
  JOIN (
    SELECT
      \`article\`.\`id\` AS \`articleId\`,
      COUNT(\`articleLike\`.\`userId\`) AS \`likes\`
    FROM \`article\`
    LEFT JOIN \`articleLike\`
    ON \`article\`.\`id\` = \`articleLike\`.\`articleId\`
    GROUP BY \`article\`.\`id\`
  ) AS \`articleLikes\`
  ON \`article\`.\`id\` = \`articleLikes\`.\`articleId\``;

const query = Object.freeze({
  getById: () => `
    ${getArticleSelect}
    WHERE \`article\`.\`id\` = @id AND \`article\`.\`isRemoved\` = 0
  `,
  existsById: () => `
    SELECT COUNT(\`id\`)
    FROM \`article\`
    WHERE \`article\`.\`id\` = @id AND \`article\`.\`isRemoved\` = 0
  `,
  incrementViewsById: () => `
    UPDATE \`article\`
    SET \`views\` = \`views\` + 1
    WHERE \`id\` = @id
  `,
  getByQuery: () => `
    ${getArticleSelect}
    WHERE (
      CASE
        WHEN @cursor = 0 THEN 1
        WHEN \`article\`.\`id\` < @cursor THEN 1
        ELSE 0
      END
    ) = 1 AND \`article\`.\`isRemoved\` = 0
    ORDER BY \`article\`.\`id\` DESC
    OFFSET @offset ROWS
    FETCH NEXT @limit ROWS ONLY
  `,
  create: () => `INSERT INTO \`article\` SET ?`,
  updateById: () => `
    UPDATE \`article\`
    SET
      \`coverImage\` = @coverImage,
      \`title\` = @title,
      \`body\` = @body,
      \`lastModifiedAt\` = UTC_TIMESTAMP()
    WHERE \`id\` = @id AND \`isRemoved\` = 0
  `,
  removeById: () => `
    UPDATE \`article\`
    SET \`removedAt\` = UTC_TIMESTAMP(), \`isRemoved\` = 1
    WHERE \`id\` = @id AND \`isRemoved\` = 0
  `,
});

export default query;
