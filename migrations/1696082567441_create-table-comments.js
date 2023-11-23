/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('comments', {
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
    'comments',
    'fk_comments_owner_id',
    `
    FOREIGN KEY
      (owner_id)
    REFERENCES
      users (id)
    ON DELETE CASCADE
    `,
  );
  pgm.addConstraint(
    'comments',
    'fk_comments_thread_id',
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
    'comments',
    'fk_comments_owner_id',
    { ifExists: true },
  );
  pgm.dropConstraint(
    'comments',
    'fk_comments_thread_id',
    { ifExists: true },
  );
  pgm.dropTable('comments', { ifExists: true });
};
