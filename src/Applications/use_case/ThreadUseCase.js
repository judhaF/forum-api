const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const PostThread = require('../../Domains/threads/entities/PostThread');
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');

class ThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, userRepository,
  }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async postThread(ownerId, useCasePayload) {
    await this._userRepository.verifyAvailableId(ownerId);
    const postThread = new PostThread(ownerId, useCasePayload);
    return this._threadRepository.addThread(postThread);
  }

  async getDetailThread(threadId) {
    // Get data from repositories
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);

    // Process delete and combine replies to comment
    this._combineCommentsAndReplies(comments, replies);

    // Create ThreadDetail Domain
    const threadDetail = new ThreadDetail({ ...thread }, comments);
    return threadDetail;
  }

  _combineCommentsAndReplies(comments, replies) {
    comments.forEach((element) => {
      const e = element;
      const valReplies = [];
      replies.forEach((el) => {
        const reply = el;
        if (el.commentId === element.id) {
          delete reply.commentId;
          valReplies.push(el);
        }
      });
      e.replies = valReplies;
    });
  }
}

module.exports = ThreadUseCase;
