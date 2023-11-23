const PostComment = require('../PostComment');

describe('a PostComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};
    const ownerdId = 'user-123';
    const threadId = 'thread-123';
    expect(() => new PostComment(ownerdId, threadId, payload)).toThrowError('POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 123,
    };
    const ownerId = true;
    const threadId = 'thread-123';

    expect(() => new PostComment(ownerId, threadId, payload)).toThrowError('POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when threadId length more than 50 character', () => {
    const threadId = 'thread-Lorem ipsum dolor sit amet, consectetur sed.';
    const ownerId = 'user-123';
    const payload = {
      content: 'Some body',
    };

    expect(() => new PostComment(ownerId, threadId, payload)).toThrowError('POST_COMMENT.THREAD_ID_LIMIT_CHAR');
  });

  it('should throw error when ownerId length more than 50 character', () => {
    const threadId = 'thread-123';
    const ownerId = 'user-Lorem ipsum dolor sit amet, consectetur velit.';
    const payload = {
      content: 'Some body',
    };

    expect(() => new PostComment(ownerId, threadId, payload)).toThrowError('POST_COMMENT.OWNER_ID_LIMIT_CHAR');
  });

  it('should create newComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'Some body',
    };

    const threadId = 'thread-123';
    const ownerId = 'user-123';
    // Action
    const newComment = new PostComment(ownerId, threadId, payload);

    // Assert
    expect(newComment.ownerId).toEqual(ownerId);
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.threadId).toEqual(threadId);
  });
});
