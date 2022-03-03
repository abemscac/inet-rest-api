const getCommentSelect = `
  SELECT
    \`articleComment\`.\`id\`,
    \`user\`.\`id\` AS \`authorId\`,
    \`user\`.\`username\` AS \`authorUsername\`,
    \`user\`.\`name\` AS \`authorName\`,
    \`user\`.\`avatar\` AS \`authorAvatar\`,
    \`articleComment\`.\`body\`,
    \`articleComment\`.\`createdAt\`,
    \`articleComment\`.\`removedAt\`
  FROM \`articleComment\`
  JOIN \`user\`
  ON \`articleComment\`.\`authorId\` = \`user\`.\`id\``;

const query = Object.freeze({
  getByQuery: () => `
    ${getCommentSelect}
    WHERE \`articleComment\`.\`articleId\` = @articleId
    ORDER BY \`articleComment\`.\`id\` ASC
  `,
  create: () => ` INSERT INTO \`articleComment\` SET ?`,
  getById: () => `
    ${getCommentSelect}
    WHERE \`articleComment\`.\`id\` = @id
  `,
  removeById: () => `
    UPDATE \`articleComment\`
    SET \`removedAt\` = UTC_TIMESTAMP(), \`isRemoved\` = 1
    WHERE \`id\` = @id AND \`isRemoved\` = 0
  `,
  existsById: () => `
    SELECT COUNT(\`id\`)
    FROM \`articleComment\`
    WHERE \`articleComment\`.\`id\` = @id AND \`isRemoved\` = 0
  `,
});

export default query;
