import { app } from 'electron'
import {join} from 'node:path'
import {
  type Database,
  verbose,
} from 'sqlite3'

// #refer: https://github.com/TryGhost/node-sqlite3/wiki#documentation
let database: Promise<Database>

export const getDB = (filename: string = db): Promise<Database> => {
  return database ??= new Promise<Database>((resolve, reject) => {
    const db = new (verbose().Database)(filename, error => error?reject(error):resolve(db))
  })
}

export const initDB = (): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    getDB().then((db: Database) => {
      db.exec(ddl, (err: Error|null) => {
        err && reject(err)
        resolve(true)
      })
    }).catch(err => reject(err))
  })
}

const db = join(app.getPath('userData'), 'arrietti.dat')

const ddl: string = `
create table if not exists arrietti_category (
  id integer primary key autoincrement,
  title char(16) not null,
  num_order integer not null default 0,
  created_at char(20) not null default '',
  updated_at char(20) not null default ''
);
create table if not exists arrietti_ele (
  id integer primary key autoincrement,
  title text not null,
  desc text not null default '',
  category_id integer not null default 0,
  category_title char(16) not null default '',
  keywords text not null default '',
  link_logo varchar(256) not null default '',
  link varchar(256) not null default '',
  link_origin varchar(64) not null default '',
  num_order integer not null default 0,
  is_accessible integer not null default 1,
  created_at char(20) not null default '',
  updated_at char(20) not null default ''
);
`