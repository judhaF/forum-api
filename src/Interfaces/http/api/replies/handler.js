const autoBind = require('auto-bind');
const ReplyUseCase = require('../../../../Applications/use_case/ReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postCommentReplyHandler(request, h) {
    const { id: ownerId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const replyCommentUseCase = this._container.getInstance(ReplyUseCase.name);
    const addedReply = await replyCommentUseCase
      .replyComment(ownerId, threadId, request.payload, commentId);
    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async softDeleteCommentReplyHandler(request, h) {
    const { id: ownerId } = request.auth.credentials;
    const { threadId, commentId, replyId } = request.params;

    const softDeleteReplyUseCase = this._container.getInstance(ReplyUseCase.name);
    await softDeleteReplyUseCase.softDelete(replyId, ownerId, threadId, commentId);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
