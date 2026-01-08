'use client';

/**
 * Booking Settings Page
 * =====================
 * Configure booking system settings
 */

import { useEffect, useState } from 'react';
import { PageLoading } from '@/components/admin';

interface BookingSettings {
  id: string;
  timezone: string;
  min_notice_minutes: number;
  buffer_minutes: number;
  max_days_out: number;
  hold_minutes: number;
  deposits_enabled: boolean;
  default_deposit_type: 'flat' | 'percent';
  default_deposit_value: number;
}

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Phoenix',
  'Pacific/Honolulu',
];

export default function BookingSettingsPage() {
  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const response = await fetch('/api/admin/settings');
      if (!response.ok) throw new Error('Failed to load settings');
      const data = await response.json();
      setSettings(data.booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/settings/booking', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      const data = await response.json();
      setSettings(data.settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <PageLoading message="Loading settings..." />;
  }

  if (!settings) {
    return (
      <div className="bg-red-50 p-6 text-center">
        <p className="text-red-700 font-body">{error || 'Failed to load settings'}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 p-4">
          <p className="text-red-700 text-body-sm font-body">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-botanical/10 border border-botanical/20 p-4">
          <p className="text-botanical text-body-sm font-body">Settings saved successfully!</p>
        </div>
      )}

      {/* General Settings */}
      <div className="bg-off-white p-6">
        <h3 className="font-display text-lg text-ink border-b border-ink/10 pb-2 mb-4">
          General
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="w-full px-4 py-3 bg-paper border-0 text-body-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-botanical/20"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
                Minimum Notice (hours)
              </label>
              <input
                type="number"
                min="0"
                value={settings.min_notice_minutes / 60}
                onChange={(e) => setSettings({ ...settings, min_notice_minutes: parseInt(e.target.value) * 60 })}
                className="w-full px-4 py-3 bg-paper border-0 text-body-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-botanical/20"
              />
              <p className="mt-1 text-overline text-ink/40">
                How far in advance bookings must be made
              </p>
            </div>

            <div>
              <label className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
                Max Days Out
              </label>
              <input
                type="number"
                min="1"
                value={settings.max_days_out}
                onChange={(e) => setSettings({ ...settings, max_days_out: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-paper border-0 text-body-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-botanical/20"
              />
              <p className="mt-1 text-overline text-ink/40">
                How far ahead customers can book
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduling Settings */}
      <div className="bg-off-white p-6">
        <h3 className="font-display text-lg text-ink border-b border-ink/10 pb-2 mb-4">
          Scheduling
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
              Buffer Time (minutes)
            </label>
            <input
              type="number"
              min="0"
              step="5"
              value={settings.buffer_minutes}
              onChange={(e) => setSettings({ ...settings, buffer_minutes: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-paper border-0 text-body-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-botanical/20"
            />
            <p className="mt-1 text-overline text-ink/40">
              Time between appointments
            </p>
          </div>

          <div>
            <label className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
              Hold Duration (minutes)
            </label>
            <input
              type="number"
              min="5"
              step="5"
              value={settings.hold_minutes}
              onChange={(e) => setSettings({ ...settings, hold_minutes: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-paper border-0 text-body-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-botanical/20"
            />
            <p className="mt-1 text-overline text-ink/40">
              How long a slot is held before payment
            </p>
          </div>
        </div>
      </div>

      {/* Deposit Settings */}
      <div className="bg-off-white p-6">
        <h3 className="font-display text-lg text-ink border-b border-ink/10 pb-2 mb-4">
          Deposits
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-sm font-body text-ink">Require Deposits</p>
              <p className="text-overline text-ink/50">Collect a deposit when booking</p>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, deposits_enabled: !settings.deposits_enabled })}
              className={`relative w-12 h-6 transition-colors duration-600 ${
                settings.deposits_enabled ? 'bg-botanical' : 'bg-ink/20'
              }`}
              style={{ borderRadius: '9999px' }}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-paper transition-transform duration-600 ${
                  settings.deposits_enabled ? 'left-7' : 'left-1'
                }`}
                style={{ borderRadius: '9999px' }}
              />
            </button>
          </div>

          {settings.deposits_enabled && (
            <div className="pl-4 border-l-2 border-botanical/20 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
                    Deposit Type
                  </label>
                  <select
                    value={settings.default_deposit_type}
                    onChange={(e) => setSettings({ ...settings, default_deposit_type: e.target.value as 'flat' | 'percent' })}
                    className="w-full px-4 py-3 bg-paper border-0 text-body-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-botanical/20"
                  >
                    <option value="percent">Percentage</option>
                    <option value="flat">Flat Amount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
                    {settings.default_deposit_type === 'percent' ? 'Deposit Percentage' : 'Deposit Amount'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 font-body">
                      {settings.default_deposit_type === 'percent' ? '%' : '$'}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step={settings.default_deposit_type === 'percent' ? '1' : '0.01'}
                      value={settings.default_deposit_value}
                      onChange={(e) => setSettings({ ...settings, default_deposit_value: parseFloat(e.target.value) })}
                      className="w-full pl-8 pr-4 py-3 bg-paper border-0 text-body-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-botanical/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-botanical text-paper text-body-sm font-body hover:bg-botanical/90 transition-colors duration-600 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
