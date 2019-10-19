'use strict'

const { test, trait } = use('Test/Suite')('Forgot password')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

const Mail = use('Mail')

trait('Test/ApiClient')
trait('DatabaseTransactions')

test('it should generate a reset token, then send reset password instructions to an user email', async ({
  assert,
  client
}) => {
  Mail.fake()

  //credenciais fixas apenas para teste
  const staticCredencials = {
    email: 'usuario@gmail.com',
    password: '123456'
  }

  const user = await Factory.model('App/Models/User').create(staticCredencials)

  //envia email do user para a api gerar o token e enviar as instruções para o email
  const response = await client
    .post('/forgot')
    .send(staticCredencials)
    .end()

  //checa o ultimo email verificado
  const recentEmail = Mail.pullRecent()

  //buscar pelos token criados na tabela "token" que sejam relacionados a X usuário
  const token = await user.tokens().first()


  //envia token de reset + nova senha para serem alterados no BD
  await client
    .post('/reset')
    .send({
      token: token.token,
      newPassword: 'byeWorld',
      newPassword_confirmation: 'byeWorld'
    })
    .end()

  //pega os dados atualizados do usuario e verifica se a senha foi realmente alterada
  const user_att = await User.findBy('email', staticCredencials.email)
  const checkPassword = await Hash.verify('byeWorld', user_att.password)

  //asserts
  assert.equal(recentEmail.message.to[0].address, staticCredencials.email)
  assert.include(token.toJSON(), {
    user_id: user.id,
    type: 'resetPassword'
  })
  assert.isTrue(checkPassword)
  response.assertStatus(204)

  Mail.restore()
})
