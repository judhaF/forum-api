const CommentDetail = require('../../comments/entities/CommentDetail');
const ReplyDetail = require('../../replies/entities/ReplyDetail');

class ThreadDetail {
  constructor(thread, comments) {
    this._verifyPayload(thread, comments);
    // this._leftJoinCommentsAndReplies(comments, replies);
    const {
      id, title, body, date, username,
    } = thread;
    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }

  _verifyPayload({
    id, title, body, date, username,
  }, comments) {
    if (!id || !title || !body || !username || !date || !comments) {
      throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (
      typeof id !== 'string'
      || typeof title !== 'string'
      || typeof body !== 'string'
      || typeof date !== 'object'
      || typeof username !== 'string'
      || !Array.isArray(comments)
      // || !Array.isArray(replies)
    ) {
      throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    // if (comments.some((element) => !(element instanceof CommentDetail))) {
    //   throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPESIFICATION');
    // }
    // if (replies.some((element) => !(element instanceof ReplyDetail))) {
    //   throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPESIFICATION');
    // }
  }

  // _leftJoinCommentsAndReplies(comments, replies) {
  //   comments.forEach((comment) => {
  //     const element = comment;
  //     const newReplies = [];
  //     replies.forEach((reply) => {
  //       const { commentId, ...rest } = reply;
  //       if (commentId === comment.id) {
  //         newReplies.push(rest);
  //       }
  //     });
  //     element.replies = newReplies;
  //   });
  // }
}

module.exports = ThreadDetail;
