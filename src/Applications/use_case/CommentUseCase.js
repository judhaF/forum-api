const PostComment = require('../../Domains/comments/entities/PostComment');

class CommentUseCase {
  constructor({ commentRepository, threadRepository, userRepository }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async postComment(ownerId, threadId, useCasePayload) {
    await this._userRepository.verifyAvailableId(ownerId);
    await this._threadRepository.verifyAvailableId(threadId);
    const postComment = new PostComment(ownerId, threadId, useCasePayload);
    return this._commentRepository.addComment(postComment);
  }

  async softDelete(commentId, ownerId, threadId, replyId = null) {
    this._validateDeletePayload(commentId, ownerId, threadId);
    await this._commentRepository.verifyCommentOwner(ownerId, commentId, threadId, replyId);
    await this._commentRepository.softDeleteComment(commentId);
  }

  _validateDeletePayload(commentId, ownerId, threadId) {
    if (typeof commentId !== 'string' || typeof ownerId !== 'string' || typeof threadId !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentUseCase;
