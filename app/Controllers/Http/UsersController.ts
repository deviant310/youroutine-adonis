import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Repositories from '@ioc:YouRoutine/Repositories';

const { userRepository } = Repositories;

export default class UsersController {
  public async index ({}: HttpContextContract) {
    return await userRepository.getList({
      select: ['id', 'name'] as const,
      where: { id: 1 },
    });
  }

  public async store ({}: HttpContextContract) {
  }

  public async show ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
