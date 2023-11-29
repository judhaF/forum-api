const PostThread = require('../../../Domains/threads/entities/PostThread');
const PostedThread = require('../../../Domains/threads/entities/PostedThread');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadUseCase = require('../ThreadUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');
const ReplyDetail = require('../../../Domains/replies/entities/ReplyDetail');

describe('ThreadUseCase', () => {
  const mockThreadRepository = new ThreadRepository();
  const mockCommentRepository = new CommentRepository();
  const mockReplyRepository = new ReplyRepository();
  const mockUserRepository = new UserRepository();

  describe('PostThreadUseCase', () => {
    it('should orchestrating the post thread action correctly', async () => {
      // Arrange
      const useCasePayload = {
        title: 'secret',
        body: 'Dicoding Indonesia',
      };
      const ownerId = 'user-123';
      const mockPostedThread = new PostedThread({
        id: 'thread-1234',
        title: useCasePayload.title,
        ownerId,
      });

      mockThreadRepository.addThread = jest.fn()
        .mockImplementation(() => Promise.resolve(new PostedThread({
          id: 'thread-1234',
          title: useCasePayload.title,
          ownerId,
        })));
      mockUserRepository.verifyAvailableId = jest.fn().mockImplementation(() => Promise.resolve());

      const getThreadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
        userRepository: mockUserRepository,
      });

      // Action
      const postedThread = await getThreadUseCase.postThread(ownerId, useCasePayload);

      // Assert
      expect(mockUserRepository.verifyAvailableId).toBeCalledWith(ownerId);
      expect(mockThreadRepository.addThread)
        .toBeCalledWith(new PostThread(ownerId, useCasePayload));
      expect(postedThread).toEqual(mockPostedThread);
    });
  });
  describe('GetDetailThreadUseCase', () => {
    it('should orchestrating the get thread detail action correctly', async () => {
      // Arrange
      const threadId = 'thread-123';
      const mockThread = {
        id: threadId,
        title: 'a title from afar',
        body: 'Someday, it\'ll all stops. And you won\'t even notice',
        date: new Date('2021-08-08T07:19:09.775Z'),
        username: 'dicoding',
      };
      const mockComments = [
        new CommentDetail({
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: new Date('2021-08-08T07:19:09.775Z'),
          content: 'sebuah comment',
          isDelete: false,
          likeCount: 1,
        }),
        new CommentDetail({
          id: 'comment-_pby2_tmXV6bcvcdev8xa',
          username: 'dicoding',
          date: new Date('2021-08-08T07:32:09.775Z'),
          content: 'sebuah comment',
          isDelete: true,
          likeCount: 0,
        }),
      ];
      mockComments[0].replies = [
        {
          id: 'reply-_pby2_tmXV6bcvcdev8xk',
          username: 'dicoding',
          date: new Date('2021-08-08T07:19:11.775Z'),
          content: 'sebuah balasan',
        },
        {
          id: 'reply-_pby2_tmXV6bcvcdev8x2',
          username: 'johndoe',
          date: new Date('2021-08-08T07:20:10.775Z'),
          content: '**balasan telah dihapus**',
        },
      ];
      mockComments[1].replies = [];
      mockThreadRepository.getThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve({
          id: threadId,
          title: 'a title from afar',
          body: 'Someday, it\'ll all stops. And you won\'t even notice',
          date: new Date('2021-08-08T07:19:09.775Z'),
          username: 'dicoding',
        }));
      mockCommentRepository.getCommentsByThreadId = jest.fn()
        .mockImplementation(() => Promise.resolve([
          new CommentDetail({
            id: 'comment-_pby2_tmXV6bcvcdev8xk',
            username: 'johndoe',
            date: new Date('2021-08-08T07:19:09.775Z'),
            content: 'sebuah comment',
            isDelete: false,
            likeCount: 1,
          }),
          new CommentDetail({
            id: 'comment-_pby2_tmXV6bcvcdev8xa',
            username: 'dicoding',
            date: new Date('2021-08-08T07:32:09.775Z'),
            content: 'sebuah comment',
            isDelete: true,
            likeCount: 0,
          }),
        ]));
      mockReplyRepository.getRepliesByThreadId = jest.fn()
        .mockImplementation(() => Promise.resolve([
          new ReplyDetail({
            id: 'reply-_pby2_tmXV6bcvcdev8xk',
            username: 'dicoding',
            date: new Date('2021-08-08T07:19:11.775Z'),
            content: 'sebuah balasan',
            isDelete: false,
            commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
          }),
          new ReplyDetail({
            id: 'reply-_pby2_tmXV6bcvcdev8x2',
            username: 'johndoe',
            date: new Date('2021-08-08T07:20:10.775Z'),
            content: 'sebuah balasan kedua',
            isDelete: true,
            commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
          }),
        ]));

      const getThreadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
        userRepository: mockUserRepository,
      });
      jest.spyOn(getThreadUseCase, '_combineCommentsAndReplies');

      // Action
      const thread = await getThreadUseCase.getDetailThread(threadId);

      // Assert
      expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
      expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
      expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(threadId);
      expect(getThreadUseCase._combineCommentsAndReplies).toBeCalled();
      expect(thread).toBeInstanceOf(ThreadDetail);
      expect(thread).toEqual(new ThreadDetail({ ...mockThread }, mockComments));
    });
  });
  describe('_combineCommentsAndReplies function', () => {
    it('should persisted empty array of replies in comments when no replies', async () => {
      // Arrange
      const mockComments = [
        new CommentDetail({
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: new Date('2021-08-08T07:19:09.775Z'),
          content: 'sebuah comment',
          isDelete: false,
          likeCount: 1,
        }),
        new CommentDetail({
          id: 'comment-_pby2_tmXV6bcvcdev8xa',
          username: 'dicoding',
          date: new Date('2021-08-08T07:32:09.775Z'),
          content: 'sebuah comment',
          isDelete: true,
          likeCount: 0,
        }),
      ];
      const replies = [];

      const getThreadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
        userRepository: mockUserRepository,
      });

      // Action
      getThreadUseCase._combineCommentsAndReplies(mockComments, replies);

      // Assert
      expect(mockComments[0].replies).toEqual([]);
      expect(mockComments[1].replies).toEqual([]);
    });
    it('should persisted comments with added replies when there is replies', async () => {
      // Arrange
      const mockComments = [
        new CommentDetail({
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: new Date('2021-08-08T07:19:09.775Z'),
          content: 'sebuah comment',
          isDelete: false,
          likeCount: 1,
        }),
        new CommentDetail({
          id: 'comment-_pby2_tmXV6bcvcdev8xa',
          username: 'dicoding',
          date: new Date('2021-08-08T07:32:09.775Z'),
          content: 'sebuah comment',
          isDelete: true,
          likeCount: 0,
        }),
      ];
      const replies = [
        new ReplyDetail({
          id: 'reply-_pby2_tmXV6bcvcdev8xk',
          username: 'dicoding',
          date: new Date('2021-08-08T07:19:11.775Z'),
          content: 'sebuah balasan',
          isDelete: false,
          commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
        }),
        new ReplyDetail({
          id: 'reply-_pby2_tmXV6bcvcdev8x2',
          username: 'johndoe',
          date: new Date('2021-08-08T07:20:10.775Z'),
          content: 'sebuah balasan kedua',
          isDelete: true,
          commentId: 'comment-_pby2_tmXV6bcvcdev8xk',
        }),
      ];

      const getThreadUseCase = new ThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
        userRepository: mockUserRepository,
      });

      // Action
      getThreadUseCase._combineCommentsAndReplies(mockComments, replies);
      await replies.forEach((element) => {
        const el = element;
        delete el.commentId;
      });

      // Assert
      expect(mockComments[0].replies).toEqual(replies);
      expect(mockComments[1].replies).toEqual([]);
    });
  });
});
