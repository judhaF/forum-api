const autoBind = require('auto-bind');
const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postCommentHandler(request, h) {
    const { id: ownerId } = request.auth.credentials;
    const { threadId } = request.params;

    const postCommentUseCase = this._container.getInstance(CommentUseCase.name);
    const addedComment = await postCommentUseCase.postComment(ownerId, threadId, request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async softDeleteCommentHandler(request, h) {
    const { id: ownerId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const softDeleteCommentUseCase = this._container.getInstance(CommentUseCase.name);
    await softDeleteCommentUseCase.softDelete(commentId, ownerId, threadId);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
