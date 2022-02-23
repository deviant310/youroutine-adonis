import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Repositories from '@ioc:YouRoutine/Repositories';

const { userRepository } = Repositories;

export default class UserSeeder extends BaseSeeder {
  public static developmentOnly = true;

  public async run () {
    await userRepository.add({
      phone: '+79995266422',
      name: 'Anton',
      surname: null,
      patronymic: null,
    });

    await userRepository.add({
      phone: '+79046320425',
      name: 'Yulia',
      surname: null,
      patronymic: null,
    });
  }
}
