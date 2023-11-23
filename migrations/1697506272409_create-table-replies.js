/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('(now() at time zone \'utc\')'),
    },
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'replies',
    'fk_replies_owner_id',
    `
    FOREIGN KEY
      (owner_id)
    REFERENCES
      users (id)
    ON DELETE CASCADE
    `,
  );
  pgm.addConstraint(
    'replies',
    'fk_reply_to',
    `
    FOREIGN KEY
      (comment_id)
    REFERENCES
      comments (id)
    ON DELETE CASCADE
    `,
  );
  pgm.addConstraint(
    'replies',
    'fk_replies_thread_id',
    `
    FOREIGN KEY
      (thread_id)
    REFERENCES
      threads (id)
    ON DELETE CASCADE
    `,
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(
    'replies',
    'fk_comments_owner_id',
    { ifExists: true },
  );
  pgm.dropConstraint(
    'replies',
    'fk_reply_to',
    { ifExists: true },
  );
  pgm.dropConstraint(
    'replies',
    'fk_comments_thread_id',
    { ifExists: true },
  );
  pgm.dropTable('replies', { ifExists: true });
};
