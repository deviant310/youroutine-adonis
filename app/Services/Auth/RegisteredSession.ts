export default class RegisteredSession {
  public sessionId: string
  public userId: number

  constructor (sessionId: string, userId: number) {
    this.sessionId = sessionId
    this.userId = userId
  }

  public toJSON () {
    return {
      session_id: this.sessionId,
      user_id: this.userId,
    }
  }
}
