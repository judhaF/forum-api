const PostReply = require('../PostReply');

describe('a PostReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};
    const ownerdId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    expect(() => new PostReply(ownerdId, threadId, payload, commentId)).toThrowError('POST_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 123,
    };
    const commentId = 'comment-123';
    const ownerId = 'user-123';
    const threadId = 'thread-123';

    expect(() => new PostReply(ownerId, threadId, payload, commentId)).toThrowError('POST_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when threadId did not meet data type specification', () => {
    const payload = {
      content: 'content',
    };
    const commentId = 'comment-123';
    const ownerId = 'user-123';
    const threadId = 123;

    expect(() => new PostReply(ownerId, threadId, payload, commentId)).toThrowError('POST_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when commentId did not meet data type specification', () => {
    const payload = {
      content: 'content',
    };
    const commentId = true;
    const ownerId = 'user-123';
    const threadId = 'thread-123';

    expect(() => new PostReply(ownerId, threadId, payload, commentId)).toThrowError('POST_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when ownerId did not meet data type specification', () => {
    const payload = {
      content: 'content',
    };
    const ownerId = 32.2;
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    expect(() => new PostReply(ownerId, threadId, payload, commentId)).toThrowError('POST_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when threadId more than 50 character', () => {
    let threadIdPayload = 'thread-';
    const id = '1';
    for (let i = 0; i < 44; i += 1) {
      threadIdPayload += id;
    }
    const threadId = threadIdPayload;
    const ownerId = 'user-123';
    const commentId = 'comment-123';
    const payload = {
      content: 'Some body',
    };

    expect(() => new PostReply(ownerId, threadId, payload, commentId)).toThrowError('POST_REPLY.THREAD_ID_LIMIT_CHAR');
  });
  it('should throw error when commentId more than 50 character', () => {
    let commentIdPayload = 'comment-';
    const id = '1';
    for (let i = 0; i < 43; i += 1) {
      commentIdPayload += id;
    }
    const threadId = 'thread-123';
    const ownerId = 'user-123';
    const commentId = commentIdPayload;
    const payload = {
      content: 'Some body',
    };

    expect(() => new PostReply(ownerId, threadId, payload, commentId)).toThrowError('POST_REPLY.COMMENT_ID_LIMIT_CHAR');
  });

  it('should throw error when ownerId more than 50 character', () => {
    let ownerIdPayload = 'user-';
    const id = '1';
    for (let i = 0; i < 46; i += 1) {
      ownerIdPayload += id;
    }
    const threadId = 'thread-123';
    const ownerId = ownerIdPayload;
    const commentId = 'comment-123';
    const payload = {
      content: 'Some body',
    };

    expect(() => new PostReply(ownerId, threadId, payload, commentId)).toThrowError('POST_REPLY.OWNER_ID_LIMIT_CHAR');
  });

  it('should create newReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'Some body',
    };

    const threadId = 'thread-123';
    const ownerId = 'user-123';
    const commentId = 'comment-123';
    // Action
    const newReply = new PostReply(ownerId, threadId, payload, commentId);

    // Assert
    expect(newReply.ownerId).toEqual(ownerId);
    expect(newReply.content).toEqual(payload.content);
    expect(newReply.threadId).toEqual(threadId);
    expect(newReply.commentId).toEqual(commentId);
  });
});
