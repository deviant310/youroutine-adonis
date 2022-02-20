import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import { RepositoriesContainer } from '@ioc:YouRoutine/Repositories';
import { camelCase } from 'camel-case';

export default class AppProvider {
  public static needsApplication = true;

  constructor (protected app: ApplicationContract) {
  }

  public async register (): Promise<void> {
    const Repositories = await import('App/Repositories');

    this.app.container.singleton('YouRoutine/Repositories', () => {
      return Object.entries(Repositories)
        .reduce((obj: { [key: string]: unknown }, [key, Repository]) => {
          obj[camelCase(key)] = new Repository();

          return obj;
        }, {}) as RepositoriesContainer;
    });
  }

  public async boot (): Promise<void> {
    // App is booted
  }

  public async ready (): Promise<void> {
    // App is ready
  }

  public async shutdown (): Promise<void> {
    // Cleanup, since app is going down
  }
}
