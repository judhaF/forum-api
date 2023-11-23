const Jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });
  describe('when POST /threads', () => {
    it('should response 201 and persisted threads', async () => {
      // Arrange
      const requestPayload = {
        title: 'a title',
        body: 'a thread',
      };
      const server = await createServer(container);

      // Action
      await UsersTableTestHelper.addUser({});
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });
    it('should throw 401 when not include jwt token', async () => {
      // Arrange
      const requestPayload = {
        title: 'a title',
        body: 'a thread',
      };
      const server = await createServer(container);

      // Action
      await UsersTableTestHelper.addUser({});
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });
    it('should throw 400 when title missing from payload', async () => {
      // Arrange
      const requestPayload = {
        body: 'a thread',
      };
      const server = await createServer(container);

      // Action
      await UsersTableTestHelper.addUser({});
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });
    it('should throw 400 when body missing from payload', async () => {
      // Arrange
      const requestPayload = {
        title: 'a title',
      };
      const server = await createServer(container);

      // Action
      await UsersTableTestHelper.addUser({});
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });
    it('should throw 400 when title have more than 64 character', async () => {
      // Arrange
      const requestPayload = {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit placerat.',
        body: 'a thread',
      };
      const server = await createServer(container);

      // Action
      await UsersTableTestHelper.addUser({});
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });
    it('should throw 404 when user id didn\'t exist', async () => {
      // Arrange
      const requestPayload = {
        title: 'a title',
        body: 'a thread',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });
  describe('When GET /threads/:threadId', () => {
    it('should response 200 code and persisted thread detail', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      // Action
      const server = await createServer(container);
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });
    it('should response 404 code when thread not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});

      // Action
      const server = await createServer(container);
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });
  describe('When POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comments', async () => {
      // Arrange
      const requestPayload = {
        content: 'a comment',
      };
      const server = await createServer(container);

      // Action
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
    it('should throw 401 when not include jwt token', async () => {
      // Arrange
      const requestPayload = {
        content: 'a comment',
      };
      const server = await createServer(container);

      // Action
      await UsersTableTestHelper.addUser({});
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });
    it('should throw 400 when not include content in payload', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const requestPayload = {};
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });
    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'a comment',
      };
      const server = await createServer(container);

      // Action
      await UsersTableTestHelper.addUser({});
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
    it('should response 404 when user not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'a comment',
      };
      const server = await createServer(container);

      // Action
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: requestPayload,
        auth: {
          credentials: { id: 'user-345' },
          strategy: 'forumapi_jwt',
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });
  describe('When DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and comment mark as delete', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(comments[0].is_delete).toEqual(true);
    });
    it('should response 401 when not inlcude auth', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });
    it('should response 403 when delete not owned comment', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        auth: {
          credentials: { id: 'user-345' },
          strategy: 'forumapi_jwt',
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
    });
    it('should response 404 when comment not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-345',
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
    it('should response 404 when thread not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-345/comments/comment-123',
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });
  describe('When POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persist reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'a reply',
      };
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      const responseJson = JSON.parse(response.payload);
      // Assert
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });
    it('should response 401 when not include jwt', async () => {
      // Arrange
      const requestPayload = {
        content: 'a reply',
      };
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
      });
      const responseJson = JSON.parse(response.payload);
      // Assert
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });
    it('should response 404 when user not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'a reply',
      };
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        auth: {
          credentials: { id: 'user-345' },
          strategy: 'forumapi_jwt',
        },
      });
      const responseJson = JSON.parse(response.payload);
      // Assert
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
    it('should response 404 when comment not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'a reply',
      };
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-345/replies',
        payload: requestPayload,
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      const responseJson = JSON.parse(response.payload);
      // Assert
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'a reply',
      };
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-345/comments/comment-123/replies',
        payload: requestPayload,
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      const responseJson = JSON.parse(response.payload);
      // Assert
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
    it('should response 400 when payload didnt meet spesification', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const requestPayload = {};
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      const responseJson = JSON.parse(response.payload);
      // Assert
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });
  });
  describe('When DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and mark replies as delete', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      const responseJson = JSON.parse(response.payload);
      const reply = await RepliesTableTestHelper.findReplysById('reply-123');
      // Assert
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(reply[0].is_delete).toEqual(true);
    });
    it('should response 404 when reply not exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-345',
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      const responseJson = JSON.parse(response.payload);
      // Assert
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
    it('should response 404 when reply not exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-345',
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      const responseJson = JSON.parse(response.payload);
      // Assert
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
    it('should response 403 when not an owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        auth: {
          credentials: { id: 'user-345' },
          strategy: 'forumapi_jwt',
        },
      });
      const responseJson = JSON.parse(response.payload);
      // Assert
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
    });
    it('should response 404 when comment not exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-345/replies/reply-123',
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      const responseJson = JSON.parse(response.payload);
      // Assert
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
    it('should response 404 when thread not exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-345/comments/comment-123/replies/reply-123',
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      const responseJson = JSON.parse(response.payload);
      // Assert
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });
  describe('When PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and add comment_likes', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      const responseJson = JSON.parse(response.payload);
      const likes = await CommentLikesTableTestHelper.findCommentLikesById('comment-123', 'user-123');
      // Assert
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(likes.length).toEqual(1);
    });
    it('should response 200 and delete comment_likes', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await CommentLikesTableTestHelper.addCommentLike({});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      const responseJson = JSON.parse(response.payload);
      const likes = await CommentLikesTableTestHelper.findCommentLikesById('comment-123', 'user-123');

      // Assert
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(likes.length).toEqual(0);
    });
    it('should response 401 when not include jwt token', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await CommentLikesTableTestHelper.addCommentLike({});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
      });
      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });
    it('should response 404 when thread not exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-345/comments/comment-123/likes',
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
    it('should response 404 when comment not exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-345/likes',
        auth: {
          credentials: { id: 'user-123' },
          strategy: 'forumapi_jwt',
        },
      });
      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
    it('should response 404 when user not exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        auth: {
          credentials: { id: 'user-345' },
          strategy: 'forumapi_jwt',
        },
      });
      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });
});
