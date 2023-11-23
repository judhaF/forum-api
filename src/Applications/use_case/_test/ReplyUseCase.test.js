const PostReply = require('../../../Domains/replies/entities/PostReply');
const PostedReply = require('../../../Domains/replies/entities/PostedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ReplyUseCase = require('../ReplyUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('ReplyUseCase', () => {
  const mockReplyRepository = new ReplyRepository();
  const mockCommentRepository = new CommentRepository();
  const mockUserRepository = new UserRepository();
  const mockThreadRepository = new ThreadRepository();

  describe('ReplyCommentUseCase', () => {
    it('should orchestrating the post comment action correctly', async () => {
      // Arrange
      const useCasePayload = {
        content: 'content',
      };
      const ownerId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const mockPostedReply = new PostedReply({
        id: 'reply-123',
        content: useCasePayload.content,
        ownerId,
      });

      mockReplyRepository.replyComment = jest.fn()
        .mockImplementation(() => Promise.resolve(new PostedReply({
          id: 'reply-123',
          content: useCasePayload.content,
          ownerId,
        })));
      mockCommentRepository.verifyAvailableId = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockThreadRepository.verifyAvailableId = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockUserRepository.verifyAvailableId = jest.fn()
        .mockImplementation(() => Promise.resolve());

      const replyCommentUseCase = new ReplyUseCase({
        replyRepository: mockReplyRepository,
        userRepository: mockUserRepository,
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });
      // Action
      const postedReply = await replyCommentUseCase
        .replyComment(ownerId, threadId, useCasePayload, commentId);

      // Assert
      expect(mockReplyRepository.replyComment)
        .toBeCalledWith(new PostReply(ownerId, threadId, useCasePayload, commentId));
      expect(postedReply).toEqual(mockPostedReply);
    });
  });

  describe('SoftDeleteReplyUseCase', () => {
    it('should throw error if threadId not string', async () => {
      // Arrange

      mockReplyRepository.replyComment = jest.fn()
        .mockImplementation(() => Promise.resolve());
      const deleteCommentUseCase = new ReplyUseCase({
        replyRepository: mockReplyRepository,
        userRepository: mockUserRepository,
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });
      const threadId = 123;
      const ownerId = 'user-123';
      const commentId = 'comment-123';

      // Action & Assert
      await expect(deleteCommentUseCase.softDelete(threadId, ownerId, commentId))
        .rejects
        .toThrowError('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
    it('should throw error if ownerId not string', async () => {
      // Arrange

      mockReplyRepository.verifyReplyOwner = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepository.softDeleteReply = jest.fn()
        .mockImplementation(() => Promise.resolve());
      const deleteReplyUseCase = new ReplyUseCase({
        replyRepository: mockReplyRepository,
        userRepository: mockUserRepository,
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });
      const threadId = 'thread-123';
      const ownerId = 123;
      const commentId = 'comment-123';

      // Action & Assert
      await expect(deleteReplyUseCase.softDelete(threadId, ownerId, commentId))
        .rejects
        .toThrowError('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
    it('should throw error if commentId not string', async () => {
      // Arrange

      mockReplyRepository.softDeleteReply = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepository.verifyReplyOwner = jest.fn()
        .mockImplementation(() => Promise.resolve());
      const deleteReplyUseCase = new ReplyUseCase({
        replyRepository: mockReplyRepository,
        userRepository: mockUserRepository,
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });
      const threadId = 'thread-123';
      const ownerId = 'user-123';
      const commentId = 123;

      // Action & Assert
      await expect(deleteReplyUseCase.softDelete(threadId, ownerId, commentId))
        .rejects
        .toThrowError('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
    it('should orchestrating the delete reply action correctly', async () => {
      // Arrange
      const threadId = 'thread-123';
      const ownerId = 'user-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      mockReplyRepository.softDeleteReply = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepository.verifyReplyOwner = jest.fn()
        .mockImplementation(() => Promise.resolve());

      const deleteReplyUseCase = new ReplyUseCase({
        replyRepository: mockReplyRepository,
        userRepository: mockUserRepository,
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });
      // Act
      await deleteReplyUseCase.softDelete(replyId, ownerId, threadId, commentId);

      // Assert
      expect(mockReplyRepository.softDeleteReply)
        .toHaveBeenCalledWith(replyId);
      expect(mockReplyRepository.verifyReplyOwner)
        .toHaveBeenCalledWith(ownerId, replyId, threadId, commentId);
    });
  });
});
