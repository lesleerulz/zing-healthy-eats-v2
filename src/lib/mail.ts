import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SERVER || "",
  port: parseInt(process.env.MAIL_PORT || "587", 10),
  secure: process.env.MAIL_PORT === "465",
  auth: {
    user: process.env.MAIL_USERNAME || "",
    pass: process.env.MAIL_PASSWORD || "",
  },
});

export async function sendInvoiceEmail(userEmail: string, order: any, items: any[]) {
  if (!process.env.MAIL_SERVER) {
    console.warn("Mail server not configured. Skipping invoice email.");
    return;
  }

  const totalAmount = items.reduce((sum: number, item: any) => sum + (item.productPrice * item.quantity), 0);
  const totalWithFee = totalAmount + (order.deliveryFee || 0);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h1 style="color: #D4A373;">Zing Healthy Treats</h1>
      <h2>Thank you for your purchase!</h2>
      <p>Your order (<strong>#${order.paystackReference || order.id}</strong>) has been confirmed and is being processed.</p>
      
      <h3>Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="border-bottom: 2px solid #eee; text-align: left;">
            <th style="padding: 8px 0;">Item</th>
            <th style="padding: 8px 0;">Qty</th>
            <th style="padding: 8px 0; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item: any) => `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 0;">${item.productTitle}</td>
              <td style="padding: 8px 0;">${item.quantity}</td>
              <td style="padding: 8px 0; text-align: right;">KES ${item.productPrice}</td>
            </tr>
          `).join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 8px 0; font-weight: bold;">Delivery Fee</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold;">KES ${order.deliveryFee || 0}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 8px 0; font-weight: bold; font-size: 1.1em;">Total Paid</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; font-size: 1.1em; color: #D4A373;">KES ${totalWithFee}</td>
          </tr>
        </tfoot>
      </table>

      <p><strong>Delivery Address:</strong> ${order.deliveryAddress || "N/A"}</p>
      <p><strong>Phone Number:</strong> ${order.phoneNumber || "N/A"}</p>
      
      <p style="margin-top: 30px; font-size: 0.9em; color: #777;">
        If you have any questions about your order, simply reply to this email!
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Zing Healthy Treats" <${process.env.MAIL_USERNAME}>`,
      to: userEmail,
      subject: `Your Invoice from Zing Healthy Treats (Order #${order.paystackReference || order.id})`,
      html: htmlContent,
    });
    console.log(`Invoice email sent to ${userEmail}`);
  } catch (error) {
    console.error("Failed to send invoice email:", error);
  }
}
