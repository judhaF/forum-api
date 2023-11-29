/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('comment_likes', {
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'comment_likes',
    'fk_comment_likes_comment_id',
    `
    FOREIGN KEY
      (comment_id)
    REFERENCES
      comments (id)
    ON DELETE CASCADE
    `,
  );
  pgm.addConstraint(
    'comment_likes',
    'fk_comment_likes_user_id',
    `
    FOREIGN KEY
      (user_id)
    REFERENCES
      users (id)
    ON DELETE CASCADE
    `,
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(
    'comment_likes',
    'fk_comment_likes_comment_id',
    { ifExists: true },
  );
  pgm.dropConstraint(
    'comment_likes',
    'fk_comment_likes_user_id',
    { ifExists: true },
  );
  pgm.dropTable('comment_likes', { ifExists: true });
};
