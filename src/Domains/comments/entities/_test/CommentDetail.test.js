const CommentDetail = require('../CommentDetail');

describe('a CommentDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'isi',
      isDelete: false,
    };

    // Action & Assert
    expect(() => new CommentDetail(payload)).toThrowError('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 123,
      isDelete: 'salah',
      username: true,
      date: '2023',
    };

    // Action & Assert
    expect(() => new CommentDetail(payload)).toThrowError('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'sebuah komen',
      isDelete: false,
      username: 'dicoding',
      date: new Date(),
    };

    // Action
    const newComment = new CommentDetail(payload);

    // Assert
    expect(newComment.id).toEqual(payload.id);
    expect(newComment.username).toEqual(payload.username);
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.date).toEqual(payload.date);
  });
  it('should make newComment.contentto be **komentar telah dihapus** when isDelete is true', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'sebuah komen',
      isDelete: true,
      username: 'dicoding',
      date: new Date(),
    };

    // Action
    const newComment = new CommentDetail(payload);

    // Assert
    expect(newComment.id).toEqual(payload.id);
    expect(newComment.username).toEqual(payload.username);
    expect(newComment.content).toEqual('**komentar telah dihapus**');
    expect(newComment.date).toEqual(payload.date);
  });
});
