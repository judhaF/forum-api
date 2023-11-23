class ReplyDetail {
  constructor(payload) {
    this._validatePayload(payload);
    const {
      id, content, username, date, commentId, isDelete,
    } = payload;
    this.id = id;
    this.content = isDelete ? '**balasan telah dihapus**' : content;
    this.username = username;
    this.commentId = commentId;
    this.date = date;
  }

  _validatePayload({
    id, content, isDelete, username, date, commentId,
  }) {
    if (!id || !content || isDelete === undefined || !username || !date || !commentId) {
      throw new Error('REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof id !== 'string' || typeof content !== 'string' || typeof commentId !== 'string' || typeof isDelete !== 'boolean' || typeof username !== 'string' || !(date instanceof Date)) {
      throw new Error('REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ReplyDetail;
