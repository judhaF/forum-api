const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const PostReply = require('../../../Domains/replies/entities/PostReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const PostedReply = require('../../../Domains/replies/entities/PostedReply');
const ReplyDetail = require('../../../Domains/replies/entities/ReplyDetail');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('replyComment function', () => {
    it('should persist posted reply', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const payload = {
        content: 'content',
      };
      const postReply = new PostReply('user-123', 'thread-123', payload, 'comment-123');
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.replyComment(postReply);

      // Assert
      const comments = await RepliesTableTestHelper.findReplysById('reply-123');
      expect(comments).toHaveLength(1);
    });

    it('should return posted reply correctly', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const payload = {
        content: 'content',
      };
      const postReply = new PostReply('user-123', 'thread-123', payload, 'comment-123');
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const postedThread = await replyRepositoryPostgres.replyComment(postReply);

      // Assert
      expect(postedThread).toStrictEqual(new PostedReply({
        id: 'reply-123',
        content: payload.content,
        ownerId: 'user-123',
      }));
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw NotFoundError when thread id not match', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const ownerId = 'user-123';
      const threadId = 'thread-345';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(ownerId, replyId, threadId, commentId))
        .rejects.toThrow(NotFoundError);
    });
    it('should throw NotFoundError when comment id not match', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const ownerId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-345';
      const replyId = 'reply-123';

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(ownerId, replyId, threadId, commentId))
        .rejects.toThrow(NotFoundError);
    });
    it('should throw NotFoundError when reply id not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const ownerId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-345';

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(ownerId, replyId, threadId, commentId))
        .rejects.toThrow(NotFoundError);
    });
    it('should throw AuthorizationError when owner id not match', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const ownerId = 'user-345';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner(ownerId, replyId, threadId, commentId))
        .rejects.toThrow(AuthorizationError);
    });
    it('should not throw error when the reply exist and an owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('user-123', 'reply-123', 'thread-123', 'comment-123'))
        .resolves.not.toThrowError();
    });
  });

  describe('softDeleteReply function', () => {
    it('should throw NotFoundError when comment not found', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Assert
      await expect(replyRepositoryPostgres.softDeleteReply('reply-345'))
        .resolves.not.toThrow(NotFoundError);
    });
    it('should mark comment as delete', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      const replyId = 'reply-123';

      // Action
      await replyRepositoryPostgres.softDeleteReply(replyId);
      const reply = await RepliesTableTestHelper.findReplysById(replyId);
      expect(reply[0].is_delete).toStrictEqual(true);
    });
  });

  describe('getRepliesByThreadId function', () => {
    it('should return empty array when no replies available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const threadId = 'thread-123';

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByThreadId(threadId);

      // Assert
      expect(replies).toEqual([]);
    });
    it('should persisted array', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const threadId = 'thread-123';
      const replyId = 'reply-123';

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByThreadId(threadId);
      // Assert
      expect(replies).toHaveLength(1);
    });
    it('should persisted array of ReplyDetail', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const threadId = 'thread-123';
      const replyId = 'reply-123';

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByThreadId(threadId);
      const actualReplies = await RepliesTableTestHelper.findReplysById(replyId);
      const expectedComment = [
        new ReplyDetail({
          id: actualReplies[0].id,
          content: actualReplies[0].content,
          date: actualReplies[0].date,
          username: 'dicoding',
          commentId: 'comment-123',
          isDelete: actualReplies[0].is_delete,
        }),
      ];
      // Assert
      expect(replies).toEqual(expectedComment);
    });
  });
});
