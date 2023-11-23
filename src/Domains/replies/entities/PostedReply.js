class PostedComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, content, ownerId,
    } = payload;
    this.id = id;
    this.content = content;
    this.owner = ownerId;
  }

  _verifyPayload({
    id, content, ownerId,
  }) {
    if (!id || !content || !ownerId) {
      throw new Error('POSTED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof id !== 'string' || typeof content !== 'string' || typeof ownerId !== 'string') {
      throw new Error('POSTED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    if (ownerId.length > 50) {
      throw new Error('POSTED_REPLY.OWNER_ID_LIMIT_CHAR');
    }
    if (id.length > 50) {
      throw new Error('POSTED_REPLY.ID_LIMIT_CHAR');
    }
  }
}
module.exports = PostedComment;
