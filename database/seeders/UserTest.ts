import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserTest from 'App/Models/UserTest'

export default class UserTestSeeder extends BaseSeeder {
  public async run () {
    await UserTest.createMany([
      {
        email: 'admin@foobar.team',
        password: '123456',
      },
    ])
  }
}
