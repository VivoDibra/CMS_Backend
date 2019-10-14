'use strict'

const { test, trait } = use('Test/Suite')('Forgot password')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const Mail = use('Mail')

trait('Test/ApiClient')
trait('DatabaseTransactions')

test('it should send reset password instructions to user email', async ({
  assert,
  client
}) => {
  Mail.fake()

  const staticCredencials = {
    email: 'voitilaaraujo@gmail.com',
    password: '123456'
  }

  await Factory
  .model('App/Models/User')
  .create(
    staticCredencials
  )

  const response = await client
    .post('/forgot')
    .send(staticCredencials)
    .end()
  const recentEmail = Mail.pullRecent()

  assert.equal(recentEmail.message.to[0].address, staticCredencials.email)
  response.assertStatus(200)

  Mail.restore()
})
