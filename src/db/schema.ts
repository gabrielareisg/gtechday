import { pgTable, serial, text, timestamp, varchar, integer } from 'drizzle-orm/pg-core';

// Tabela de teste
export const teste = pgTable('teste', {
  id: serial('id').primaryKey().notNull(),
  nome: varchar('nome', { length: 255 }).notNull(),
  descricao: text('descricao'),
  dataCriacao: timestamp('data_criacao').defaultNow().notNull(),
});

export const login = pgTable('login', {
  username: varchar('username', { length: 255 }).primaryKey().notNull(),
  password: varchar('password', { length: 10 }).notNull(),
  user_type: integer('user_type').notNull(),
});

export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey().notNull(),
  username: varchar('username', { length: 255 }).notNull(),
  status: varchar('status', { length: 10 }).notNull(),
  priority: integer('priority').notNull(),
  date_created: timestamp('date_created').defaultNow().notNull(),
  description: varchar('description', { length: 4000 }),
  category: varchar('category', { length: 255 }).notNull(),
  last_reply: varchar('last_reply', { length: 4000 }),
  date_updated: timestamp('date_updated').defaultNow(),
  date_finished: timestamp('date_finished')
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey().notNull(),
  user: varchar('user', { length: 255 }).notNull(),
  description: varchar('description', { length: 4000 }).notNull(),
  status: varchar('status', { length: 10 }).notNull(),
  priority: integer('priority').notNull(),
  date_created: timestamp('date_created').defaultNow().notNull(),
  date_updated: timestamp('date_updated').defaultNow(),
  date_delivered: timestamp('date_delivered'),
  date_deadline: timestamp('date_deadline')
});
