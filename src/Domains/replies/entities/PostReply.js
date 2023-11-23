class PostReply {
  constructor(ownerId, threadId, payload, commentId) {
    this._verifyPayload(ownerId, threadId, payload, commentId);
    const { content } = payload;
    this.threadId = threadId;
    this.content = content;
    this.ownerId = ownerId;
    this.commentId = commentId;
  }

  _verifyPayload(ownerId, threadId, { content }, commentId) {
    if (!content || !threadId || !ownerId || !commentId) {
      throw new Error('POST_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof ownerId !== 'string' || typeof commentId !== 'string') {
      throw new Error('POST_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    if (commentId.length > 50) {
      throw new Error('POST_REPLY.COMMENT_ID_LIMIT_CHAR');
    }
    if (threadId.length > 50) {
      throw new Error('POST_REPLY.THREAD_ID_LIMIT_CHAR');
    }
    if (ownerId.length > 50) {
      throw new Error('POST_REPLY.OWNER_ID_LIMIT_CHAR');
    }
  }
}

module.exports = PostReply;
