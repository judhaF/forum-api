const PostThread = require('../PostThread');

describe('a PostThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'some',
    };
    ownerId = 'user-123';
    expect(() => new PostThread(ownerId, payload)).toThrowError('POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      title: 'a',
      body: 123,
    };
    const ownerId = 'user-123';

    expect(() => new PostThread(ownerId, payload)).toThrowError('POST_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when title more than 64 character', () => {
    let titlePayload = 'a thread';
    for (let i = 0; i < 9; i += 1) {
      titlePayload += titlePayload;
    }
    const payload = {
      title: titlePayload,
      body: 'Some body',
    };
    const ownerId = 'user-1234';

    expect(() => new PostThread(ownerId, payload)).toThrowError('POST_THREAD.TITLE_LIMIT_CHAR');
  });
  it('should create registeredUser object correctly', () => {
    // Arrange
    const payload = {
      title: 'a title from afar',
      body: 'Someday, it\'ll all stops. And you won\'t even notice',
    };
    const ownerId = 'user-1234';

    // Action
    const newThread = new PostThread(ownerId, payload);

    // Assert
    expect(newThread.ownerId).toEqual(ownerId);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
  });
});
