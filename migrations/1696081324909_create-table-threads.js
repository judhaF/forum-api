/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(64)',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('(now() at time zone \'utc\')'),
    },
    owner_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.addConstraint(
    'threads',
    'fk_threads_owner_id',
    `
    FOREIGN KEY
      (owner_id)
    REFERENCES
      users (id)
    ON DELETE CASCADE
    `,
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(
    'threads',
    'fk_threads_owner_id',
    { ifExists: true },
  );
  pgm.dropTable('threads', { ifExists: true });
};
