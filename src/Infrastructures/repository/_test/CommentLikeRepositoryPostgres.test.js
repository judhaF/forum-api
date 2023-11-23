const { DatabaseError } = require('pg');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const pool = require('../../database/postgres/pool');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');
const PostComment = require('../../../Domains/comments/entities/PostComment');
const PostedComment = require('../../../Domains/comments/entities/PostedComment');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');

describe('CommentLikeRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableId function', () => {
    it('should return false when likes with commentId not exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const commentId = 'comment-123';
      const userId = 'user-123';
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
      );
      // Action
      const result = await commentLikeRepositoryPostgres.verifyAvailableId(userId, commentId);
      // Assert
      await expect(result).toEqual(false);
    });
    it('should return false when likes with userId not exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentId = 'comment-123';
      const userId = 'user-345';

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
      );

      // Action
      const result = await commentLikeRepositoryPostgres.verifyAvailableId(userId, commentId);
      // Assert
      await expect(result).toEqual(false);
    });
    it('should return true when comment_like exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await CommentLikesTableTestHelper.addCommentLike({});

      const commentId = 'comment-123';
      const userId = 'user-123';

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
      );
      // Action
      const result = await commentLikeRepositoryPostgres.verifyAvailableId(userId, commentId);
      // Assert
      await expect(result).toEqual(true);
      await expect(result).toEqual(true);
    });
  });

  describe('countLike function', () => {
    it('should return 0 when no like found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool);

      // Action
      const likes = await commentLikeRepositoryPostgres.countLikes('comment-123');

      // Assert
      expect(likes).toEqual(0);
    });
    it('should return row count of comment_likes', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await CommentLikesTableTestHelper.addCommentLike({});

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool);

      // Action
      const likes = await commentLikeRepositoryPostgres.countLikes('comment-123');

      // Assert
      expect(likes).toEqual(1);
    });
  });

  describe('likeComment function', () => {
    it('should throw DatabaseError when commentId not found', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool);

      // Assert
      await expect(commentLikeRepositoryPostgres.likeComment('user-123', 'comment-345'))
        .rejects.toThrow(DatabaseError);
    });
    it('should throw DatabaseError when userId not found', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool);

      // Assert
      await expect(commentLikeRepositoryPostgres.likeComment('user-345', 'comment-123'))
        .rejects.toThrow(DatabaseError);
    });
    it('should persist comment_likes', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentId = 'comment-123';
      const userId = 'user-123';

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool);
      // Action
      await commentLikeRepositoryPostgres.likeComment(userId, commentId);
      const likes = await CommentLikesTableTestHelper.findCommentLikesById(commentId, userId);

      // Assert
      expect(likes.length).toEqual(1);
      expect(likes[0].comment_id).toEqual(commentId);
      expect(likes[0].user_id).toEqual(userId);
    });
  });

  describe('unlikeComment function', () => {
    it('should delete comment_likes', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await CommentLikesTableTestHelper.addCommentLike({});

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool);
      const commentId = 'comment-123';
      const userId = 'user-123';

      // Action
      await commentLikeRepositoryPostgres.unlikeComment(userId, commentId);
      const likes = await CommentLikesTableTestHelper.findCommentLikesById(commentId, userId);

      // Assert
      expect(likes.length).toEqual(0);
    });
  });
});
