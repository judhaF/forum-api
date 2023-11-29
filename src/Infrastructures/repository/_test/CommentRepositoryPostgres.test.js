const { DatabaseError } = require('pg');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentsRepositoryPostgres');
const PostComment = require('../../../Domains/comments/entities/PostComment');
const PostedComment = require('../../../Domains/comments/entities/PostedComment');
const ReplysTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ReplysTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });
  describe('addComment function', () => {
    it('should throw DatabaseError when comment with non exisiting user', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const payload = {
        content: 'content',
      };
      const postComment = new PostComment('user-345', 'thread-123', payload);
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Assert
      await expect(commentRepositoryPostgres.addComment(postComment))
        .rejects.toThrow(DatabaseError);
    });
    it('should throw DatabaseError when comment in non exisiting thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const payload = {
        content: 'content',
      };
      const postComment = new PostComment('user-123', 'thread-123', payload);
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Assert
      await expect(commentRepositoryPostgres.addComment(postComment))
        .rejects.toThrow(DatabaseError);
    });
    it('should persist posted comment', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const payload = {
        content: 'content',
      };
      const postComment = new PostComment('user-123', 'thread-123', payload);
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(postComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return posted comment correctly', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const payload = {
        content: 'content',
      };
      const postComment = new PostComment('user-123', 'thread-123', payload);
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const postedThread = await commentRepositoryPostgres.addComment(postComment);

      // Assert
      expect(postedThread).toStrictEqual(new PostedComment({
        id: 'comment-123',
        content: payload.content,
        ownerId: 'user-123',
      }));
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return empty array when not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const commentsAndReplies = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(commentsAndReplies).toEqual([]);
    });
    it('should persisted array', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');
      const actualComments = await CommentsTableTestHelper.findCommentsById('comment-123');
      // Assert
      expect(comments).toHaveLength(1);
    });
    it('should persisted array of CommentDetail', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');
      const actualComment = await CommentsTableTestHelper.findCommentsById('comment-123');
      const expectedComment = [
        new CommentDetail({
          id: actualComment[0].id,
          content: actualComment[0].content,
          date: actualComment[0].date,
          username: 'dicoding',
          isDelete: actualComment[0].is_delete,
          likeCount: 0,
        }),
      ];
      // Assert
      expect(comments).toEqual(expectedComment);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when comment not found', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('user-345', 'comment-123', 'thread-123'))
        .rejects.toThrow(NotFoundError);
    });
    it('should throw AuthorizationError when not an owner', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('user-345', 'comment-123', 'thread-123'))
        .rejects.toThrow(AuthorizationError);
    });
    it('should throw NotFound when thread id not found', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('user-123', 'comment-123', 'thread-345'))
        .rejects.toThrow(NotFoundError);
    });
    it('should not throw error when the comment exist and an owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('user-123', 'comment-123', 'thread-123'))
        .resolves.not.toThrowError();
    });
  });
  describe('softDeleteComment function', () => {
    it('should throw NotFoundError when comment not found', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Assert
      await expect(commentRepositoryPostgres.softDeleteComment('comment-345'))
        .resolves.not.toThrow(NotFoundError);
    });
    it('should mark comment as delete', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const commentId = 'comment-123';

      // Action
      await commentRepositoryPostgres.softDeleteComment(commentId);
      const comment = await CommentsTableTestHelper.findCommentsById(commentId);
      expect(comment[0].is_delete).toStrictEqual(true);
    });
  });

  describe('verifyAvailableId function', () => {
    it('should throw NotFoundError when commentId did not exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const commentId = 'comment-345';

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableId(commentId))
        .rejects.toThrow(NotFoundError);
    });
    it('should not throw NotFoundError when commentId did exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const commentId = 'comment-123';

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailableId(commentId))
        .resolves.not.toThrow(NotFoundError);
    });
  });
});
