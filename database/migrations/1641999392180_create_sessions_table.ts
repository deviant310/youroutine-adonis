import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class CreateSessionsTable extends BaseSchema {
  protected tableName = 'sessions';

  public async up (): Promise<void> {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').notNullable();
      table.string('token', 64).notNullable().unique();
      table.enum('token_type', ['bearer']).notNullable();
      table.jsonb('meta').nullable();
      table.timestamps(true, true);
    });
  }

  public async down (): Promise<void> {
    this.schema.dropTable(this.tableName);
  }
}
