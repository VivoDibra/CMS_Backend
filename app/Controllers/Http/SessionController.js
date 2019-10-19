'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')*/
const user = use('App/Models/User')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')*/
const Token = use('App/Models/Token')

const Mail = use('Mail')
const Env = use('Env')
const { randomBytes } = require('crypto')
const { promisify } = require('util')

class SessionController {
  async Authenticate({ request, auth }) {
    const { email, password } = request.only(['email', 'password'])

    const { token } = await auth.attempt(email, password)
    return { token }
  }

  async ResetEmail({ request }) {
    const { email } = request.only(['email'])

    try {
      const usuario = await user.findByOrFail('email', email)

      const random = await promisify(randomBytes)(16)
      const resetToken = random.toString('hex')

      await usuario.tokens().create({
        token: resetToken,
        type: 'resetPassword'
      })

      //link da page front-end... IMPORTANTE ESTAR SEMPRE ATUALIZADA NO .ENV!!!
      const resetURL = `${Env.get('FRONT_URL')}/reset?token=${resetToken}`

      try {
        await Mail.send(
          'emails.forgotpassword',
          { name: usuario.fullname, resetURL },
          message => {
            message.from('CTEEP@gmail.com.br', 'CTEEP Monitor System')
            message.to(usuario.email, usuario.fullname)
            message.subject('CTEEP Monitor System - Reset password')
          }
        )
      } catch (err) {
        return {
          message: `Não foi possivel enviar o email para: ${email}, por favor, tente novamente.`
        }
      }
    } catch (err) {
      return {
        message: `Não foi possivel encontrar no sistema um usuário cadastrado com o email fornecido: ${email}.`
      }
    }
  }

  async ResetPassword({ request }) {
    const { token, newPassword } = request.only(['token', 'newPassword'])

    try {
      const Usertoken = await Token.findByOrFail('token', token)
      const user = await Usertoken.user().fetch()

      user.password = newPassword
      await user.save()
    } catch (err) {
      return {
        message: 'Falha ao cadastrar nova senha, por favor, tente novamente'
      }
    }
  }
}

module.exports = SessionController
