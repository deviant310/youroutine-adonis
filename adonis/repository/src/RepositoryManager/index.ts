import { RepositoryConstructor } from '@ioc:Adonis/Core/Repository';

export default class RepositoryManager {
  static async import(repositoryName: string): Promise<Repository<object>> {
    const { default: config } = await import('Config')

    switch(config.auth.storage){
      case 'postresql':
      case 'mysql':
        return this.getSQLRepositoryOf(repositoryName)
    }
  }

  private static getSQLRepositoryOf(repositoryName: string): Repository<object> {
    switch(repositoryName){
      case 'UserRepository': return UserSQLRepository
      default:
        throw new Error(`SQL Repository ${repositoryName} is not exist!`)
    }
  }
}
