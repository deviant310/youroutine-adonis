import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run () {
    await User.createMany([
      {
        phone: '+79995266422',
        name: 'Anton',
      },
      {
        phone: '+79046320425',
        name: 'Yulia',
      },
    ])
  }
}
