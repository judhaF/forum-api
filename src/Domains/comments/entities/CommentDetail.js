class CommentDetail {
  constructor(payload) {
    this._validatePayload(payload);
    const {
      id, content, username, date, isDelete, likeCount,
    } = payload;
    this.id = id;
    this.content = isDelete ? '**komentar telah dihapus**' : content;
    this.username = username;
    this.date = date;
    this.likeCount = likeCount;
  }

  _validatePayload({
    id, content, isDelete, username, date, likeCount,
  }) {
    if (!id
      || !content
      || isDelete === undefined
      || !username
      || !date || likeCount === undefined) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof id !== 'string' || typeof content !== 'string' || typeof isDelete !== 'boolean' || typeof username !== 'string' || !(date instanceof Date) || !Number.isInteger(likeCount)) {
      throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentDetail;
