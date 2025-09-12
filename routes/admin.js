const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { User, Store, Rating } = require('../models');
const { Op } = require('sequelize');

router.use(authenticate, authorize('admin'));

// dashboard counts
router.get('/dashboard', async (req,res) => {
  const totalUsers = await User.count();
  const totalStores = await Store.count();
  const totalRatings = await Rating.count();
  res.json({ totalUsers, totalStores, totalRatings });
});

// add new user (admin creates normal user or admin)
router.post('/users', async (req,res) => {
  const { name, email, password, address, role } = req.body;
  const bcrypt = require('bcrypt');
  if (!['user','admin','store_owner'].includes(role)) return res.status(400).json({ message:'invalid role' });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, address, role, password_hash: hash });
  res.json({ user: { id:user.id, name:user.name, email:user.email, role:user.role }});
});

// list users with filters & sorting
router.get('/users', async (req,res) => {
  const { q, role, sortBy='name', order='ASC', page=1, limit=20 } = req.query;
  const where = {};
  if (role) where.role = role;
  if (q) where[Op.or] = [
    { name: { [Op.iLike]: `%${q}%` } },
    { email: { [Op.iLike]: `%${q}%` } },
    { address: { [Op.iLike]: `%${q}%` } }
  ];
  const users = await User.findAndCountAll({
    where, order: [[sortBy, order]], limit: +limit, offset: (page-1)*limit
  });
  res.json(users);
});

// list stores with overall rating
router.get('/stores', async (req,res) => {
  const { q, sortBy='name', order='ASC', page=1, limit=20 } = req.query;
  const where = {};
  if (q) where[Op.or] = [
    { name: { [Op.iLike]: `%${q}%` } },
    { email: { [Op.iLike]: `%${q}%` } },
    { address: { [Op.iLike]: `%${q}%` } }
  ];
  const stores = await Store.findAll({ where, order: [[sortBy, order]], limit: +limit, offset: (page-1)*limit });
  const result = await Promise.all(stores.map(async s => {
    const avg = await Rating.findOne({
      attributes:[[Rating.sequelize.fn('AVG', Rating.sequelize.col('rating')), 'avgRating']],
      where: { storeId: s.id },
      raw: true
    });
    return { store: s, avgRating: avg.avgRating ? parseFloat(avg.avgRating).toFixed(2) : null };
  }));
  res.json(result);
});

module.exports = router;
