import { DateTime } from 'luxon'

export default class VerifiedSession {
  public token: string
  public expiresAt?: DateTime

  constructor (token: string, expiresAt?: DateTime) {
    this.token = token
    this.expiresAt = expiresAt
  }

  public toJSON () {
    return {
      token: this.token,
      ...(this.expiresAt ? { expires_at: this.expiresAt.toISO() || undefined } : {}),
    }
  }
}
