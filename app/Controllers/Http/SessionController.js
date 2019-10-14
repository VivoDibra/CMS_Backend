'use strict'

class SessionController {
  async Store({ request, auth }) {
    const { email, password } = request.only([
      'email',
      'password'
    ])

    const { token } = await auth.attempt(email, password)

    return { token }
  }
}

module.exports = SessionController
