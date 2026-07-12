export interface PricingBreakdown {
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

const TAX_RATE = 0.05;
const DELIVERY_FEE = 3.99;

export function calculatePricing(subtotal: number): PricingBreakdown {
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  const total = Number((subtotal + tax + deliveryFee).toFixed(2));

  return { subtotal: Number(subtotal.toFixed(2)), tax, deliveryFee, total };
}
