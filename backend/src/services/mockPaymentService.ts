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

export function processMockPayment(input: PaymentInput): PaymentResult {
  const paymentId = `mock_pay_${crypto.randomBytes(12).toString("hex")}`;

  if (input.cardNumber.replace(/\s/g, "") === "4000000000000002") {
    return {
      success: false,
      paymentId,
      message: "Card declined (simulated failure for testing)",
    };
  }

  return {
    success: true,
    paymentId,
    message: "Payment successful (simulated sandbox transaction)",
  };
}
