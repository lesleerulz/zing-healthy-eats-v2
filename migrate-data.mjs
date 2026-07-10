import sqlite3 from 'sqlite3';
import fs from 'fs';

const oldDb = new sqlite3.Database('prisma/dev.db');
const newDb = new sqlite3.Database('prisma/new_dev.db');

oldDb.serialize(() => {
  newDb.serialize(() => {
    // Migrate categories
    oldDb.all("SELECT * FROM category", (err, rows) => {
      if (err) return console.error(err);
      rows.forEach(row => {
        newDb.run("INSERT INTO category (id, name) VALUES (?, ?)", [row.id, row.name]);
      });
      console.log(`Migrated ${rows.length} categories.`);
    });

    // Migrate products
    oldDb.all("SELECT * FROM product", (err, rows) => {
      if (err) return console.error(err);
      rows.forEach(row => {
        newDb.run(
          "INSERT INTO product (id, date_added, title, description, image, price, original_price, quantity, category_id, is_peoples_choice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [row.id, row.date_added, row.title, row.description, row.image, row.price, row.original_price, row.quantity, row.category_id, row.is_peoples_choice]
        );
      });
      console.log(`Migrated ${rows.length} products.`);
    });

    // Migrate carousel images
    oldDb.all("SELECT * FROM carousel_image", (err, rows) => {
      if (err) return console.error(err);
      rows.forEach(row => {
        newDb.run("INSERT INTO carousel_image (id, image_filename, created_at) VALUES (?, ?, ?)", [row.id, row.image_filename, row.created_at]);
      });
      console.log(`Migrated ${rows.length} carousel images.`);
    });
  });
});

setTimeout(() => {
  oldDb.close();
  newDb.close();
  console.log("Migration complete.");
}, 2000);
