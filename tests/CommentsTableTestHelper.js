/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', content = 'content', ownerId = 'user-123', threadId = 'thread-123', commentId = null,
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, DEFAULT, FALSE, $3, $4)',
      values: [id, content, threadId, ownerId],
    };

    await pool.query(query);
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
