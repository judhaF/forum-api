const ThreadDetail = require('../ThreadDetail');

describe('a ThreadDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'some',
      title: 'a title',
    };
    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: true,
      title: 'title',
      body: 123,
      date: 32.2,
      username: 321,
    };
    const comments = 'not comment';

    expect(() => new ThreadDetail(payload, comments)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create threadDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'a title from afar',
      body: 'Someday, it\'ll all stops. And you won\'t even notice',
      date: new Date('2021-08-08T07:19:09.775Z'),
      username: 'dicoding',

    };
    const comments = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        replies: [],
        content: 'sebuah comment',
      },
    ];

    // Action
    const threadDetail = new ThreadDetail(payload, comments);

    // Assert
    expect(threadDetail.id).toEqual(payload.id);
    expect(threadDetail.title).toEqual(payload.title);
    expect(threadDetail.body).toEqual(payload.body);
    expect(threadDetail.date).toEqual(payload.date);
    expect(threadDetail.username).toEqual(payload.username);
    expect(threadDetail.comments).toEqual(comments);
    expect(threadDetail.comments[0].replies).toEqual(comments[0].replies);
  });
});
