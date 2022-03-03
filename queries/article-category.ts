const query = Object.freeze({
  getAll: () => `
    SELECT \`id\`, \`code\`, \`icon\`, \`createdAt\`
    FROM \`articleCategory\`
    WHERE \`isRemoved\` = 0
    ORDER BY \`index\` ASC
  `,
});

export default query;
