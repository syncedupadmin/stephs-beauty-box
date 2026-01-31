import { redirect } from 'next/navigation';

/**
 * SERVICES PAGE - REDIRECT TO BOOKING
 * ====================================
 * Services are shown in the booking flow
 */

export default function ServicesPage() {
  redirect('/book');
}
