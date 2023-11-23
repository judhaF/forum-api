class CommentLikeRepository {
  async findByUserIdAndCommentId(userId, commentId) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async likeComment(userId, commentId) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async unlikeComment(userId, commentId) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentLikeRepository;
