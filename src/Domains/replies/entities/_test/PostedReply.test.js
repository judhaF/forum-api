const PostedReply = require('../PostedReply');

describe('a PostedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      ownerId: 'user-123',
    };

    expect(() => new PostedReply(payload)).toThrowError('POSTED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      ownerId: 'user-123',
      content: 123,
    };

    expect(() => new PostedReply(payload)).toThrowError('POSTED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when id more than 50 character', () => {
    let idPayload = 'comment-';
    const id = '1';
    for (let i = 0; i < 43; i += 1) {
      idPayload += id;
    }
    const payload = {
      id: idPayload,
      content: 'Some body',
      ownerId: 'user-123',
    };

    expect(() => new PostedReply(payload)).toThrowError('POSTED_REPLY.ID_LIMIT_CHAR');
  });
  it('should throw error when owner more than 50 character', () => {
    let ownerIdPayload = 'user-';
    const id = '1';
    for (let i = 0; i < 46; i += 1) {
      ownerIdPayload += id;
    }
    const payload = {
      id: 'comment-123',
      content: 'Some body',
      ownerId: ownerIdPayload,
    };

    expect(() => new PostedReply(payload)).toThrowError('POSTED_REPLY.OWNER_ID_LIMIT_CHAR');
  });
  it('should create postedReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      content: 'Some body',
      ownerId: 'user-123',
    };

    // Action
    const postedReply = new PostedReply(payload);

    // Assert
    expect(postedReply.owner).toEqual(payload.ownerId);
    expect(postedReply.content).toEqual(payload.content);
    expect(postedReply.id).toEqual(payload.id);
  });
});
