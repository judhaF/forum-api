const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat memposting thread karena properti yang dibutuhkan tidak ada'),
  'POST_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat memposting thread karena tipe data tidak sesuai'),
  'POST_THREAD.TITLE_LIMIT_CHAR': new InvariantError('tidak dapat memposting thread karena title melebihi batas'),
  'POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat memposting comment karena properti yang dibutuhkan tidak ada'),
  'POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat memposting comment karena tipe data tidak sesuai'),
  'POST_COMMENT.THREAD_ID_LIMIT_CHAR': new InvariantError('tidak dapat memposting comment karena threadId melebihi batas'),
  'POST_COMMENT.OWNER_ID_LIMIT_CHAR': new InvariantError('tidak dapat memposting comment karena userId melebihi batas'),
  'POST_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat memposting reply karena properti yang dibutuhkan tidak ada'),
  'POST_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat memposting reply karena tipe data tidak sesuai'),
  'POST_REPLY.THREAD_ID_LIMIT_CHAR': new InvariantError('tidak dapat memposting reply karena threadId melebihi batas'),
  'POST_REPLY.OWNER_ID_LIMIT_CHAR': new InvariantError('tidak dapat memposting reply karena userId melebihi batas'),
};

module.exports = DomainErrorTranslator;
