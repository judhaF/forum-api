/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ReplysTableTestHelper = {
  async addReply({
    id = 'reply-123', content = 'content', ownerId = 'user-123', threadId = 'thread-123', commentId = 'comment-123',
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, DEFAULT, FALSE, $3, $4, $5)',
      values: [id, content, commentId, threadId, ownerId],
    };

    await pool.query(query);
  },

  async findReplysById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = ReplysTableTestHelper;
