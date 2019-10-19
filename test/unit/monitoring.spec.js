'use strict'

const { test, trait } = use('Test/Suite')('Monitor')

trait('Test/ApiClient')
trait('DatabaseTransactions')

test('it should return all the TC status', async ({
  assert,
  client
}) => {
    const response = await client.get('/monitor').end()
})
