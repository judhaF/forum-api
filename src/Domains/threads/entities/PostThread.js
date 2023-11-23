class PostThread {
  constructor(ownerId, payload) {
    this._verifyPayload(ownerId, payload);
    const { title, body } = payload;
    this.title = title;
    this.body = body;
    this.ownerId = ownerId;
  }

  _verifyPayload(ownerId, { title, body }) {
    if (!title || !body || !ownerId) {
      throw new Error('POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof title !== 'string' || typeof body !== 'string' || typeof ownerId !== 'string') {
      throw new Error('POST_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    if (title.length > 64) {
      throw new Error('POST_THREAD.TITLE_LIMIT_CHAR');
    }
  }
}

module.exports = PostThread;
