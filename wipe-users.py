import sqlite3

try:
    conn = sqlite3.connect('dev.db')
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = OFF;")
    cursor.execute("DROP TABLE IF EXISTS user;")
    cursor.execute("DROP TABLE IF EXISTS cart_item;")
    cursor.execute("DROP TABLE IF EXISTS `order`;")
    conn.commit()
    print("Dropped user-related tables successfully.")
except Exception as e:
    print(f"Error: {e}")
finally:
    if conn:
        conn.close()
