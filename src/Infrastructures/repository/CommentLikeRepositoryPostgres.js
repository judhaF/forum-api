const CommentLikeRepository = require('../../Domains/comment-likes/CommentLikeRepository');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async countLikes(commentId) {
    const query = {
      text: 'SELECT comment_id FROM comment_likes WHERE comment_id=$1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    return result.rowCount;
  }

  async likeComment(userId, commentId) {
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2)',
      values: [commentId, userId],
    };
    await this._pool.query(query);
  }

  async unlikeComment(userId, commentId) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };
    await this._pool.query(query);
  }

  async verifyAvailableId(userId, commentId) {
    const query = {
      text: 'SELECT comment_id FROM comment_likes WHERE comment_id=$1 AND user_id = $2',
      values: [commentId, userId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      return false;
    }
    return true;
  }
}

module.exports = CommentLikeRepositoryPostgres;
