class CommentLikeUseCase {
  constructor({
    commentLikeRepository, commentRepository, threadRepository, userRepository,
  }) {
    this._commentLikeRepository = commentLikeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async likeComment(threadId, commentId, userId) {
    await this._threadRepository.verifyAvailableId(threadId);
    await this._commentRepository.verifyAvailableId(commentId);
    await this._userRepository.verifyAvailableId(userId);
    const liked = await this._commentLikeRepository.verifyAvailableId(userId, commentId);
    if (liked) {
      await this._commentLikeRepository.unlikeComment(userId, commentId);
    } else {
      await this._commentLikeRepository.likeComment(userId, commentId);
    }
  }
}

module.exports = CommentLikeUseCase;
