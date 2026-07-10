import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('dev.db');

db.serialize(() => {
  const queries = [
    "ALTER TABLE user ADD COLUMN profile_picture TEXT DEFAULT 'default_profile.webp'",
    "ALTER TABLE user ADD COLUMN password_hash TEXT",
    "ALTER TABLE user ADD COLUMN is_admin BOOLEAN DEFAULT 0",
    "ALTER TABLE user ADD COLUMN is_driver BOOLEAN DEFAULT 0",
    "ALTER TABLE user ADD COLUMN saved_phone TEXT",
    "ALTER TABLE user ADD COLUMN is_verified BOOLEAN DEFAULT 0",
    "ALTER TABLE user ADD COLUMN verification_code TEXT",
    "ALTER TABLE user ADD COLUMN verification_code_expires_at DATETIME"
  ];

  queries.forEach(q => {
    db.run(q, (err) => {
      if (err) {
        console.log(`Failed (might exist): ${q}`);
      } else {
        console.log(`Success: ${q}`);
      }
    });
  });
});

db.close();
