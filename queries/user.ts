const getUserSelect = `
  SELECT
    \`id\`,
    \`username\`,
    \`password\`,
    \`name\`,
    \`avatar\`,
    \`createdAt\`,
    \`lastModifiedAt\`
  FROM \`user\``;

const query = Object.freeze({
  existsById: () => `
    SELECT COUNT(\`id\`)
    FROM \`user\`
    WHERE \`id\` = @id AND \`isRemoved\` = 0
  `,
  existsByUsername: () => `
    SELECT COUNT(\`id\`)
    FROM \`user\`
    WHERE \`username\` = @username
  `,
  getByUsername: () => `
    ${getUserSelect}
    WHERE \`username\` = @username AND \`isRemoved\` = 0
  `,
  getById: () => `
    ${getUserSelect}
    WHERE \`id\` = @id AND \`isRemoved\` = 0
  `,
  create: () => `INSERT INTO \`user\` SET ?`,
  updateById: () => `
    UPDATE \`user\`
    SET
      \`name\` = @name,
      \`avatar\` = @avatar,
      \`lastModifiedAt\` = UTC_TIMESTAMP()
    WHERE \`id\` = @id AND \`isRemoved\` = 0
  `,
  updatePasswordById: () => `
    UPDATE \`user\`
    SET
      \`password\` = @password,
      \`lastModifiedAt\` = UTC_TIMESTAMP()
    WHERE \`id\` = @id AND \`isRemoved\` = 0
  `,
  removeById: () => `
    UPDATE \`user\`
    SET \`removedAt\` = UTC_TIMESTAMP(), \`isRemoved\` = 1
    WHERE \`id\` = @id AND \`isRemoved\` = 0
  `,
});

export default query;
