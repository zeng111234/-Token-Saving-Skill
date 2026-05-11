const express = require('express');
const config = require('../config.json');
const createRouter = require('./routes/api');
const OrderService = require('./services/order');
const CartService = require('./services/cart');

function createApp(db, logger) {
  const app = express();
  app.use(express.json());

  const orderService = new OrderService(db, logger);
  const cartService = new CartService(db, logger);

  app.use('/api', createRouter(orderService, cartService));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  return app;
}

if (require.main === module) {
  const app = createApp({}, console);
  app.listen(config.server.prot, () => {
    console.log(`Server running on port ${config.server.prot}`);
  });
}

module.exports = createApp;