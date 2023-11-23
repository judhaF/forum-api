const PostedThread = require('../PostedThread');

describe('a PostedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'some',
    };

    expect(() => new PostedThread(payload)).toThrowError('POSTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'sda',
      title: 'a',
      ownerId: 123,
    };

    expect(() => new PostedThread(payload)).toThrowError('POSTED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when title more than 64 character', () => {
    let titlePayload = 'a thread';
    for (let i = 0; i < 9; i += 1) {
      titlePayload += titlePayload;
    }
    const payload = {
      id: 'thread-1234',
      title: titlePayload,
      ownerId: 'user-1234',
    };

    expect(() => new PostedThread(payload)).toThrowError('POSTED_THREAD.TITLE_LIMIT_CHAR');
  });

  it('should throw error when id more than 50 character', () => {
    let idPayload = 'thread-';
    const number = '1';
    for (let i = 0; i < 44; i += 1) {
      idPayload += number;
    }
    const payload = {
      id: idPayload,
      title: 'Some title',
      ownerId: 'user-1234',
    };

    expect(() => new PostedThread(payload)).toThrowError('POSTED_THREAD.ID_LIMIT_CHAR');
  });

  it('should create postedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-1234',
      ownerId: 'user-1234',
      title: 'a title from afar',
    };

    // Action
    const thread = new PostedThread(payload);

    // Assert
    expect(thread.owner).toEqual(payload.ownerId);
    expect(thread.title).toEqual(payload.title);
    expect(thread.id).toEqual(payload.id);
  });
});
