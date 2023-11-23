const PostReply = require('../../Domains/replies/entities/PostReply');

class ReplyUseCase {
  constructor({
    replyRepository, commentRepository, threadRepository, userRepository,
  }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async replyComment(ownerId, threadId, useCasePayload, commentId) {
    await this._userRepository.verifyAvailableId(ownerId);
    await this._threadRepository.verifyAvailableId(threadId);
    await this._commentRepository.verifyAvailableId(commentId);

    const postComment = new PostReply(ownerId, threadId, useCasePayload, commentId);

    return this._replyRepository.replyComment(postComment);
  }

  async softDelete(replyId, ownerId, threadId, commentId) {
    this._validateDeletePayload(commentId, ownerId, threadId);
    await this._replyRepository.verifyReplyOwner(ownerId, replyId, threadId, commentId);
    await this._replyRepository.softDeleteReply(replyId);
  }

  _validateDeletePayload(commentId, ownerId, threadId) {
    if (typeof commentId !== 'string' || typeof ownerId !== 'string' || typeof threadId !== 'string') {
      throw new Error('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
module.exports = ReplyUseCase;
