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
    
    try {
      const usuario = await user.findByOrFail('email', email)

      await Mail.send(
        'emails.forgotpassword',
        { name: usuario.fullname },
        message => {
          message.from('CTEEP@gmail.com.br', 'CTEEP Monitor System')
          message.to(usuario.email, usuario.fullname)
          message.subject('CTEEP Monitor System - Reset password')
        }
      )
    } catch (err) {
      return {
        message:
          'Não foi possivel encontrar no sistema um usuário com o email fornecido.'
      }
    }
  }
}

module.exports = SessionController
