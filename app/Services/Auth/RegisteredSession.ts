export default class RegisteredSession {
  public sessionId: string

  constructor (sessionId: string) {
    this.sessionId = sessionId
  }

  public toJSON () {
    return {
      session_id: this.sessionId,
    }
  }
}
