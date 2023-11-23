const ReplyDetail = require('../ReplyDetail');

describe('a ReplyDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'isi',
      isDelete: false,
    };

    // Action & Assert
    expect(() => new ReplyDetail(payload)).toThrowError('REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 123,
      isDelete: 'salah',
      username: true,
      commentId: 123,
      date: '2023',
    };

    // Action & Assert
    expect(() => new ReplyDetail(payload)).toThrowError('REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah komen',
      isDelete: false,
      username: 'dicoding',
      commentId: 'comment-123',
      date: new Date(),
    };

    // Action
    const newReply = new ReplyDetail(payload);

    // Assert
    expect(newReply.id).toEqual(payload.id);
    expect(newReply.username).toEqual(payload.username);
    expect(newReply.content).toEqual(payload.content);
    expect(newReply.date).toEqual(payload.date);
    expect(newReply.commentId).toEqual(payload.commentId);
  });
  it('should make newReply.content to be **balasan telah dihapus** when isDelete is true', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah komen',
      isDelete: true,
      username: 'dicoding',
      commentId: 'comment-123',
      date: new Date(),
    };

    // Action
    const newReply = new ReplyDetail(payload);

    // Assert
    expect(newReply.id).toEqual(payload.id);
    expect(newReply.username).toEqual(payload.username);
    expect(newReply.content).toEqual('**balasan telah dihapus**');
    expect(newReply.date).toEqual(payload.date);
    expect(newReply.commentId).toEqual(payload.commentId);
  });
});
