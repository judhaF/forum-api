class PostComment {
  constructor(ownerId, threadId, payload) {
    this._verifyPayload(ownerId, threadId, payload);
    const { content } = payload;
    this.threadId = threadId;
    this.content = content;
    this.ownerId = ownerId;
  }

  _verifyPayload(ownerId, threadId, { content }) {
    if (!content || !threadId || !ownerId) {
      throw new Error('POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof ownerId !== 'string') {
      throw new Error('POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    if (threadId.length > 50) {
      throw new Error('POST_COMMENT.THREAD_ID_LIMIT_CHAR');
    }
    if (ownerId.length > 50) {
      throw new Error('POST_COMMENT.OWNER_ID_LIMIT_CHAR');
    }
  }
}

module.exports = PostComment;
