import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('prisma/dev.db');

db.all("SELECT sql FROM sqlite_master WHERE type='table';", (err, rows) => {
  if (err) throw err;
  rows.forEach(r => console.log(r.sql));
});

db.close();
