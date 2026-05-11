const express = require('express');
const router = express.Router();

module.exports = function createRouter(orderService, cartService) {
  router.post('/cart/add', async (req, res) => {
    try {
      const { userId, item } = req.body;
      const cart = await cartService.addItem(userId, item);
      res.json(cart);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/cart/:userId', async (req, res) => {
    try {
      const cart = await cartService.getCart(req.params.userId);
      res.json(cart);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/cart/:userId/total', async (req, res) => {
    try {
      const total = await cartService.getCartTotal(req.params.userId);
      res.json({ total });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/orders', async (req, res) => {
    try {
      const { userId, items } = req.body;
      const order = await orderService.createOrder(userId, items);
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/orders/:orderId', async (req, res) => {
    try {
      const order = await orderService.getOrder(req.params.orderId);
      res.json(order);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  });

  router.post('/orders/:orderId/cancel', async (req, res) => {
    try {
      const order = await orderService.cancelOrder(req.params.orderId);
      res.json(order);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};