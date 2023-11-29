const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const PostedReply = require('../../Domains/replies/entities/PostedReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const ReplyDetail = require('../../Domains/replies/entities/ReplyDetail');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyReplyOwner(ownerId, replyId, threadId, commentId) {
    const query = {
      text: 'SELECT owner_id, thread_id, comment_id FROM replies WHERE id=$1',
      values: [replyId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('reply tidak ditemukan');
    }
    if (result.rows[0].thread_id !== threadId) {
      throw new NotFoundError('reply dengan thread id tidak ditemukan');
    }
    if (result.rows[0].comment_id !== commentId) {
      throw new NotFoundError('reply dengan comment id tidak ditemukan');
    }
    if (result.rows[0].owner_id !== ownerId) {
      throw new AuthorizationError('tidak diizinkan menghapus comment');
    }
  }

  async replyComment(postReply) {
    const {
      threadId, content, ownerId, commentId,
    } = postReply;
    const id = `reply-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2,DEFAULT, $3, $4, $5, $6) RETURNING id, content, owner_id as "ownerId"',
      values: [id, content, false, commentId, threadId, ownerId],
    };
    const result = await this._pool.query(query);
    return new PostedReply({ ...result.rows[0] });
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `
      SELECT
        re.id as id,
        re.date as date,
        users.username as username,
        re.content as content,
        re.is_delete as "isDelete",
        re.comment_id as "commentId"
      FROM replies as re
      LEFT JOIN users ON users.id = re.owner_id
      WHERE re.thread_id=$1
      ORDER BY re.date ASC
        `,
      values: [threadId],
    };
    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      return [];
    }
    return result.rows.map((reply) => new ReplyDetail(reply));
  }

  async softDeleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete=TRUE WHERE id=$1',
      values: [replyId],
    };
    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
