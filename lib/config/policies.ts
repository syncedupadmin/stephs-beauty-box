/**
 * Steph's Beauty Box - Client Booking Agreement & Policies
 *
 * By booking an appointment with Steph's Beauty Box, clients acknowledge
 * and agree to the following terms and conditions.
 */

export interface Policy {
  id: string;
  title: string;
  description: string;
}

export const DEPOSIT_AMOUNT = 50; // in dollars
export const DEPOSIT_DISPLAY = '$50';

export const BOOKING_POLICIES: Policy[] = [
  {
    id: 'deposits',
    title: 'Deposits',
    description:
      'A $50 non-refundable, non-transferable deposit is required to secure all appointments. This deposit will be applied toward the total cost of your service.',
  },
  {
    id: 'cancellations',
    title: 'Cancellations & Rescheduling',
    description:
      'If you cancel or reschedule your appointment for any reason, your deposit will be forfeited. A new deposit will be required to book another appointment.',
  },
  {
    id: 'no-show',
    title: 'No-Show Policy',
    description:
      'Failure to show up for your scheduled appointment without notice will result in forfeiture of your deposit. A new deposit will be required before any future bookings.',
  },
  {
    id: 'late-arrivals',
    title: 'Late Arrivals',
    description:
      'If you are running late, you must notify us. We understand emergencies happen; however, excessive or repeated lateness may result in shortened services or cancellation without refund of your deposit.',
  },
  {
    id: 'final-payment',
    title: 'Final Payment',
    description:
      'The remaining balance for your service is due upon arrival. Services will not begin until payment is received.',
  },
  {
    id: 'children',
    title: 'Children',
    description:
      'Parents and guardians are responsible for their children during appointments. Children must be prepared to sit and behave appropriately. Any damage caused by a child is the responsibility of the parent or guardian.',
  },
  {
    id: 'hair-products',
    title: 'Hair & Products',
    description:
      'Clients who provide their own hair or products must ensure they are clean, detangled, and ready for use. Additional fees may apply if hair is not properly prepared.',
  },
  {
    id: 'no-refunds',
    title: 'No Refunds',
    description:
      'All services, deposits, and payments are final and non-refundable. If there is a concern with your service, it must be addressed before leaving the salon so it can be corrected.',
  },
  {
    id: 'damage',
    title: 'Damage to Salon Property & Merchandise',
    description:
      'Clients (including children) are responsible for any damage to salon property, tools, furniture, or merchandise caused by negligence or mishandling. Damaged or broken items will be charged at their full retail or replacement value.',
  },
  {
    id: 'conduct',
    title: 'Respect & Conduct',
    description:
      "Steph's Beauty Box is a professional and peaceful environment. Disruptive behavior, foul language, loud phone conversations, or disrespect toward staff or other clients will not be tolerated. We reserve the right to refuse or end service without refund if behavior becomes inappropriate.",
  },
];

// Summary version for quick display
export const BOOKING_AGREEMENT_SUMMARY = [
  `${DEPOSIT_DISPLAY} non-refundable deposit required`,
  'Cancellations forfeit deposit',
  'No-shows forfeit deposit',
  'Remaining balance due upon arrival',
  'All sales are final',
];

// Full agreement text for legal purposes
export const FULL_AGREEMENT_TEXT = `Steph's Beauty Box - Client Booking Agreement

By booking an appointment with Steph's Beauty Box, you acknowledge and agree to the following terms and conditions:

${BOOKING_POLICIES.map((policy, index) => `${index + 1}. ${policy.title}\n\n${policy.description}`).join('\n\n---\n\n')}`;

// Pricing disclaimer
export const PRICING_DISCLAIMER =
  'All prices may vary based on hair length, density, and customization. Please arrive with clean, dry hair unless otherwise noted.';
