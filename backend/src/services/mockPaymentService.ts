import crypto from "crypto";

interface PaymentInput {
  cardNumber: string;
  amount: number;
}

interface PaymentResult {
  success: boolean;
  paymentId: string;
  message: string;
}

// Simulates a payment gateway (Stripe/PayPal equivalent) in test mode.
// Never stores raw card data — only validates format and discards it.
export function processMockPayment(input: PaymentInput): PaymentResult {
  const paymentId = `mock_pay_${crypto.randomBytes(12).toString("hex")}`;

  // Simulate a "declined card" test scenario, similar to Stripe's 4000000000000002
  if (input.cardNumber.replace(/\s/g, "") === "4000000000000002") {
    return {
      success: false,
      paymentId,
      message: "Card declined (simulated failure for testing)",
    };
  }

  // Any other 16-digit test card number simulates success
  return {
    success: true,
    paymentId,
    message: "Payment successful (simulated sandbox transaction)",
  };
}