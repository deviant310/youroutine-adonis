import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run () {
    await User.createMany([
      {
        email: 'deviant310@gmail.com',
        password: '123456',
      },
      {
        email: 'samoilenko88yulia@gmail.com',
        password: '654321',
      },
    ])
  }
}
