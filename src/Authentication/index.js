let getToken = function() {
  return Promise.resolve({
    value:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    expires: '2022-04-23T18:25:43.511Z',
    type: 'Example',
  })
}

export const initAuthentication = config => {
  getToken = config.getToken
}

export default {
  token() {
    return getToken()
  },
}
