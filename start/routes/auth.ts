import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/login', 'AuthController.login')
  Route.post('/register', 'AuthController.register')
  Route.post('/verify', 'AuthController.verify')
  Route.post('/logout', 'AuthController.logout')
}).prefix('auth').prefix('api')
