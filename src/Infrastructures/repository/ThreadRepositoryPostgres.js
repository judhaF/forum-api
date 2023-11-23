const PostedThread = require('../../Domains/threads/entities/PostedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(postThread) {
    const { title, body, ownerId } = postThread;
    const id = `thread-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, DEFAULT, $4) RETURNING id, title, owner_id as "ownerId"',
      values: [id, title, body, ownerId],
    };
    const result = await this._pool.query(query);
    return new PostedThread({ ...result.rows[0] });
  }

  async getThreadById(threadId) {
    const query = {
      text:
      `
      SELECT
        threads.id,
        threads.title,
        threads.body,
        threads.date,
        users.username
      FROM
        threads
      LEFT JOIN
        users
      ON users.id = threads.owner_id
      WHERE
        threads.id = $1
      `,
      values: [threadId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    return result.rows[0];
  }

  async verifyAvailableId(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id=$1',
      values: [threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread dengan id tersebut tidak ada');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
