const PostedComment = require('../PostedComment');

describe('a PostedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      ownerId: 'user-123',
    };

    expect(() => new PostedComment(payload)).toThrowError('POSTED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      ownerId: 321,
      content: 123,
    };

    expect(() => new PostedComment(payload)).toThrowError('POSTED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create postedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      content: 'Some body',
      ownerId: 'user-123',
    };

    // Action
    const postedComment = new PostedComment(payload);

    // Assert
    expect(postedComment.owner).toEqual(payload.ownerId);
    expect(postedComment.content).toEqual(payload.content);
    expect(postedComment.id).toEqual(payload.id);
  });
});
