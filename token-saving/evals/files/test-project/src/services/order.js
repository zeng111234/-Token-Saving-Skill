const { calculateTotal, calculateDiscount, calculateTax } = require('../utils/math');

class OrderService {
  constructor(db, logger) {
    this.db = db;
    this.logger = logger;
  }

  async createOrder(userId, items) {
    const total = calculateTotal(items);
    const user = await this.db.findUser(userId);
    const discount = user.isPremium ? 0.1 : 0;
    const discountedTotal = calculateDiscount(total, discount);
    const tax = calculateTax(discountedTotal, 0.08);
    const finalAmount = discountedTotal + tax;

    const order = await this.db.saveOrder({
      userId,
      items,
      subtotal: total,
      discount,
      tax,
      finalAmount,
      status: 'pending'
    });

    this.logger.info(`Order ${order.id} created for user ${userId}`);
    return order;
  }

  async getOrder(orderId) {
    const order = await this.db.findOrder(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    return order;
  }

  async cancelOrder(orderId) {
    const order = await this.getOrder(orderId);
    if (order.status === 'shipped') {
      throw new Error('Cannot cancel shipped order');
    }
    order.status = 'cancelled';
    await this.db.updateOrder(order);
    return order;
  }
}

module.exports = OrderService;