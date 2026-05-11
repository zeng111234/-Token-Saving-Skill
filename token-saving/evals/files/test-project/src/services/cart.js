const { calculateTotal } = require('../utils/math');

class CartService {
  constructor(db, logger) {
    this.db = db;
    this.logger = logger;
  }

  async getCart(userId) {
    const cart = await this.db.findCart(userId);
    return cart || { userId, items: [] };
  }

  async addItem(userId, item) {
    const cart = await this.getCart(userId);
    const existing = cart.items.find(i => i.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.items.push(item);
    }
    await this.db.saveCart(cart);
    return cart;
  }

  async removeItem(userId, productId) {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter(i => i.productId !== productId);
    await this.db.saveCart(cart);
    return cart;
  }

  async getCartTotal(userId) {
    const cart = await this.getCart(userId);
    return calculateTotal(cart.items);
  }

  async clearCart(userId) {
    await this.db.saveCart({ userId, items: [] });
  }
}

module.exports = CartService;