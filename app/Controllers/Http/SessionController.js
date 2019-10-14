'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')*/
const user = use('App/Models/User')

const Mail = use('Mail')

class SessionController {
  async Authenticate({ request, auth }) {
    const { email, password } = request.only(['email', 'password'])

    const { token } = await auth.attempt(email, password)

    return { token }
  }

  async ResetPassword({ request }) {
    const { email } = request.only(['email'])
    const exists = await user.findBy('email', email)

    if (null != exists) {
      await Mail.raw('<h1>Email ao mundo!</h1>', message => {
        message.from('voitilaaraujo@gmail.com', ['Voitila'])
        message.to(email)
        message.subject('Reset password')
      })
      return {
        message: 'Email de reset enviado'
      }
    } else {
      return {
        message: 'Nenhuma conta foi encontrada com o email fornecido.'
      }
    }
  }
}

module.exports = SessionController
