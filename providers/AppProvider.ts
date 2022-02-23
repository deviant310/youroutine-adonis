import { ApplicationContract } from '@ioc:Adonis/Core/Application';

export default class AppProvider {
  public static needsApplication = true;

  constructor (protected app: ApplicationContract) {
  }

  public async register (): Promise<void> {
    // App is registered
  }

  public async boot (): Promise<void> {
    const Route = this.app.container.use('Adonis/Core/Route');

    Route.get('/', async () => {});
  }

  public async ready (): Promise<void> {
    // App is ready
  }

  public async shutdown (): Promise<void> {
    // Cleanup, since app is going down
  }
}
