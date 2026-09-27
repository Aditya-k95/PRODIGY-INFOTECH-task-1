const { query } = require('../config/db');

const UserModel = {
  // Find a user by their email (case-insensitive)
  async findByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = ? LIMIT 1`;
    return await query.get(sql, [email.trim().toLowerCase()]);
  },

  // Find a user by their unique ID (excluding password hash)
  async findById(id) {
    const sql = `SELECT id, name, email, role, bio, created_at, last_login FROM users WHERE id = ?`;
    return await query.get(sql, [id]);
  },

  // Find a user by ID including password (for password updates)
  async findByIdWithPassword(id) {
    const sql = `SELECT * FROM users WHERE id = ?`;
    return await query.get(sql, [id]);
  },

  // Create a new user account
  async create({ name, email, password, role = 'user', bio = 'Welcome to my profile!' }) {
    const sql = `
      INSERT INTO users (name, email, password, role, bio)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await query.run(sql, [
      name.trim(),
      email.trim().toLowerCase(),
      password,
      role,
      bio
    ]);
    return { id: result.id, name, email, role, bio };
  },

  // Update profile information
  async updateProfile(id, { name, bio }) {
    const sql = `UPDATE users SET name = ?, bio = ? WHERE id = ?`;
    await query.run(sql, [name.trim(), bio ? bio.trim() : '', id]);
    return this.findById(id);
  },

  // Update user password
  async updatePassword(id, hashedPassword) {
    const sql = `UPDATE users SET password = ? WHERE id = ?`;
    await query.run(sql, [hashedPassword, id]);
  },

  // Update last login timestamp
  async updateLastLogin(id) {
    const sql = `UPDATE users SET last_login = datetime('now') WHERE id = ?`;
    await query.run(sql, [id]);
  },

  // Get all users for admin view (sensitive fields omitted)
  async getAllUsers() {
    const sql = `
      SELECT id, name, email, role, bio, created_at, last_login 
      FROM users 
      ORDER BY created_at DESC
    `;
    return await query.all(sql);
  },

  // Get total user counts & stats
  async getStats() {
    const totalUsers = await query.get(`SELECT COUNT(*) as count FROM users`);
    const adminUsers = await query.get(`SELECT COUNT(*) as count FROM users WHERE role = 'admin'`);
    const recentSignups = await query.all(
      `SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5`
    );
    return {
      totalUsers: totalUsers.count,
      adminUsers: adminUsers.count,
      standardUsers: totalUsers.count - adminUsers.count,
      recentSignups
    };
  }
};

module.exports = UserModel;
