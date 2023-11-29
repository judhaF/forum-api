const CommentRepository = require('../../Domains/comments/CommentRepository');
const PostedComment = require('../../Domains/comments/entities/PostedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentDetail = require('../../Domains/comments/entities/CommentDetail');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(postComment) {
    const {
      threadId, content, ownerId,
    } = postComment;
    const id = `comment-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2,DEFAULT, $3,$4, $5) RETURNING id, content, owner_id as "ownerId"',
      values: [id, content, false, threadId, ownerId],
    };
    const result = await this._pool.query(query);
    return new PostedComment({ ...result.rows[0] });
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
      SELECT
        co.id as id,
        co.date as date,
        users.username as username,
        co.content as content,
        co.is_delete as "isDelete",
        COUNT(cl.comment_id)::int as "likeCount"
      FROM comments as co
      LEFT JOIN users ON users.id = co.owner_id
      LEFT JOIN comment_likes AS cl ON co.id = cl.comment_id
      WHERE co.thread_id=$1
      GROUP BY (co.id,co.date,users.username,co.content, co.is_delete)
      ORDER BY co.date ASC
        `,
      values: [threadId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      return [];
    }
    return result.rows.map((comment) => new CommentDetail(comment));
  }

  async verifyCommentOwner(ownerId, commentId, threadId) {
    const query = {
      text: 'SELECT owner_id, thread_id FROM comments WHERE id=$1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError('comment tidak ditemukan');
    }
    if (result.rows[0].thread_id !== threadId) {
      throw new NotFoundError('comment dengan thread id tidak ditemukan');
    }
    if (result.rows[0].owner_id !== ownerId) {
      throw new AuthorizationError('tidak diizinkan menghapus comment');
    }
  }

  async softDeleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete=TRUE WHERE id=$1',
      values: [commentId],
    };
    await this._pool.query(query);
  }

  async verifyAvailableId(threadId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id=$1',
      values: [threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread dengan id tersebut tidak ada');
    }
  }
}

module.exports = CommentRepositoryPostgres;
