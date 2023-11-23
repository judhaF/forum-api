const CommentLikeUseCase = require('../CommentLikeUseCase');
const CommentLikeRepository = require('../../../Domains/comment-likes/CommentLikeRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../Domains/users/UserRepository');

describe('CommentLikeUseCase', () => {
  const mockCommentLikeRepository = new CommentLikeRepository();
  const mockCommentRepository = new CommentRepository();
  const mockThreadRepository = new ThreadRepository();
  const mockUserRepository = new UserRepository();
  describe('LikeCommentUseCase', () => {
    it('should like comment when comment not liked before', async () => {
      // Arrange
      const commentId = 'comment-123';
      const userId = 'user-123';
      const threadId = 'thread-123';

      mockCommentRepository.verifyAvailableId = jest.fn(() => Promise.resolve());
      mockCommentLikeRepository.likeComment = jest.fn(() => Promise.resolve());
      mockCommentLikeRepository.verifyAvailableId = jest.fn()
        .mockImplementation(() => Promise.resolve(false));
      mockThreadRepository.verifyAvailableId = jest.fn(() => Promise.resolve());
      mockUserRepository.verifyAvailableId = jest.fn(() => Promise.resolve());

      const getCommentLikeUseCase = new CommentLikeUseCase({
        commentLikeRepository: mockCommentLikeRepository,
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
        userRepository: mockUserRepository,
      });

      // Action
      await getCommentLikeUseCase.likeComment(threadId, commentId, userId);
      // Assert
      expect(mockCommentRepository.verifyAvailableId).toBeCalledWith(commentId);
      expect(mockThreadRepository.verifyAvailableId).toBeCalledWith(threadId);
      expect(mockUserRepository.verifyAvailableId).toBeCalledWith(userId);
      expect(mockCommentLikeRepository.verifyAvailableId).toBeCalledWith(userId, commentId);
      expect(mockCommentLikeRepository.likeComment).toBeCalledWith(userId, commentId);
    });
    it('should unlike comment when comment liked before', async () => {
      // Arrange
      const commentId = 'comment-123';
      const userId = 'user-123';
      const threadId = 'thread-123';

      mockCommentRepository.verifyAvailableId = jest.fn(() => Promise.resolve());
      mockCommentLikeRepository.unlikeComment = jest.fn(() => Promise.resolve());
      mockCommentLikeRepository.verifyAvailableId = jest.fn()
        .mockImplementation(() => Promise.resolve(true));
      mockThreadRepository.verifyAvailableId = jest.fn(() => Promise.resolve());
      mockUserRepository.verifyAvailableId = jest.fn(() => Promise.resolve());

      const getCommentLikeUseCase = new CommentLikeUseCase({
        commentLikeRepository: mockCommentLikeRepository,
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
        userRepository: mockUserRepository,
      });
      // Action
      await getCommentLikeUseCase.likeComment(threadId, commentId, userId);
      // Assert
      expect(mockCommentRepository.verifyAvailableId).toBeCalledWith(commentId);
      expect(mockThreadRepository.verifyAvailableId).toBeCalledWith(threadId);
      expect(mockUserRepository.verifyAvailableId).toBeCalledWith(userId);
      expect(mockCommentLikeRepository.verifyAvailableId).toBeCalledWith(userId, commentId);
      expect(mockCommentLikeRepository.unlikeComment).toBeCalledWith(userId, commentId);
    });
  });
});
