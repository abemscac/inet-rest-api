const query = Object.freeze({
  getByQuery: () => `
    SELECT \`articleId\`, \`userId\`, \`createdAt\`
    FROM \`articleLike\`
    WHERE \`articleId\` = @articleId AND \`userId\` = @userId
  `,
  create: () => `INSERT INTO \`articleLike\` SET ?`,
  deleteByQuery: () => `
    DELETE FROM \`articleLike\`
    WHERE \`articleId\` = @articleId AND \`userId\` = @userId
  `,
});

export default query;
