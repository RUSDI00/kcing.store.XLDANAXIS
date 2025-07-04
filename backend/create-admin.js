const bcrypt = require('bcryptjs');
const db = require('./database');

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE role = ?', ['admin'], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Username: admin');
      console.log('Email: admin@kcing.store');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
        ['admin', 'admin@kcing.store', hashedPassword, 'Administrator', 'admin'],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    console.log('✅ Admin user created successfully!');
    console.log('Username: admin');
    console.log('Email: admin@kcing.store');
    console.log('Password: admin123');
    console.log('');
    console.log('You can now login to admin dashboard at: http://localhost:3000/admin');

  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

module.exports = { createAdminUser };

// Run if called directly
if (require.main === module) {
  createAdminUser().then(() => {
    process.exit(0);
  });
}
