'use client';

/**
 * Shop Settings Page
 * ==================
 * Configure shipping, pickup, and tax settings
 */

import { useEffect, useState } from 'react';
import { PageLoading } from '@/components/admin';

interface ShopSettings {
  id: string;
  shipping_enabled: boolean;
  pickup_enabled: boolean;
  pickup_address: string | null;
  pickup_hours: string | null;
  pickup_instructions: string | null;
  flat_shipping_rate_cents: number | null;
  free_shipping_threshold_cents: number | null;
  tax_mode: 'none' | 'inclusive' | 'exclusive';
  tax_rate_percent: number | null;
}

export default function ShopSettingsPage() {
  const [settings, setSettings] = useState<ShopSettings | null>(null);
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
      setSettings(data.shop);
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
      const response = await fetch('/api/admin/settings/shop', {
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

      {/* Fulfillment Options */}
      <div className="bg-off-white p-6">
        <h3 className="font-display text-lg text-ink border-b border-ink/10 pb-2 mb-4">
          Fulfillment Options
        </h3>

        <div className="space-y-4">
          {/* Shipping Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body-sm font-body text-ink">Enable Shipping</p>
              <p className="text-overline text-ink/50">Allow customers to have orders shipped</p>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, shipping_enabled: !settings.shipping_enabled })}
              className={`relative w-12 h-6 transition-colors duration-600 ${
                settings.shipping_enabled ? 'bg-botanical' : 'bg-ink/20'
              }`}
              style={{ borderRadius: '9999px' }}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-paper transition-transform duration-600 ${
                  settings.shipping_enabled ? 'left-7' : 'left-1'
                }`}
                style={{ borderRadius: '9999px' }}
              />
            </button>
          </div>

          {/* Shipping Rates */}
          {settings.shipping_enabled && (
            <div className="pl-4 border-l-2 border-botanical/20 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
                    Flat Shipping Rate
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 font-body">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.flat_shipping_rate_cents ? (settings.flat_shipping_rate_cents / 100).toFixed(2) : ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        flat_shipping_rate_cents: e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null,
                      })}
                      className="w-full pl-8 pr-4 py-3 bg-paper border-0 text-body-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-botanical/20"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
                    Free Shipping Threshold
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 font-body">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.free_shipping_threshold_cents ? (settings.free_shipping_threshold_cents / 100).toFixed(2) : ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        free_shipping_threshold_cents: e.target.value ? Math.round(parseFloat(e.target.value) * 100) : null,
                      })}
                      className="w-full pl-8 pr-4 py-3 bg-paper border-0 text-body-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-botanical/20"
                      placeholder="Free shipping over..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pickup Toggle */}
          <div className="flex items-center justify-between pt-4 border-t border-ink/10">
            <div>
              <p className="text-body-sm font-body text-ink">Enable Pickup</p>
              <p className="text-overline text-ink/50">Allow customers to pick up orders</p>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, pickup_enabled: !settings.pickup_enabled })}
              className={`relative w-12 h-6 transition-colors duration-600 ${
                settings.pickup_enabled ? 'bg-botanical' : 'bg-ink/20'
              }`}
              style={{ borderRadius: '9999px' }}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-paper transition-transform duration-600 ${
                  settings.pickup_enabled ? 'left-7' : 'left-1'
                }`}
                style={{ borderRadius: '9999px' }}
              />
            </button>
          </div>

          {/* Pickup Details */}
          {settings.pickup_enabled && (
            <div className="pl-4 border-l-2 border-botanical/20 space-y-4">
              <div>
                <label className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
                  Pickup Address
                </label>
                <input
                  type="text"
                  value={settings.pickup_address || ''}
                  onChange={(e) => setSettings({ ...settings, pickup_address: e.target.value || null })}
                  className="w-full px-4 py-3 bg-paper border-0 text-body-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-botanical/20"
                  placeholder="123 Main St, City, State"
                />
              </div>

              <div>
                <label className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
                  Pickup Hours
                </label>
                <input
                  type="text"
                  value={settings.pickup_hours || ''}
                  onChange={(e) => setSettings({ ...settings, pickup_hours: e.target.value || null })}
                  className="w-full px-4 py-3 bg-paper border-0 text-body-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-botanical/20"
                  placeholder="Wed-Sun 11am-7pm"
                />
              </div>

              <div>
                <label className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
                  Pickup Instructions
                </label>
                <textarea
                  value={settings.pickup_instructions || ''}
                  onChange={(e) => setSettings({ ...settings, pickup_instructions: e.target.value || null })}
                  rows={2}
                  className="w-full px-4 py-3 bg-paper border-0 text-body-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-botanical/20 resize-none"
                  placeholder="Enter through the front door..."
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tax Settings */}
      <div className="bg-off-white p-6">
        <h3 className="font-display text-lg text-ink border-b border-ink/10 pb-2 mb-4">
          Tax Settings
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
              Tax Mode
            </label>
            <select
              value={settings.tax_mode}
              onChange={(e) => setSettings({ ...settings, tax_mode: e.target.value as 'none' | 'inclusive' | 'exclusive' })}
              className="w-full px-4 py-3 bg-paper border-0 text-body-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-botanical/20"
            >
              <option value="none">No Tax</option>
              <option value="exclusive">Tax Exclusive (added at checkout)</option>
              <option value="inclusive">Tax Inclusive (included in price)</option>
            </select>
          </div>

          {settings.tax_mode !== 'none' && (
            <div>
              <label className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.001"
                value={settings.tax_rate_percent || ''}
                onChange={(e) => setSettings({ ...settings, tax_rate_percent: e.target.value ? parseFloat(e.target.value) : null })}
                className="w-full px-4 py-3 bg-paper border-0 text-body-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-botanical/20"
                placeholder="e.g., 7.0"
              />
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
