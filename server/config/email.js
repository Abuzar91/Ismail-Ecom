import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const { customerInfo, items, totalAmount, orderNumber, paymentMethod } = orderData;
    
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid rgba(212, 175, 55, 0.15);">
          <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
            <tr>
              <td style="width: 60px;">
                <img src="${item.productSnapshot.image || 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=80'}" 
                     alt="${item.productSnapshot.name}" 
                     style="width: 50px; height: 50px; object-fit: cover; border: 1px solid rgba(212, 175, 55, 0.3);">
              </td>
              <td>
                <div style="color: #F5F5DC; font-size: 14px; font-weight: 600; margin-bottom: 4px;">${item.productSnapshot.name}</div>
                <div style="color: #9CA3AF; font-size: 12px;">Qty: ${item.quantity}</div>
              </td>
              <td style="text-align: right; color: #D4AF37; font-weight: bold; font-size: 15px;">
                Rs. ${(item.price * item.quantity).toLocaleString()}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `).join('');

    const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Noir Essence</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #000000;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #000000;">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #1a1a1a;">
                
                <!-- Gold Top Line -->
                <tr>
                  <td style="height: 2px; background: linear-gradient(to right, transparent, #D4AF37, transparent);"></td>
                </tr>
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #000000, #2d2d2d, #000000); padding: 35px 30px; text-align: center; border-bottom: 1px solid rgba(212, 175, 55, 0.2);">
                    <h1 style="color: #F5F5DC; margin: 0 0 8px 0; font-size: 36px; font-family: Georgia, serif; letter-spacing: 1px;">Noir Essence</h1>
                    <div style="width: 60px; height: 1px; background: #D4AF37; margin: 12px auto;"></div>
                    <p style="color: #D4AF37; margin: 0; font-size: 13px; letter-spacing: 2px;">ORDER CONFIRMED</p>
                  </td>
                </tr>

                <!-- Greeting -->
                <tr>
                  <td style="padding: 30px; background-color: #2d2d2d; text-align: center;">
                    <h2 style="color: #F5F5DC; margin: 0 0 10px 0; font-size: 22px; font-family: Georgia, serif;">Thank You, ${customerInfo.fullName}!</h2>
                    <p style="color: #9CA3AF; margin: 0; font-size: 14px;">Your order has been confirmed and is being prepared.</p>
                  </td>
                </tr>

                <!-- Order Info -->
                <tr>
                  <td style="padding: 25px 30px; background-color: #2d2d2d;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #000000; border: 1px solid rgba(212, 175, 55, 0.3);">
                      <tr>
                        <td style="padding: 20px;">
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="padding: 8px 0; color: #9CA3AF; font-size: 13px;">Order Number</td>
                              <td style="padding: 8px 0; text-align: right; color: #D4AF37; font-weight: bold; font-family: Georgia, serif;">${orderNumber}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; border-top: 1px solid rgba(212, 175, 55, 0.15); color: #9CA3AF; font-size: 13px;">Payment</td>
                              <td style="padding: 8px 0; border-top: 1px solid rgba(212, 175, 55, 0.15); text-align: right; color: #F5F5DC; font-weight: 600;">${paymentMethod.toUpperCase()}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; border-top: 1px solid rgba(212, 175, 55, 0.15); color: #9CA3AF; font-size: 13px;">Date</td>
                              <td style="padding: 8px 0; border-top: 1px solid rgba(212, 175, 55, 0.15); text-align: right; color: #F5F5DC; font-size: 13px;">${new Date().toLocaleDateString('en-PK')}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Items -->
                <tr>
                  <td style="padding: 0 30px 25px 30px; background-color: #2d2d2d;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #000000; border: 1px solid rgba(212, 175, 55, 0.3);">
                      <tr>
                        <td style="padding: 15px 20px; border-bottom: 1px solid rgba(212, 175, 55, 0.3);">
                          <span style="color: #D4AF37; font-size: 14px; font-weight: bold; letter-spacing: 1px;">YOUR ORDER</span>
                        </td>
                      </tr>
                      ${itemsHtml}
                      <tr>
                        <td style="padding: 20px; background-color: rgba(212, 175, 55, 0.05); border-top: 2px solid #D4AF37;">
                          <table cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                              <td style="color: #F5F5DC; font-size: 16px; font-weight: 600;">Total</td>
                              <td style="text-align: right; color: #D4AF37; font-size: 24px; font-weight: bold; font-family: Georgia, serif;">Rs. ${totalAmount.toLocaleString()}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                ${paymentMethod === 'cod' ? `
                <!-- COD Notice -->
                <tr>
                  <td style="padding: 0 30px 25px 30px; background-color: #2d2d2d;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3);">
                      <tr>
                        <td style="padding: 18px; text-align: center;">
                          <div style="color: #D4AF37; font-weight: bold; font-size: 14px; margin-bottom: 5px;">💰 Cash on Delivery</div>
                          <div style="color: #F5F5DC; font-size: 13px;">Pay when you receive your order</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : `
                <!-- Payment Instructions -->
                <tr>
                  <td style="padding: 0 30px 25px 30px; background-color: #2d2d2d;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3);">
                      <tr>
                        <td style="padding: 18px; text-align: center;">
                          <div style="color: #D4AF37; font-weight: bold; font-size: 14px; margin-bottom: 5px;">📱 Payment Pending</div>
                          <div style="color: #F5F5DC; font-size: 13px;">Send payment screenshot to WhatsApp: <span style="color: #D4AF37;">+92-300-1234567</span></div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                `}

                <!-- Shipping Address -->
                <tr>
                  <td style="padding: 0 30px 25px 30px; background-color: #2d2d2d;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #000000; border: 1px solid rgba(212, 175, 55, 0.3);">
                      <tr>
                        <td style="padding: 20px;">
                          <div style="color: #D4AF37; font-size: 14px; font-weight: bold; margin-bottom: 12px; letter-spacing: 1px;">DELIVERY ADDRESS</div>
                          <div style="color: #F5F5DC; font-size: 14px; line-height: 1.6;">
                            <div style="font-weight: 600; margin-bottom: 5px;">${customerInfo.fullName}</div>
                            <div style="color: #9CA3AF; font-size: 13px;">${customerInfo.address.street}</div>
                            <div style="color: #9CA3AF; font-size: 13px;">${customerInfo.address.city}, ${customerInfo.address.state || ''} ${customerInfo.address.zipCode || ''}</div>
                            <div style="color: #D4AF37; margin-top: 8px; font-size: 13px;">📞 ${customerInfo.phone}</div>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Support -->
                <tr>
                  <td style="padding: 0 30px 25px 30px; background-color: #2d2d2d;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #1a1a1a, #2d2d2d); border: 1px solid rgba(212, 175, 55, 0.3);">
                      <tr>
                        <td style="padding: 25px; text-align: center;">
                          <div style="font-size: 28px; margin-bottom: 10px;">💬</div>
                          <h3 style="color: #F5F5DC; margin: 0 0 8px 0; font-size: 18px; font-family: Georgia, serif;">Need Help?</h3>
                          <p style="color: #9CA3AF; margin: 0 0 15px 0; font-size: 13px;">Contact us on WhatsApp</p>
                          <a href="https://wa.me/923001234567" 
                             style="background: linear-gradient(135deg, #D4AF37, #F4D03F); color: #000000; padding: 12px 30px; text-decoration: none; display: inline-block; font-weight: bold; font-size: 13px; letter-spacing: 1px;">
                            +92-300-1234567
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: linear-gradient(135deg, #000000, #1a1a1a); padding: 30px; text-align: center; border-top: 1px solid rgba(212, 175, 55, 0.3);">
                    <h2 style="color: #F5F5DC; margin: 0 0 8px 0; font-size: 24px; font-family: Georgia, serif;">Noir Essence</h2>
                    <div style="width: 50px; height: 1px; background: #D4AF37; margin: 10px auto;"></div>
                    <p style="color: #D4AF37; margin: 0 0 5px 0; font-size: 11px; letter-spacing: 2px;">THE ART OF TIMELESS ELEGANCE</p>
                    <p style="color: #9CA3AF; margin: 15px 0 0 0; font-size: 11px;">© ${new Date().getFullYear()} Noir Essence. All rights reserved.</p>
                  </td>
                </tr>

                <!-- Gold Bottom Line -->
                <tr>
                  <td style="height: 2px; background: linear-gradient(to right, transparent, #D4AF37, transparent);"></td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Noir Essence" <${process.env.EMAIL_USER}>`,
      to: customerInfo.email,
      subject: `Order Confirmation - ${orderNumber} | Noir Essence`,
      html: emailTemplate
    };

    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully');
    
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default transporter;