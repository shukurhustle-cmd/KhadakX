export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone);
};

export const validatePrice = (price: number): boolean => {
  return price > 0 && Number.isFinite(price);
};

export const validateQuantity = (quantity: number): boolean => {
  return quantity > 0 && Number.isInteger(quantity);
};

export const validateOrderStatus = (status: string): boolean => {
  const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
  return validStatuses.includes(status);
};