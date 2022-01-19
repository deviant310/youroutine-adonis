import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, column, beforeSave } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { createHash } from 'crypto'
export default class Session extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public userId!: number

  @column({ serializeAs: null })
  public verificationCode?: string | null

  @column({ serializeAs: null })
  public accessToken?: string | null

  @column()
  public attempts!: number

  @column()
  public meta?: object | null

  @column.dateTime()
  public expiresAt?: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime | undefined

  @beforeSave()
  public static async hashVerificationCode (session: Session) {
    if (session.$dirty.verificationCode)
      session.verificationCode = await Hash.make(session.$dirty.verificationCode)
  }

  @beforeSave()
  public static async hashAccessToken (session: Session) {
    if (session.$dirty.accessToken)
      session.accessToken = createHash('sha256').update(session.$dirty.accessToken).digest('hex')
  }
}
