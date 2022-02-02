declare module '@ioc:YouRoutine/Repository/User' {
  import LucidRepository from 'App/Repositories/LucidRepository'
  import User from 'App/Models/User'

  const userRepo: LucidRepository<typeof User, {
    id: number
  }>

  export default userRepo
}
