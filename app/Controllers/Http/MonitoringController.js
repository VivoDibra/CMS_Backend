'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')*/
const user = use('App/Models/User')

class MonitoringController {
  async receive({ response }) {

    response.send({ message: 'it should return all TCs status' })
  }
}

module.exports = MonitoringController
