const autoBind = require('auto-bind');
const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postThreadHandler(request, h) {
    const { id: ownerId } = request.auth.credentials;
    const postThreadUseCase = this._container.getInstance(ThreadUseCase.name);
    const addedThread = await postThreadUseCase.postThread(ownerId, request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadDetail(request, h) {
    const { threadId } = request.params;

    const getThreadDetailUseCase = this._container.getInstance(ThreadUseCase.name);
    const thread = await getThreadDetailUseCase.getDetailThread(threadId);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
