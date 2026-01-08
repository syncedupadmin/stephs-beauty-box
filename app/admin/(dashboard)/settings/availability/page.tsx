'use client';

/**
 * Availability Settings Page
 * ==========================
 * Configure weekly hours and blackout dates
 */

import { useEffect, useState } from 'react';
import { PageLoading } from '@/components/admin';

interface AvailabilityRule {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

interface BlackoutDate {
  id: string;
  date: string;
  reason: string | null;
}

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

export default function AvailabilitySettingsPage() {
  const [rules, setRules] = useState<AvailabilityRule[]>([]);
  const [blackouts, setBlackouts] = useState<BlackoutDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newBlackout, setNewBlackout] = useState({ date: '', reason: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const response = await fetch('/api/admin/settings');
      if (!response.ok) throw new Error('Failed to load settings');
      const data = await response.json();

      // Sort rules by day order
      const sortedRules = (data.availability || []).sort(
        (a: AvailabilityRule, b: AvailabilityRule) =>
          DAY_ORDER.indexOf(a.day_of_week) - DAY_ORDER.indexOf(b.day_of_week)
      );

      setRules(sortedRules);
      setBlackouts(data.blackouts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveRules(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/settings/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules }),
      });

      if (!response.ok) throw new Error('Failed to save availability');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddBlackout(e: React.FormEvent) {
    e.preventDefault();
    if (!newBlackout.date) return;

    try {
      const response = await fetch('/api/admin/settings/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: newBlackout.date,
          reason: newBlackout.reason || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add blackout date');
      }

      const data = await response.json();
      setBlackouts([...blackouts, data.blackout].sort((a, b) => a.date.localeCompare(b.date)));
      setNewBlackout({ date: '', reason: '' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add blackout date');
    }
  }

  async function handleRemoveBlackout(id: string) {
    try {
      const response = await fetch(`/api/admin/settings/availability?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove blackout date');

      setBlackouts(blackouts.filter((b) => b.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove blackout date');
    }
  }

  const updateRule = (id: string, updates: Partial<AvailabilityRule>) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return <PageLoading message="Loading settings..." />;
  }

  return (
    <div className="max-w-2xl space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 p-4">
          <p className="text-red-700 text-body-sm font-body">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-botanical/10 border border-botanical/20 p-4">
          <p className="text-botanical text-body-sm font-body">Availability saved successfully!</p>
        </div>
      )}

      {/* Weekly Hours */}
      <form onSubmit={handleSaveRules} className="bg-off-white p-6">
        <h3 className="font-display text-lg text-ink border-b border-ink/10 pb-2 mb-4">
          Weekly Hours
        </h3>

        <div className="space-y-3">
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-center gap-4">
              {/* Day Toggle */}
              <button
                type="button"
                onClick={() => updateRule(rule.id, { is_active: !rule.is_active })}
                className={`relative w-10 h-5 transition-colors duration-600 flex-shrink-0 ${
                  rule.is_active ? 'bg-botanical' : 'bg-ink/20'
                }`}
                style={{ borderRadius: '9999px' }}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-paper transition-transform duration-600 ${
                    rule.is_active ? 'left-5' : 'left-0.5'
                  }`}
                  style={{ borderRadius: '9999px' }}
                />
              </button>

              {/* Day Name */}
              <span className={`w-24 text-body-sm font-body ${rule.is_active ? 'text-ink' : 'text-ink/40'}`}>
                {DAY_LABELS[rule.day_of_week]}
              </span>

              {/* Time Inputs */}
              {rule.is_active ? (
                <>
                  <input
                    type="time"
                    value={rule.start_time}
                    onChange={(e) => updateRule(rule.id, { start_time: e.target.value })}
                    className="px-3 py-2 bg-paper border-0 text-body-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-botanical/20"
                  />
                  <span className="text-ink/40">to</span>
                  <input
                    type="time"
                    value={rule.end_time}
                    onChange={(e) => updateRule(rule.id, { end_time: e.target.value })}
                    className="px-3 py-2 bg-paper border-0 text-body-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-botanical/20"
                  />
                </>
              ) : (
                <span className="text-body-sm font-body text-ink/40">Closed</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-botanical text-paper text-body-sm font-body hover:bg-botanical/90 transition-colors duration-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Hours'}
          </button>
        </div>
      </form>

      {/* Blackout Dates */}
      <div className="bg-off-white p-6">
        <h3 className="font-display text-lg text-ink border-b border-ink/10 pb-2 mb-4">
          Blackout Dates
        </h3>
        <p className="text-body-sm font-body text-ink/60 mb-4">
          Block specific dates (holidays, vacations, etc.)
        </p>

        {/* Add New */}
        <form onSubmit={handleAddBlackout} className="flex gap-3 mb-6">
          <input
            type="date"
            value={newBlackout.date}
            onChange={(e) => setNewBlackout({ ...newBlackout, date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="px-4 py-2 bg-paper border-0 text-body-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-botanical/20"
          />
          <input
            type="text"
            value={newBlackout.reason}
            onChange={(e) => setNewBlackout({ ...newBlackout, reason: e.target.value })}
            placeholder="Reason (optional)"
            className="flex-1 px-4 py-2 bg-paper border-0 text-body-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-botanical/20"
          />
          <button
            type="submit"
            disabled={!newBlackout.date}
            className="px-4 py-2 bg-ink text-paper text-body-sm font-body hover:bg-ink/90 transition-colors duration-600 disabled:opacity-50"
          >
            Add
          </button>
        </form>

        {/* List */}
        {blackouts.length === 0 ? (
          <p className="text-body-sm font-body text-ink/40 text-center py-4">
            No blackout dates set
          </p>
        ) : (
          <div className="space-y-2">
            {blackouts.map((blackout) => (
              <div
                key={blackout.id}
                className="flex items-center justify-between py-2 border-b border-ink/5 last:border-0"
              >
                <div>
                  <p className="text-body-sm font-body text-ink">
                    {formatDate(blackout.date)}
                  </p>
                  {blackout.reason && (
                    <p className="text-overline text-ink/50">{blackout.reason}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveBlackout(blackout.id)}
                  className="p-2 text-ink/40 hover:text-red-600 transition-colors duration-600"
                  title="Remove"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
