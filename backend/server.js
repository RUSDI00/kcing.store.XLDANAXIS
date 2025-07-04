const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// AUTH ROUTES
// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, full_name, phone, address } = req.body;

    if (!username || !email || !password || !full_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (row) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }

      // Hash password and create user
      const hashedPassword = bcrypt.hashSync(password, 10);
      db.run(
        'INSERT INTO users (username, email, password, full_name, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
        [username, email, hashedPassword, full_name, phone, address],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
          }

          const token = jwt.sign(
            { id: this.lastID, username, role: 'user' },
            JWT_SECRET,
            { expiresIn: '24h' }
          );

          res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: this.lastID, username, email, full_name, role: 'user' }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if user is suspended
      if (user.status === 'suspended') {
        return res.status(403).json({ error: 'Account suspended. Please contact administrator.' });
      }

      if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            phone: user.phone,
            address: user.address,
            role: user.role,
            avatar: user.avatar
          }
        });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  db.get('SELECT id, username, email, full_name, phone, address, role, avatar FROM users WHERE id = ?', 
    [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  });
});

// USER PROFILE ROUTES
// Update profile
app.put('/api/users/profile', authenticateToken, (req, res) => {
  try {
    const { username, email, full_name, phone, address, currentPassword, newPassword } = req.body;
    
    console.log('Profile update request:', req.body);

    // If changing password, verify current password first
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to change password' });
      }

      // Get current user data to verify password
      db.get('SELECT password FROM users WHERE id = ?', [req.user.id], (err, user) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (!user || !bcrypt.compareSync(currentPassword, user.password)) {
          return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Update with new password
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        db.run(
          'UPDATE users SET username = ?, email = ?, full_name = ?, phone = ?, address = ?, password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [username, email, full_name, phone, address, hashedPassword, req.user.id],
          function(err) {
            if (err) {
              console.error('Profile update error:', err);
              return res.status(500).json({ error: 'Failed to update profile' });
            }
            
            // Get updated user data
            db.get('SELECT id, username, email, full_name, phone, address, role, avatar FROM users WHERE id = ?', [req.user.id], (err, updatedUser) => {
              if (err) {
                return res.status(500).json({ error: 'Failed to fetch updated user' });
              }
              res.json({ message: 'Profile updated successfully', user: updatedUser });
            });
          }
        );
      });
    } else {
      // Update without password change
      db.run(
        'UPDATE users SET username = ?, email = ?, full_name = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [username, email, full_name, phone, address, req.user.id],
        function(err) {
          if (err) {
            console.error('Profile update error:', err);
            return res.status(500).json({ error: 'Failed to update profile' });
          }
          
          // Get updated user data
          db.get('SELECT id, username, email, full_name, phone, address, role, avatar FROM users WHERE id = ?', [req.user.id], (err, updatedUser) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to fetch updated user' });
            }
            res.json({ message: 'Profile updated successfully', user: updatedUser });
          });
        }
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload avatar
app.post('/api/user/avatar', authenticateToken, upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const avatarPath = `/uploads/${req.file.filename}`;
    
    db.run(
      'UPDATE users SET avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [avatarPath, req.user.id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to update avatar' });
        }
        res.json({ message: 'Avatar updated successfully', avatar: avatarPath });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// VOUCHER ROUTES
// Get all active vouchers
app.get('/api/vouchers', (req, res) => {
  db.all(
    'SELECT id, code, discount_type, discount_value, min_purchase, max_usage, current_usage, expires_at FROM vouchers WHERE is_active = 1 AND (expires_at IS NULL OR expires_at > datetime("now"))',
    [],
    (err, vouchers) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ vouchers });
    }
  );
});

// Validate voucher
app.post('/api/vouchers/validate', (req, res) => {
  try {
    const { code, amount } = req.body;

    console.log('Voucher validation request:', { code, amount });

    if (!code || !amount) {
      return res.status(400).json({ error: 'Voucher code and amount required' });
    }

    db.get(
      'SELECT * FROM vouchers WHERE code = ? AND is_active = 1 AND (expires_at IS NULL OR expires_at > datetime("now"))',
      [code],
      (err, voucher) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        if (!voucher) {
          console.log('Voucher not found or expired:', code);
          return res.status(404).json({ error: 'Invalid or expired voucher' });
        }

        console.log('Found voucher:', voucher);

        if (voucher.max_usage && voucher.current_usage >= voucher.max_usage) {
          return res.status(400).json({ error: 'Voucher usage limit reached' });
        }

        if (amount < voucher.min_purchase) {
          return res.status(400).json({ 
            error: `Minimum purchase amount is Rp ${voucher.min_purchase.toLocaleString()}` 
          });
        }

        let discount = 0;
        if (voucher.discount_type === 'percentage') {
          discount = Math.min(amount * (voucher.discount_value / 100), amount);
        } else {
          discount = Math.min(voucher.discount_value, amount);
        }

        const finalAmount = Math.max(0, amount - discount);

        console.log('Voucher validation successful:', { discount, finalAmount });

        res.json({
          valid: true,
          voucher: {
            code: voucher.code,
            discount_type: voucher.discount_type,
            discount_value: voucher.discount_value
          },
          original_amount: amount,
          discount_amount: discount,
          final_amount: finalAmount
        });
      }
    );
  } catch (error) {
    console.error('Voucher validation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// TRANSACTION ROUTES
// Create transaction
app.post('/api/transactions', authenticateToken, (req, res) => {
  try {
    const { product_id, product_title, product_data_size, original_price, voucher_code, discount_amount, final_price, phone_number, qris_data, payment_method } = req.body;

    if (!product_id || !product_title || !original_price || !final_price || !phone_number) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    db.run(
      'INSERT INTO transactions (user_id, product_id, product_title, product_data_size, original_price, voucher_code, discount_amount, final_price, phone_number, qris_data, payment_method, payment_confirmed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)',
      [req.user.id, product_id, product_title, product_data_size, original_price, voucher_code, discount_amount || 0, final_price, phone_number, qris_data, payment_method || 'qris'],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create transaction' });
        }

        // Update voucher usage count if voucher was used
        if (voucher_code) {
          db.run('UPDATE vouchers SET current_usage = current_usage + 1 WHERE code = ?', [voucher_code]);
        }

        res.status(201).json({
          message: 'Transaction created successfully',
          transaction_id: this.lastID
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload payment proof
app.post('/api/transactions/:id/payment-proof', authenticateToken, upload.single('payment_proof'), (req, res) => {
  try {
    const transactionId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const proofPath = `/uploads/${req.file.filename}`;

    db.run(
      'UPDATE transactions SET payment_proof = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [proofPath, transactionId, req.user.id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to upload payment proof' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json({ message: 'Payment proof uploaded successfully', payment_proof: proofPath });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user transactions
app.get('/api/transactions', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM transactions WHERE user_id = ? AND payment_confirmed = 1 ORDER BY created_at DESC',
    [req.user.id],
    (err, transactions) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(transactions); // Return array directly for consistency
    }
  );
});

// Update WhatsApp confirmation status
app.put('/api/transactions/:id/confirm-whatsapp', authenticateToken, (req, res) => {
  try {
    const transactionId = req.params.id;

    db.run(
      'UPDATE transactions SET whatsapp_confirmed = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [transactionId, req.user.id],
      function(err) {
        if (err) {
          console.error('Error updating WhatsApp confirmation:', err);
          return res.status(500).json({ error: 'Failed to update confirmation status' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json({ message: 'WhatsApp confirmation updated successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark payment as confirmed (when user clicks "Sudah Bayar")
app.put('/api/transactions/:id/confirm-payment', authenticateToken, (req, res) => {
  try {
    const transactionId = req.params.id;

    db.run(
      'UPDATE transactions SET payment_confirmed = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [transactionId, req.user.id],
      function(err) {
        if (err) {
          console.error('Error updating payment confirmation:', err);
          return res.status(500).json({ error: 'Failed to update payment confirmation' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json({ message: 'Payment confirmation updated successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ADMIN ROUTES
// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  db.all(
    'SELECT id, username, email, full_name, phone, role, status, created_at FROM users ORDER BY created_at DESC',
    [],
    (err, users) => {
      if (err) {
        console.error('Database error in /api/admin/users:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      console.log('Users fetched for admin:', users.length);
      res.json(users); // Return users directly, not wrapped in object
    }
  );
});

// Delete user (admin only)
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const userId = req.params.id;

  if (userId === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }

  db.run('DELETE FROM users WHERE id = ? AND role != "admin"', [userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete user' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found or cannot delete admin' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

// Suspend/Unsuspend user (admin only)
app.put('/api/admin/users/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const userId = req.params.id;
  const { status } = req.body;

  if (userId === req.user.id.toString()) {
    return res.status(400).json({ error: 'Cannot change your own status' });
  }

  if (!['active', 'suspended'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be active or suspended' });
  }

  db.run('UPDATE users SET status = ? WHERE id = ? AND role != "admin"', [status, userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update user status' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found or cannot suspend admin' });
    }
    res.json({ message: `User ${status} successfully` });
  });
});

// PRODUCT MANAGEMENT (Admin only)
// Get all products
app.get('/api/admin/products', authenticateToken, requireAdmin, (req, res) => {
  db.all(
    'SELECT * FROM products ORDER BY created_at DESC',
    [],
    (err, products) => {
      if (err) {
        console.error('Database error in /api/admin/products:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      // Convert price to integer to avoid floating point issues
      const processedProducts = products.map(product => ({
        ...product,
        price: Math.round(product.price)
      }));
      res.json(processedProducts);
    }
  );
});

// Update product
app.put('/api/admin/products/:id', authenticateToken, requireAdmin, (req, res) => {
  const productId = req.params.id;
  const { title, data_size, price, is_active } = req.body;

  if (!title || !data_size || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    'UPDATE products SET title = ?, data_size = ?, price = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title, data_size, price, is_active ? 1 : 0, productId],
    function(err) {
      if (err) {
        console.error('Error updating product:', err);
        return res.status(500).json({ error: 'Failed to update product' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product updated successfully' });
    }
  );
});

// Get products for public (active products only)
app.get('/api/products', (req, res) => {
  db.all(
    'SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC',
    [],
    (err, products) => {
      if (err) {
        console.error('Database error in /api/products:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      // Convert price to integer to avoid floating point issues
      const processedProducts = products.map(product => ({
        ...product,
        price: Math.round(product.price)
      }));
      res.json(processedProducts);
    }
  );
});

// Get all transactions (admin only)
app.get('/api/admin/transactions', authenticateToken, requireAdmin, (req, res) => {
  db.all(
    `SELECT t.id, t.user_id, t.product_title as product_name, t.final_price as amount, 
     t.voucher_code, t.payment_method,
     CASE 
       WHEN t.status = 'verified' THEN 'confirmed'
       WHEN t.status = 'rejected' THEN 'cancelled'
       ELSE t.status 
     END as status, 
     t.payment_proof, t.created_at, 
     COALESCE(t.customer_name, u.username) as username,
     u.email 
     FROM transactions t 
     LEFT JOIN users u ON t.user_id = u.id 
     WHERE t.payment_confirmed = 1 OR t.user_id IS NULL
     ORDER BY t.created_at DESC`,
    [],
    (err, transactions) => {
      if (err) {
        console.error('Database error in /api/admin/transactions:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      console.log('Transactions fetched for admin:', transactions.length);
      res.json(transactions); // Return transactions directly
    }
  );
});

// Update transaction status (admin only)
app.put('/api/admin/transactions/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const transactionId = req.params.id;
    const { status, admin_notes } = req.body;

    if (!['pending', 'verified', 'rejected', 'completed', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Map frontend status to database status
    let dbStatus = status;
    if (status === 'confirmed') dbStatus = 'verified';
    if (status === 'cancelled') dbStatus = 'rejected';

    db.run(
      'UPDATE transactions SET status = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [dbStatus, admin_notes, transactionId],
      function(err) {
        if (err) {
          console.error('Error updating transaction:', err);
          return res.status(500).json({ error: 'Failed to update transaction' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json({ message: 'Transaction updated successfully', status: dbStatus });
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create voucher (admin only)
app.post('/api/admin/vouchers', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { code, discount_type, discount_value, min_purchase, max_usage, expires_at } = req.body;

    if (!code || !discount_type || !discount_value) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    db.run(
      'INSERT INTO vouchers (code, discount_type, discount_value, min_purchase, max_usage, expires_at, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [code, discount_type, discount_value, min_purchase || 0, max_usage, expires_at, req.user.id],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Voucher code already exists' });
          }
          return res.status(500).json({ error: 'Failed to create voucher' });
        }
        res.status(201).json({ message: 'Voucher created successfully', voucher_id: this.lastID });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all vouchers (admin only)
app.get('/api/admin/vouchers', authenticateToken, requireAdmin, (req, res) => {
  db.all(
    'SELECT * FROM vouchers ORDER BY created_at DESC',
    [],
    (err, vouchers) => {
      if (err) {
        console.error('Database error in /api/admin/vouchers:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      console.log('Vouchers fetched for admin:', vouchers.length);
      res.json(vouchers); // Return vouchers directly
    }
  );
});

// Update voucher (admin only)
app.put('/api/admin/vouchers/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const voucherId = req.params.id;
    const { code, discount_type, discount_value, min_purchase, max_usage, expires_at, is_active } = req.body;

    // If only is_active is provided, just toggle the status
    if (Object.keys(req.body).length === 1 && 'is_active' in req.body) {
      db.run(
        'UPDATE vouchers SET is_active = ? WHERE id = ?',
        [is_active, voucherId],
        function(err) {
          if (err) {
            console.error('Error toggling voucher status:', err);
            return res.status(500).json({ error: 'Failed to update voucher status' });
          }
          if (this.changes === 0) {
            return res.status(404).json({ error: 'Voucher not found' });
          }
          res.json({ message: 'Voucher status updated successfully' });
        }
      );
      return;
    }

    // Full voucher update
    if (!discount_type || !discount_value) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    db.run(
      'UPDATE vouchers SET code = ?, discount_type = ?, discount_value = ?, min_purchase = ?, max_usage = ?, expires_at = ?, is_active = ? WHERE id = ?',
      [code, discount_type, discount_value, min_purchase || 0, max_usage, expires_at, is_active !== undefined ? is_active : 1, voucherId],
      function(err) {
        if (err) {
          console.error('Error updating voucher:', err);
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Voucher code already exists' });
          }
          return res.status(500).json({ error: 'Failed to update voucher' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Voucher not found' });
        }
        res.json({ message: 'Voucher updated successfully' });
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete voucher (admin only)
app.delete('/api/admin/vouchers/:id', authenticateToken, requireAdmin, (req, res) => {
  const voucherId = req.params.id;

  db.run('DELETE FROM vouchers WHERE id = ?', [voucherId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete voucher' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Voucher not found' });
    }
    res.json({ message: 'Voucher deleted successfully' });
  });
});

// Delete transaction (admin only)
app.delete('/api/admin/transactions/:id', authenticateToken, requireAdmin, (req, res) => {
  const transactionId = req.params.id;

  db.run('DELETE FROM transactions WHERE id = ?', [transactionId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete transaction' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  });
});

// Create manual transaction (admin only)
app.post('/api/admin/transactions/manual', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { customer_name, product_name, amount, voucher_code, status } = req.body;
    
    console.log('Manual transaction request:', req.body);

    if (!customer_name || !product_name || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create manual transaction without user_id (set as NULL for manual entries)
    db.run(
      'INSERT INTO transactions (user_id, product_id, product_title, product_data_size, original_price, final_price, phone_number, voucher_code, status, customer_name, payment_confirmed, whatsapp_confirmed, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
      [null, 1, product_name, 'Manual Entry', amount, amount, 'Manual Entry', voucher_code || null, status === 'confirmed' ? 'verified' : status, customer_name, 1, 1],
      function(err) {
        if (err) {
          console.error('Error creating manual transaction:', err);
          console.error('SQL Error details:', err.message);
          return res.status(500).json({ error: 'Failed to create transaction: ' + err.message });
        }
        console.log('Manual transaction created successfully with ID:', this.lastID);
        res.status(201).json({ message: 'Manual transaction created successfully', transaction_id: this.lastID });
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// ============== EXTENSIONS ENDPOINTS (Perpanjangan) ==============

// Get all extensions (admin only)
app.get('/api/admin/extensions', authenticateToken, requireAdmin, (req, res) => {
  db.all(
    'SELECT * FROM extensions ORDER BY expiry_date ASC',
    [],
    (err, extensions) => {
      if (err) {
        console.error('Database error in /api/admin/extensions:', err);
        return res.status(500).json({ error: 'Failed to fetch extensions' });
      }
      res.json(extensions);
    }
  );
});

// Create new extension (admin only)
app.post('/api/admin/extensions', authenticateToken, requireAdmin, (req, res) => {
  const { phone_number, expiry_date, user_name, amount, quota_type } = req.body;

  if (!phone_number || !expiry_date || !user_name || !amount || !quota_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!['L', 'XL', 'XXL'].includes(quota_type)) {
    return res.status(400).json({ error: 'Invalid quota type' });
  }

  db.run(
    'INSERT INTO extensions (phone_number, expiry_date, user_name, amount, quota_type) VALUES (?, ?, ?, ?, ?)',
    [phone_number, expiry_date, user_name, amount, quota_type],
    function(err) {
      if (err) {
        console.error('Error creating extension:', err);
        return res.status(500).json({ error: 'Failed to create extension' });
      }

      // Return the created extension
      db.get(
        'SELECT * FROM extensions WHERE id = ?',
        [this.lastID],
        (err, extension) => {
          if (err) {
            console.error('Error fetching created extension:', err);
            return res.status(500).json({ error: 'Extension created but failed to fetch' });
          }
          res.status(201).json(extension);
        }
      );
    }
  );
});

// Update extension (admin only)
app.put('/api/admin/extensions/:id', authenticateToken, requireAdmin, (req, res) => {
  const extensionId = req.params.id;
  const { phone_number, expiry_date, user_name, amount, quota_type } = req.body;

  if (!phone_number || !expiry_date || !user_name || !amount || !quota_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!['L', 'XL', 'XXL'].includes(quota_type)) {
    return res.status(400).json({ error: 'Invalid quota type' });
  }

  db.run(
    'UPDATE extensions SET phone_number = ?, expiry_date = ?, user_name = ?, amount = ?, quota_type = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [phone_number, expiry_date, user_name, amount, quota_type, extensionId],
    function(err) {
      if (err) {
        console.error('Error updating extension:', err);
        return res.status(500).json({ error: 'Failed to update extension' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Extension not found' });
      }

      // Return the updated extension
      db.get(
        'SELECT * FROM extensions WHERE id = ?',
        [extensionId],
        (err, extension) => {
          if (err) {
            console.error('Error fetching updated extension:', err);
            return res.status(500).json({ error: 'Extension updated but failed to fetch' });
          }
          res.json(extension);
        }
      );
    }
  );
});

// Delete extension (admin only)
app.delete('/api/admin/extensions/:id', authenticateToken, requireAdmin, (req, res) => {
  const extensionId = req.params.id;

  db.run(
    'DELETE FROM extensions WHERE id = ?',
    [extensionId],
    function(err) {
      if (err) {
        console.error('Error deleting extension:', err);
        return res.status(500).json({ error: 'Failed to delete extension' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Extension not found' });
      }
      res.json({ message: 'Extension deleted successfully' });
    }
  );
});

// Get extensions expiring soon (admin only)
app.get('/api/admin/extensions/expiring-soon', authenticateToken, requireAdmin, (req, res) => {
  const daysFromNow = req.query.days || 7; // Default to 7 days
  
  db.all(
    `SELECT * FROM extensions 
     WHERE date(expiry_date) <= date('now', '+${daysFromNow} days') 
     AND date(expiry_date) >= date('now')
     ORDER BY expiry_date ASC`,
    [],
    (err, extensions) => {
      if (err) {
        console.error('Database error in /api/admin/extensions/expiring-soon:', err);
        return res.status(500).json({ error: 'Failed to fetch expiring extensions' });
      }
      res.json(extensions);
    }
  );
});

// Get expired extensions (admin only)
app.get('/api/admin/extensions/expired', authenticateToken, requireAdmin, (req, res) => {
  db.all(
    `SELECT * FROM extensions 
     WHERE date(expiry_date) < date('now')
     ORDER BY expiry_date DESC`,
    [],
    (err, extensions) => {
      if (err) {
        console.error('Database error in /api/admin/extensions/expired:', err);
        return res.status(500).json({ error: 'Failed to fetch expired extensions' });
      }
      res.json(extensions);
    }
  );
});

// ============== END EXTENSIONS ENDPOINTS ==============

// Get products for public (active products only)
app.get('/api/products', (req, res) => {
  db.all(
    'SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC',
    [],
    (err, products) => {
      if (err) {
        console.error('Database error in /api/products:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      // Convert price to integer to avoid floating point issues
      const processedProducts = products.map(product => ({
        ...product,
        price: Math.round(product.price)
      }));
      res.json(processedProducts);
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
