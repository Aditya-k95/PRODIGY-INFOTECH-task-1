const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// Database file path
const dbPath = path.resolve(__dirname, '..', 'database.sqlite');

// Initialize SQLite connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database at', dbPath);
  }
});

// Promisified helper methods for clean async/await usage
const query = {
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  },
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

// Initialize tables and seed initial demo accounts if empty
async function initDb() {
  try {
    await query.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE COLLATE NOCASE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        bio TEXT DEFAULT 'Passionate developer building awesome web applications.',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )
    `);

    // Check if demo users exist, if not seed a standard user and an admin user
    const existingUser = await query.get('SELECT id FROM users LIMIT 1');
    if (!existingUser) {
      console.log('🌱 Seeding default demo accounts...');
      
      const adminPassword = await bcrypt.hash('Admin@1234', 10);
      const userPassword = await bcrypt.hash('User@1234', 10);

      await query.run(
        `INSERT INTO users (name, email, password, role, bio) VALUES (?, ?, ?, ?, ?)`,
        ['Admin User', 'admin@example.com', adminPassword, 'admin', 'System Administrator with full access.']
      );

      await query.run(
        `INSERT INTO users (name, email, password, role, bio) VALUES (?, ?, ?, ?, ?)`,
        ['Demo User', 'demo@example.com', userPassword, 'user', 'Demo account exploring the platform features.']
      );

      console.log('✅ Demo accounts seeded successfully:');
      console.log('   👤 Admin: admin@example.com / Admin@1234');
      console.log('   👤 User:  demo@example.com / User@1234');
    }
  } catch (err) {
    console.error('❌ Error initializing database schema:', err);
  }
}

initDb();

module.exports = {
  db,
  query
};
