import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

abstract class BaseService {
  constructor (repository: HttpContextContract) {

  }
}
