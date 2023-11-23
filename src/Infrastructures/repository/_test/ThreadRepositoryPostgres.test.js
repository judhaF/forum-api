const { DatabaseError } = require('pg');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const PostedThread = require('../../../Domains/threads/entities/PostedThread');
const PostThread = require('../../../Domains/threads/entities/PostThread');

const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ReplysTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should throw DatabaseError when user id did not exist', async () => {
      const postThread = new PostThread('user-123', {
        title: 'dicoding',
        body: 'a body',
      });
      const fakeIdGenerator = () => 'thread-123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Assert
      await expect(threadRepositoryPostgres.addThread(postThread)).rejects.toThrow(DatabaseError);
    });
    it('should persist post thread and return posted thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const postThread = new PostThread('user-123', {
        title: 'dicoding',
        body: 'a body',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(postThread);

      // Assert
      const users = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(users).toHaveLength(1);
    });

    it('should return posted thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const postThread = new PostThread('user-123', {
        title: 'dicoding',
        body: 'a body',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const postedThread = await threadRepositoryPostgres.addThread(postThread);

      // Assert
      expect(postedThread).toStrictEqual(new PostedThread({
        id: 'thread-123',
        title: 'dicoding',
        ownerId: 'user-123',
      }));
    });
  });
  describe('getThreadById function', () => {
    it('should persist thread detail', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const threadId = 'thread-123';

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(threadId);

      // Assert
      expect(thread).toBeInstanceOf(Object);
    });
    it('should return thread detail correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const threadId = 'thread-123';

      // Action
      const thread = await threadRepositoryPostgres.getThreadById(threadId);
      // Assert
      expect(thread.id).toEqual(threadId);
      expect(thread.title).toEqual('title');
      expect(thread.body).toEqual('body');
      expect(thread.username).toEqual('dicoding');
    });

    it('should throw not found error when thread not exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const threadId = 'thread-123';

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById(threadId))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('verifyAvailableId function', () => {
    it('should throw NotFoundError when threadId did not exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const threadId = 'thread-345';

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableId(threadId))
        .rejects.toThrow(NotFoundError);
    });
    it('should not throw NotFoundError when threadId did exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const threadId = 'thread-123';

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableId(threadId))
        .resolves.not.toThrow(NotFoundError);
    });
  });
});
