class PostedThread {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, title, ownerId,
    } = payload;
    this.id = id;
    this.title = title;
    this.owner = ownerId;
  }

  _verifyPayload({
    id, title, ownerId,
  }) {
    if (!id || !title || !ownerId) {
      throw new Error('POSTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof id !== 'string' || typeof title !== 'string' || typeof ownerId !== 'string') {
      throw new Error('POSTED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    if (title.length > 64) {
      throw new Error('POSTED_THREAD.TITLE_LIMIT_CHAR');
    }
    if (id.length > 50) {
      throw new Error('POSTED_THREAD.ID_LIMIT_CHAR');
    }
  }
}
module.exports = PostedThread;
