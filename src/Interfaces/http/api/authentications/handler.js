const autoBind = require('auto-bind');
const UserUseCase = require('../../../../Applications/use_case/UserUseCase');

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    const userUseCase = this._container.getInstance(UserUseCase.name);
    const { accessToken, refreshToken } = await userUseCase.login(request.payload);
    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request) {
    const refreshAuthenticationUseCase = this._container
      .getInstance(UserUseCase.name);
    const accessToken = await refreshAuthenticationUseCase.refreshAuth(request.payload);

    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request) {
    const logoutUserUseCase = this._container.getInstance(UserUseCase.name);
    await logoutUserUseCase.logout(request.payload);
    return {
      status: 'success',
    };
  }
}

module.exports = AuthenticationsHandler;
