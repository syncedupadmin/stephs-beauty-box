/**
 * Contact Form API
 * ================
 * Receives contact form submissions and sends email notifications
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Check if email is configured
const isEmailConfigured = !!(
  process.env.RESEND_API_KEY &&
  process.env.EMAIL_FROM
);

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.phone || !body.message) {
      return NextResponse.json(
        { error: 'Name, phone, and message are required' },
        { status: 400 }
      );
    }

    // Basic phone validation
    const phoneDigits = body.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      );
    }

    // If email is not configured, log and return success (graceful degradation)
    if (!isEmailConfigured || !resend) {
      console.log('[Contact] Form submission received (email not configured):');
      console.log(`  Name: ${body.name}`);
      console.log(`  Phone: ${body.phone}`);
      console.log(`  Email: ${body.email || 'Not provided'}`);
      console.log(`  Service: ${body.service || 'Not specified'}`);
      console.log(`  Message: ${body.message}`);

      return NextResponse.json({ success: true });
    }

    // Send email to admin
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: adminEmail!,
      reply_to: body.email || undefined,
      subject: `New Inquiry from ${body.name}`,
      html: generateContactEmailHtml(body),
    });

    console.log(`[Contact] Inquiry email sent for: ${body.name}`);

    // Optionally send confirmation to customer if they provided email
    if (body.email) {
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: body.email,
          subject: "We received your inquiry - Steph's Beauty Box",
          html: generateConfirmationEmailHtml(body.name),
        });
        console.log(`[Contact] Confirmation email sent to: ${body.email}`);
      } catch (error) {
        // Don't fail the whole request if confirmation email fails
        console.error('[Contact] Failed to send confirmation email:', error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Contact] Form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or call us directly.' },
      { status: 500 }
    );
  }
}

function generateContactEmailHtml(data: ContactFormData): string {
  const serviceLabel = data.service
    ? data.service.charAt(0).toUpperCase() + data.service.slice(1).replace('-', ' & ')
    : 'Not specified';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Contact Inquiry</title>
    </head>
    <body style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2B2A28;">
      <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #e5e5e5;">
        <h1 style="font-size: 24px; margin: 0; color: #2F4A3B;">New Contact Inquiry</h1>
      </div>

      <div style="margin: 30px 0;">
        <h2 style="font-size: 18px; color: #2F4A3B; margin-bottom: 20px;">Contact Details</h2>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #666; width: 120px;">Name</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;"><strong>${escapeHtml(data.name)}</strong></td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #666;">Phone</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
              <a href="tel:${data.phone.replace(/\D/g, '')}" style="color: #2F4A3B;">${escapeHtml(data.phone)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #666;">Email</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
              ${data.email
                ? `<a href="mailto:${data.email}" style="color: #2F4A3B;">${escapeHtml(data.email)}</a>`
                : '<span style="color: #999;">Not provided</span>'}
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #666;">Service Interest</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">${escapeHtml(serviceLabel)}</td>
          </tr>
        </table>
      </div>

      <div style="margin: 30px 0;">
        <h2 style="font-size: 18px; color: #2F4A3B; margin-bottom: 12px;">Message</h2>
        <div style="background: #F6F0E6; padding: 20px; white-space: pre-wrap;">${escapeHtml(data.message)}</div>
      </div>

      <div style="margin-top: 30px; padding: 16px; background: #f5f5f5; text-align: center;">
        <p style="margin: 0; color: #666; font-size: 14px;">
          Reply to this email or call ${escapeHtml(data.phone)} to respond.
        </p>
      </div>

      <p style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
        This inquiry was submitted via the website contact form.
      </p>
    </body>
    </html>
  `;
}

function generateConfirmationEmailHtml(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>We Received Your Message</title>
    </head>
    <body style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2B2A28;">
      <div style="text-align: center; padding: 30px 0; border-bottom: 1px solid #e5e5e5;">
        <h1 style="font-size: 28px; margin: 0; color: #2F4A3B;">Thank You</h1>
      </div>

      <p style="margin-top: 30px;">Hi ${escapeHtml(name)},</p>

      <p>Thank you for reaching out to Steph's Beauty Box! We've received your message and will get back to you as soon as possible.</p>

      <p>In the meantime, feel free to:</p>
      <ul style="color: #666;">
        <li>Call or text us at <a href="tel:7863783511" style="color: #2F4A3B;">(786) 378-3511</a></li>
        <li>Message us on <a href="https://wa.me/17863783511" style="color: #2F4A3B;">WhatsApp</a></li>
        <li>Browse our <a href="https://stephsbeautybox.com/services" style="color: #2F4A3B;">services</a></li>
      </ul>

      <div style="margin-top: 40px; padding: 20px; background: #F6F0E6; text-align: center;">
        <p style="margin: 0; font-style: italic; color: #2F4A3B;">Where beauty meets grace.</p>
      </div>

      <p style="text-align: center; color: #999; font-size: 12px; margin-top: 40px;">
        Steph's Beauty Box<br>
        West Park, FL
      </p>
    </body>
    </html>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
