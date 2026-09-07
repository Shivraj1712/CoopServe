/**
 * Payment Service Abstraction Layer
 * 
 * PHASE 1 (Current): Mocked payment execution for instant hackathon testing.
 * PHASE 2 (Future): Swap in real Razorpay Node SDK (`razorpay` npm package).
 */

export const paymentService = {
  /**
   * Create Razorpay / Payment Order
   */
  async createOrder({ amount, currency = "INR", receipt }) {
    // PHASE 1: Mocked response
    const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 10)}`;
    console.log(`[MOCK PAYMENT SERVICE] Order created: ${mockOrderId} for amount ₹${amount}`);
    
    return {
      success: true,
      orderId: mockOrderId,
      amount: amount * 100, // paise
      currency,
      receipt
    };

    /* PHASE 2 TODO: Real Razorpay implementation
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    return await razorpay.orders.create({ amount: amount * 100, currency, receipt });
    */
  },

  /**
   * Verify Payment Signature
   */
  async verifyPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    // PHASE 1: Mocked success
    console.log(`[MOCK PAYMENT SERVICE] Payment verified: ${razorpayPaymentId} for order ${razorpayOrderId}`);
    return {
      success: true,
      status: "SUCCESS",
      paymentId: razorpayPaymentId || `pay_mock_${Date.now()}`
    };

    /* PHASE 2 TODO: Real Razorpay signature verification
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
    return { success: expectedSignature === razorpaySignature };
    */
  }
};
