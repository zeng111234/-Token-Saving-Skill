function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

function subtract(a, b) {
  return a - b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

function calculateTotal(items) {
  return items.reduce((sum, item) => {
    return add(sum, multiply(item.price, item.quantity));
  }, 0);
}

function calculateDiscount(total, discountRate) {
  return multiply(total, subtract(1, discountRate));
}

function calculateTax(amount, taxRate) {
  return multiply(amount, taxRate);
}

module.exports = {
  add,
  multiply,
  subtract,
  divide,
  calculateTotal,
  calculateDiscount,
  calculateTax
};