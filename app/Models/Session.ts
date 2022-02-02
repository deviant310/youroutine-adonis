import { BaseModel, column, beforeSave } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { createHash } from 'crypto'
export default class Session extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public userId!: number

  @column({ serializeAs: null })
  public accessToken: string | null = null

  @column()
  public meta: object | null = null

  @column.dateTime()
  public expiresAt: DateTime | null = null

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @beforeSave()
  public static async hashAccessToken (session: Session) {
    if (session.$dirty.accessToken)
      session.accessToken = createHash('sha256').update(session.$dirty.accessToken).digest('hex')
  }
}
