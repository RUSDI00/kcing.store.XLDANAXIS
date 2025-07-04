const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'kcing_store.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    role TEXT DEFAULT 'user',
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Vouchers table
  db.run(`CREATE TABLE IF NOT EXISTS vouchers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK(discount_type IN ('percentage', 'fixed')),
    discount_value REAL NOT NULL,
    min_purchase REAL DEFAULT 0,
    max_usage INTEGER DEFAULT NULL,
    current_usage INTEGER DEFAULT 0,
    expires_at DATETIME,
    is_active BOOLEAN DEFAULT 1,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users (id)
  )`);

  // Transactions table
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER NOT NULL,
    product_title TEXT NOT NULL,
    product_data_size TEXT NOT NULL,
    original_price REAL NOT NULL,
    voucher_code TEXT,
    discount_amount REAL DEFAULT 0,
    final_price REAL NOT NULL,
    phone_number TEXT NOT NULL,
    payment_proof TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'verified', 'rejected', 'completed')),
    qris_data TEXT,
    admin_notes TEXT,
    customer_name TEXT,
    payment_confirmed INTEGER DEFAULT 0,
    whatsapp_confirmed INTEGER DEFAULT 0,
    payment_method TEXT DEFAULT 'qris',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // User sessions table
  db.run(`CREATE TABLE IF NOT EXISTS user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Create default admin user
  const adminPassword = bcrypt.hashSync('admin123', 10);
  db.run(`INSERT OR IGNORE INTO users (username, email, password, full_name, role) 
          VALUES ('admin', 'admin@kcing.store', ?, 'Administrator', 'admin')`, [adminPassword]);

  // Create some sample vouchers
  db.run(`INSERT OR IGNORE INTO vouchers (code, discount_type, discount_value, min_purchase, max_usage, expires_at) 
          VALUES 
          ('WELCOME10', 'percentage', 10, 50000, 100, datetime('now', '+30 days')),
          ('SAVE5K', 'fixed', 5000, 30000, 50, datetime('now', '+15 days')),
          ('NEWUSER', 'percentage', 15, 0, 200, datetime('now', '+60 days'))`);

  // Add missing columns if they don't exist (for existing databases)
  db.run(`ALTER TABLE transactions ADD COLUMN payment_confirmed INTEGER DEFAULT 0`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding payment_confirmed column:', err);
    }
  });
  
  db.run(`ALTER TABLE transactions ADD COLUMN whatsapp_confirmed INTEGER DEFAULT 0`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding whatsapp_confirmed column:', err);
    }
  });

  // Add payment_method column to store selected payment method
  db.run(`ALTER TABLE transactions ADD COLUMN payment_method TEXT DEFAULT 'qris'`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding payment_method column:', err);
    }
  });

  // Add user status column for suspend/unsuspend feature
  db.run(`ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active'`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding status column to users:', err);
    }
  });

  // Create products table for admin management
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    data_size TEXT NOT NULL,
    price REAL NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert default products
  db.run(`INSERT OR IGNORE INTO products (id, title, data_size, price) VALUES 
    (1, 'Kuota XL/AXIS 120GB', '120GB', 85000),
    (2, 'Kuota XL/AXIS 71GB', '71GB', 65000),
    (3, 'Kuota XL/AXIS 59GB', '59GB', 60000),
    (4, 'Kuota XL/AXIS 48GB', '48GB', 55000)`);

  // Create extensions table for perpanjangan feature
  db.run(`CREATE TABLE IF NOT EXISTS extensions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone_number TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    user_name TEXT NOT NULL,
    amount REAL NOT NULL,
    quota_type TEXT NOT NULL CHECK(quota_type IN ('L', 'XL', 'XXL')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Update existing manual transactions (where user_id is NULL) to have payment_confirmed = 1
  db.run(`UPDATE transactions SET payment_confirmed = 1, whatsapp_confirmed = 1 WHERE user_id IS NULL AND payment_confirmed = 0`, (err) => {
    if (err) {
      console.error('Error updating manual transactions:', err);
    } else {
      console.log('Updated existing manual transactions to be visible');
    }
  });
});

module.exports = db;
