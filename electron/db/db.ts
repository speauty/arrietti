import {resolve} from 'node:path'
import {
  type Database,
  verbose,
} from 'sqlite3'

let database: Promise<Database>

export const getDB = (filename: string = db): Promise<Database> => {
  return database ??= new Promise<Database>((resolve, reject) => {
    const db = new (verbose().Database)(filename, error => error?reject(error):resolve(db))
  })
}

export const initDB = (): Promise<boolean> => {
  return new Promise<boolean>((_resolve, reject) => {
    getDB().then((db: Database) => {
      db.run(ddl, (err: Error|null) => (
        err && reject(err)
      ))
    }).catch(err => reject(err))
  })
}

const db = resolve("arrietti.dat")

const ddl = `
create table if not exists arrietti_ele (
  id integer primary key autoincrement,
  title text not null,
  desc text not null default '',
  link_logo varchar(256) not null default '',
  link varchar(256) not null default '',
  link_origin varchar(64) not null default '',
  num_order integer not null default 0,
  is_accessible integer not null default 1,
  created_at char(20) not null default '',
  updated_at char(20) not null default ''
);
`