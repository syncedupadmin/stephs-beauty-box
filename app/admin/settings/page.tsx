/**
 * Settings Index Page
 * ===================
 * Redirect to shop settings
 */

import { redirect } from 'next/navigation';

export default function SettingsPage() {
  redirect('/admin/settings/shop');
}
