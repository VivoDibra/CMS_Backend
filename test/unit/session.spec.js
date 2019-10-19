'use strict'

const { test, trait } = use('Test/Suite')('Session')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

trait('DatabaseTransactions')
trait('Test/ApiClient')

test('it should return a JWT token', async ({ client, assert }) => {
  const staticCredencials = {
    email: 'usuario@gmail.com',
    password: '123456'
  }

  const newUser = await Factory.model('App/Models/User').create(
    staticCredencials
  )

  const response = await client
    .post('/sessions')
    .send(staticCredencials)
    .end()

  response.assertStatus(200)
  assert.exists(response.body.token)

})
