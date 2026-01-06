/**
 * Email Service (Resend)
 * ======================
 * Transactional emails for orders and bookings
 *
 * Required env vars:
 *   RESEND_API_KEY
 *   EMAIL_FROM (e.g., "Steph's Beauty Box <hello@stephsbeautybox.com>")
 */

import { Resend } from 'resend';
import type { OrderWithItems, BookingWithService } from '@/types/database';
import { formatPrice } from '@/lib/store/cart';

// Configuration check
export const isEmailConfigured = !!(
  process.env.RESEND_API_KEY &&
  process.env.EMAIL_FROM
);

// Initialize Resend (only if configured)
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

/**
 * Get email status for admin display
 */
export function getEmailStatus() {
  return {
    configured: isEmailConfigured,
    apiKeySet: !!process.env.RESEND_API_KEY,
    fromAddressSet: !!process.env.EMAIL_FROM,
    fromAddress: process.env.EMAIL_FROM || 'Not configured',
  };
}

// =============================================================================
// ORDER EMAILS
// =============================================================================

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmation(order: OrderWithItems): Promise<boolean> {
  if (!isEmailConfigured || !resend) {
    console.log('[Email] Skipping order confirmation - email not configured');
    return false;
  }

  const isPickup = order.fulfillment_method === 'pickup';
  const pickupAddress = process.env.PICKUP_ADDRESS || 'Contact us for pickup details';
  const pickupHours = process.env.PICKUP_HOURS || 'Wed-Sun 11am-7pm';

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: order.customer_email,
      subject: `Order Confirmed - #${order.order_number}`,
      html: generateOrderConfirmationHtml(order, { isPickup, pickupAddress, pickupHours }),
    });

    console.log(`[Email] Order confirmation sent: #${order.order_number}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send order confirmation:', error);
    return false;
  }
}

function generateOrderConfirmationHtml(
  order: OrderWithItems,
  options: { isPickup: boolean; pickupAddress: string; pickupHours: string }
): string {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
        <strong>${item.product_title}</strong>
        ${item.variant_title ? `<br><span style="color: #666; font-size: 14px;">${item.variant_title}</span>` : ''}
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; text-align: right;">
        ${formatPrice(item.total_cents)}
      </td>
    </tr>
  `).join('');

  const fulfillmentHtml = options.isPickup
    ? `
      <h3 style="color: #2F4A3B; margin-top: 24px;">Pickup Information</h3>
      <p><strong>Address:</strong> ${options.pickupAddress}</p>
      <p><strong>Hours:</strong> ${options.pickupHours}</p>
      <p style="color: #666; font-size: 14px;">We'll let you know when your order is ready for pickup.</p>
    `
    : `
      <h3 style="color: #2F4A3B; margin-top: 24px;">Shipping To</h3>
      <p>
        ${order.shipping_address_line1}<br>
        ${order.shipping_address_line2 ? order.shipping_address_line2 + '<br>' : ''}
        ${order.shipping_city}, ${order.shipping_state} ${order.shipping_postal_code}
      </p>
    `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2B2A28;">
      <div style="text-align: center; padding: 30px 0; border-bottom: 1px solid #e5e5e5;">
        <h1 style="font-size: 28px; margin: 0; color: #2F4A3B;">Thank You for Your Order</h1>
        <p style="color: #666; margin-top: 10px;">Order #${order.order_number}</p>
      </div>

      ${order.customer_name ? `<p style="margin-top: 30px;">Hi ${order.customer_name},</p>` : ''}

      <p>Thank you for your purchase! We're preparing your order now.</p>

      <h3 style="color: #2F4A3B; margin-top: 30px;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #2F4A3B;">
            <th style="text-align: left; padding: 12px 0;">Item</th>
            <th style="text-align: center; padding: 12px 0;">Qty</th>
            <th style="text-align: right; padding: 12px 0;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <table style="width: 100%; margin-top: 20px;">
        <tr>
          <td style="color: #666;">Subtotal</td>
          <td style="text-align: right;">${formatPrice(order.subtotal_cents)}</td>
        </tr>
        ${order.shipping_cents > 0 ? `
          <tr>
            <td style="color: #666;">Shipping</td>
            <td style="text-align: right;">${formatPrice(order.shipping_cents)}</td>
          </tr>
        ` : ''}
        ${order.tax_cents > 0 ? `
          <tr>
            <td style="color: #666;">Tax</td>
            <td style="text-align: right;">${formatPrice(order.tax_cents)}</td>
          </tr>
        ` : ''}
        <tr style="border-top: 2px solid #2F4A3B;">
          <td style="padding-top: 12px;"><strong>Total</strong></td>
          <td style="text-align: right; padding-top: 12px;"><strong>${formatPrice(order.total_cents)}</strong></td>
        </tr>
      </table>

      ${fulfillmentHtml}

      <div style="margin-top: 40px; padding: 20px; background: #F6F0E6; text-align: center;">
        <p style="margin: 0; color: #666;">Questions about your order?</p>
        <p style="margin: 10px 0 0 0;">Reply to this email or call us.</p>
      </div>

      <p style="text-align: center; color: #999; font-size: 12px; margin-top: 40px;">
        Steph's Beauty Box<br>
        West Park, FL
      </p>
    </body>
    </html>
  `;
}

// =============================================================================
// BOOKING EMAILS
// =============================================================================

/**
 * Send booking confirmation email to customer
 */
export async function sendBookingConfirmation(booking: BookingWithService): Promise<boolean> {
  if (!isEmailConfigured || !resend) {
    console.log('[Email] Skipping booking confirmation - email not configured');
    return false;
  }

  if (!booking.customer_email) {
    console.log('[Email] Skipping booking confirmation - no customer email');
    return false;
  }

  const timezone = process.env.BOOKING_TIMEZONE || 'America/New_York';

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: booking.customer_email,
      subject: `Appointment Confirmed - ${booking.service?.name || 'Your Booking'}`,
      html: generateBookingConfirmationHtml(booking, timezone),
    });

    console.log(`[Email] Booking confirmation sent: ${booking.id}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send booking confirmation:', error);
    return false;
  }
}

function generateBookingConfirmationHtml(booking: BookingWithService, timezone: string): string {
  const startDate = new Date(booking.start_ts);
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const formattedDate = dateFormatter.format(startDate);
  const formattedTime = timeFormatter.format(startDate);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Appointment Confirmed</title>
    </head>
    <body style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2B2A28;">
      <div style="text-align: center; padding: 30px 0; border-bottom: 1px solid #e5e5e5;">
        <h1 style="font-size: 28px; margin: 0; color: #2F4A3B;">Appointment Confirmed</h1>
      </div>

      <p style="margin-top: 30px;">Hi ${booking.customer_name},</p>

      <p>Your appointment has been confirmed! We're looking forward to seeing you.</p>

      <div style="background: #F6F0E6; padding: 24px; margin: 30px 0;">
        <h2 style="margin: 0 0 16px 0; color: #2F4A3B;">${booking.service?.name || 'Appointment'}</h2>
        <p style="margin: 0; font-size: 18px;">
          <strong>${formattedDate}</strong><br>
          at <strong>${formattedTime}</strong>
        </p>
        ${booking.service?.duration_minutes ? `
          <p style="margin: 12px 0 0 0; color: #666;">
            Duration: ~${booking.service.duration_minutes} minutes
          </p>
        ` : ''}
        ${booking.deposit_amount_cents ? `
          <p style="margin: 12px 0 0 0; color: #2F4A3B;">
            Deposit paid: ${formatPrice(booking.deposit_amount_cents)}
          </p>
        ` : ''}
      </div>

      ${booking.customer_notes ? `
        <p><strong>Your notes:</strong> ${booking.customer_notes}</p>
      ` : ''}

      <h3 style="color: #2F4A3B;">Before Your Appointment</h3>
      <ul style="color: #666;">
        <li>Please arrive 5-10 minutes early</li>
        <li>Come with clean, product-free skin/lashes (for applicable services)</li>
        <li>Feel free to bring reference photos</li>
      </ul>

      <h3 style="color: #2F4A3B;">Cancellation Policy</h3>
      <p style="color: #666;">
        Please provide at least 24 hours notice if you need to cancel or reschedule.
        Late cancellations may forfeit the deposit.
      </p>

      <div style="margin-top: 40px; padding: 20px; background: #F6F0E6; text-align: center;">
        <p style="margin: 0; color: #666;">Need to make changes?</p>
        <p style="margin: 10px 0 0 0;">Reply to this email or call us.</p>
      </div>

      <p style="text-align: center; color: #999; font-size: 12px; margin-top: 40px;">
        Steph's Beauty Box<br>
        West Park, FL
      </p>
    </body>
    </html>
  `;
}

/**
 * Send simple booking confirmation (for use in API routes with minimal data)
 */
export async function sendSimpleBookingConfirmation(params: {
  to: string;
  customerName: string;
  serviceName: string;
  dateTime: Date;
  duration: number;
  depositPaid?: number;
}): Promise<boolean> {
  if (!isEmailConfigured || !resend) {
    console.log('[Email] Skipping booking confirmation - email not configured');
    return false;
  }

  const timezone = process.env.BOOKING_TIMEZONE || 'America/New_York';
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const formattedDate = dateFormatter.format(params.dateTime);
  const formattedTime = timeFormatter.format(params.dateTime);

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: params.to,
      subject: `Appointment Confirmed - ${params.serviceName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><title>Appointment Confirmed</title></head>
        <body style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2B2A28;">
          <div style="text-align: center; padding: 30px 0; border-bottom: 1px solid #e5e5e5;">
            <h1 style="font-size: 28px; margin: 0; color: #2F4A3B;">Appointment Confirmed</h1>
          </div>
          <p style="margin-top: 30px;">Hi ${params.customerName},</p>
          <p>Your appointment has been confirmed! We're looking forward to seeing you.</p>
          <div style="background: #F6F0E6; padding: 24px; margin: 30px 0;">
            <h2 style="margin: 0 0 16px 0; color: #2F4A3B;">${params.serviceName}</h2>
            <p style="margin: 0; font-size: 18px;">
              <strong>${formattedDate}</strong><br>
              at <strong>${formattedTime}</strong>
            </p>
            <p style="margin: 12px 0 0 0; color: #666;">Duration: ~${params.duration} minutes</p>
            ${params.depositPaid ? `<p style="margin: 12px 0 0 0; color: #2F4A3B;">Deposit paid: ${formatPrice(params.depositPaid)}</p>` : ''}
          </div>
          <h3 style="color: #2F4A3B;">Before Your Appointment</h3>
          <ul style="color: #666;">
            <li>Please arrive 5-10 minutes early</li>
            <li>Come with clean, product-free skin/lashes (for applicable services)</li>
          </ul>
          <div style="margin-top: 40px; padding: 20px; background: #F6F0E6; text-align: center;">
            <p style="margin: 0; color: #666;">Need to make changes? Reply to this email or call us.</p>
          </div>
          <p style="text-align: center; color: #999; font-size: 12px; margin-top: 40px;">Steph's Beauty Box<br>West Park, FL</p>
        </body>
        </html>
      `,
    });

    console.log(`[Email] Booking confirmation sent to: ${params.to}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send booking confirmation:', error);
    return false;
  }
}

// =============================================================================
// ADMIN ALERTS
// =============================================================================

interface AdminAlertData {
  type: 'inventory_issue' | 'booking_issue' | 'general';
  orderId?: string;
  orderNumber?: number;
  bookingId?: string;
  message: string;
}

/**
 * Send alert email to admin
 */
export async function sendAdminAlert(data: AdminAlertData): Promise<boolean> {
  if (!isEmailConfigured || !resend) {
    console.log('[Email] Skipping admin alert - email not configured');
    return false;
  }

  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;
  if (!adminEmail) {
    console.log('[Email] Skipping admin alert - no admin email configured');
    return false;
  }

  const subjectPrefix = data.type === 'inventory_issue'
    ? '⚠️ Inventory Issue'
    : data.type === 'booking_issue'
    ? '⚠️ Booking Issue'
    : '⚠️ Alert';

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: adminEmail,
      subject: `${subjectPrefix} - Action Required`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: sans-serif; padding: 20px;">
          <h1 style="color: #B88977;">${subjectPrefix}</h1>
          <p><strong>Type:</strong> ${data.type}</p>
          ${data.orderNumber ? `<p><strong>Order:</strong> #${data.orderNumber}</p>` : ''}
          ${data.bookingId ? `<p><strong>Booking ID:</strong> ${data.bookingId}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p style="background: #f5f5f5; padding: 16px;">${data.message}</p>
          <p style="color: #666;">This requires your attention. Please check the admin dashboard.</p>
        </body>
        </html>
      `,
    });

    console.log(`[Email] Admin alert sent: ${data.type}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send admin alert:', error);
    return false;
  }
}
