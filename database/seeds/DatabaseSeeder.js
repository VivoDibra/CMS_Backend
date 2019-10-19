'use strict'

/*
|--------------------------------------------------------------------------
| DatabaseSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class DatabaseSeeder {
  async run() {
    const staticCredencials = {
      email: 'usuario@gmail.com',
      password: '123456'
    }
    
    await Factory.model('App/Models/User').create(staticCredencials)
  }
}

module.exports = DatabaseSeeder
