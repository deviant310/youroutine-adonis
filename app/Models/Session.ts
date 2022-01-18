import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, column, beforeSave } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { createHash } from 'crypto'

export default class Session extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column({ serializeAs: null })
  public verificationCode: string

  @column({ serializeAs: null })
  public accessToken: string

  @column()
  public attempts: number

  @column()
  public meta: object

  @column.dateTime()
  public expiresAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @beforeSave()
  public static async hashVerificationCode (session: Session) {
    if (session.$dirty.verificationCode) {
      session.verificationCode = await Hash.make(session.verificationCode)
    }
  }

  @beforeSave()
  public static async hashAccessToken (session: Session) {
    if (session.$dirty.accessToken) {
      session.accessToken = createHash('sha256').update(session.accessToken).digest('hex')
    }
  }
}
