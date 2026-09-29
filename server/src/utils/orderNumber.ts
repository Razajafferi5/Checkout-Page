import crypto from 'crypto';

let counter = Math.floor(Math.random() * 100000);

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  counter = (counter + 1) % 900000;
  const num = String(100000 + counter).padStart(6, '0');
  return `PF-${year}-${num}`;
}

export function generatePaymentReference(): string {
  const p1 = crypto.randomBytes(4).toString('hex').toUpperCase();
  const p2 = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `PAY-${p1}-${p2}`;
}
