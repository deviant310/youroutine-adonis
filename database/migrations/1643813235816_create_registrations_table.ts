import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class CreateRegistrationsTable extends BaseSchema {
  protected tableName = 'registrations';

  public async up (): Promise<void> {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').notNullable();
      table.string('verification_code', 180).notNullable();
      table.timestamp('expires_at').nullable();
      table.timestamps(true, true);
    });
  }

  public async down (): Promise<void> {
    this.schema.dropTable(this.tableName);
  }
}
