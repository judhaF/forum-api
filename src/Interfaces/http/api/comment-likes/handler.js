const autoBind = require('auto-bind');
const CommentLikeUseCase = require('../../../../Applications/use_case/CommentLikeUseCase');

class CommentLikesHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async likeCommentHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const likeCommentUseCase = this._container.getInstance(CommentLikeUseCase.name);
    await likeCommentUseCase.likeComment(threadId, commentId, userId);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentLikesHandler;
