const PostComment = require('../../../Domains/comments/entities/PostComment');
const PostedComment = require('../../../Domains/comments/entities/PostedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentUseCase = require('../CommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../Domains/users/UserRepository');

describe('CommentUseCase', () => {
  const mockCommentRepository = new CommentRepository();
  const mockThreadRepository = new ThreadRepository();
  const mockUserRepository = new UserRepository();

  describe('PostCommentUseCase', () => {
    it('should orchestrating the post comment action correctly', async () => {
      // Arrange
      const useCasePayload = {
        content: 'content',
      };
      const ownerId = 'user-123';
      const threadId = 'thread-123';
      const mockPostedThread = new PostedComment({
        id: 'comment-123',
        content: useCasePayload.content,
        ownerId,
      });

      mockUserRepository.verifyAvailableId = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockThreadRepository.verifyAvailableId = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.addComment = jest.fn()
        .mockImplementation(() => Promise.resolve(new PostedComment({
          id: 'comment-123',
          content: useCasePayload.content,
          ownerId,
        })));

      const getCommentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
        userRepository: mockUserRepository,
      });

      // Action
      const postedComment = await getCommentUseCase.postComment(ownerId, threadId, useCasePayload);

      // Assert
      expect(mockCommentRepository.addComment)
        .toBeCalledWith(new PostComment(ownerId, threadId, useCasePayload));
      expect(postedComment).toEqual(mockPostedThread);
    });
  });
  describe('SoftDeleteCommentUseCase', () => {
    it('should throw error if threadId not string', async () => {
      // Arrange
      mockCommentRepository.softDeleteComment = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyCommentOwner = jest.fn()
        .mockImplementation(() => Promise.resolve());

      const deleteCommentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
        userRepository: mockUserRepository,
      });
      const threadId = 123;
      const ownerId = 'user-123';
      const commentId = 'comment-123';

      // Action & Assert
      await expect(deleteCommentUseCase.softDelete(threadId, ownerId, commentId))
        .rejects
        .toThrowError('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
    it('should throw error if ownerId not string', async () => {
      // Arrange

      mockCommentRepository.softDeleteComment = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyCommentOwner = jest.fn()
        .mockImplementation(() => Promise.resolve());
      const deleteCommentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
        userRepository: mockUserRepository,
      });
      const threadId = 'thread-123';
      const ownerId = 123;
      const commentId = 'comment-123';

      // Action & Assert
      await expect(deleteCommentUseCase.softDelete(threadId, ownerId, commentId))
        .rejects
        .toThrowError('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
    it('should throw error if commentId not string', async () => {
      // Arrange

      mockCommentRepository.softDeleteComment = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyCommentOwner = jest.fn()
        .mockImplementation(() => Promise.resolve());

      const deleteCommentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
        userRepository: mockUserRepository,
      });
      const threadId = 'thread-123';
      const ownerId = 'user-123';
      const commentId = 123;

      // Action & Assert
      await expect(deleteCommentUseCase.softDelete(threadId, ownerId, commentId))
        .rejects
        .toThrowError('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
    it('should orchestrating the delete comment action correctly', async () => {
      // Arrange
      const threadId = 'thread-123';
      const ownerId = 'user-123';
      const commentId = 'comment-123';
      mockCommentRepository.softDeleteComment = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyCommentOwner = jest.fn()
        .mockImplementation(() => Promise.resolve());

      const deleteCommentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
        userRepository: mockUserRepository,
      });
      // Act
      await deleteCommentUseCase.softDelete(commentId, ownerId, threadId);

      // Assert
      expect(mockCommentRepository.softDeleteComment)
        .toHaveBeenCalledWith(commentId);
      expect(mockCommentRepository.verifyCommentOwner)
        .toHaveBeenCalledWith(ownerId, commentId, threadId, null);
    });
  });
});
