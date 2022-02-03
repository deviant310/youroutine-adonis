import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class CreateUsersTable extends BaseSchema {
  protected tableName = 'users';

  public async up (): Promise<void> {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('phone').unique().notNullable();
      table.string('name').nullable();
      table.string('surname').nullable();
      table.string('patronymic').nullable();
      table.timestamp('created_at', { useTz: true }).notNullable();
      table.timestamp('updated_at', { useTz: true }).notNullable();
    });
  }

  public async down (): Promise<void> {
    this.schema.dropTable(this.tableName);
  }
}
