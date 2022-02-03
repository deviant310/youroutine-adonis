import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class CreateVerificationsTable extends BaseSchema {
  protected tableName = 'verifications';

  public async up (): Promise<void> {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').notNullable();
      table.string('code', 180).notNullable();
      table.timestamp('expires_at', { useTz: true }).nullable();
      table.timestamp('created_at', { useTz: true }).notNullable();
    });
  }

  public async down (): Promise<void> {
    this.schema.dropTable(this.tableName);
  }
}
