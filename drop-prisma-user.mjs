import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('prisma/dev.db');

db.serialize(() => {
  db.run("PRAGMA foreign_keys = OFF;");
  db.run("DROP TABLE IF EXISTS user;");
  db.run("DROP TABLE IF EXISTS cart_item;");
  db.run("DROP TABLE IF EXISTS `order`;");
  console.log("Dropped user tables in prisma/dev.db");
});

db.close();
