'use client';

import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/store/cart';
import type { ServiceWithDeposit, BookingSettings, AvailableSlot } from '@/types/database';

interface BookingWizardProps {
  services: ServiceWithDeposit[];
  settings: BookingSettings;
}

type Step = 'service' | 'datetime' | 'details' | 'confirm';

interface BookingData {
  serviceId: string;
  date: string;
  slot: AvailableSlot | null;
  name: string;
  phone: string;
  email: string;
  notes: string;
}

export function BookingWizard({ services, settings }: BookingWizardProps) {
  const [step, setStep] = useState<Step>('service');
  const [bookingData, setBookingData] = useState<BookingData>({
    serviceId: '',
    date: '',
    slot: null,
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedService = services.find(s => s.id === bookingData.serviceId);

  // Calculate deposit amount
  const depositAmount = selectedService
    ? calculateDeposit(selectedService, settings)
    : 0;

  // Fetch available dates when service is selected
  useEffect(() => {
    if (!bookingData.serviceId) return;

    async function fetchDates() {
      try {
        const response = await fetch(
          `/api/booking/available-dates?serviceId=${bookingData.serviceId}`
        );
        if (response.ok) {
          const data = await response.json();
          setAvailableDates(data.dates || []);
        }
      } catch (err) {
        console.error('Failed to fetch dates:', err);
      }
    }

    fetchDates();
  }, [bookingData.serviceId]);

  // Fetch available slots when date is selected
  useEffect(() => {
    if (!bookingData.serviceId || !bookingData.date) return;

    async function fetchSlots() {
      setIsLoadingSlots(true);
      try {
        const response = await fetch(
          `/api/booking/available-slots?serviceId=${bookingData.serviceId}&date=${bookingData.date}`
        );
        if (response.ok) {
          const data = await response.json();
          setAvailableSlots(data.slots || []);
        }
      } catch (err) {
        console.error('Failed to fetch slots:', err);
      } finally {
        setIsLoadingSlots(false);
      }
    }

    fetchSlots();
  }, [bookingData.serviceId, bookingData.date]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!bookingData.slot || !selectedService) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Create booking hold
      const holdResponse = await fetch('/api/booking/create-hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: bookingData.serviceId,
          startTime: bookingData.slot.start,
          customerName: bookingData.name,
          customerPhone: bookingData.phone,
          customerEmail: bookingData.email,
          customerNotes: bookingData.notes,
        }),
      });

      const holdData = await holdResponse.json();

      if (!holdResponse.ok) {
        throw new Error(holdData.error || 'Failed to create booking');
      }

      if (!holdData.success) {
        throw new Error(holdData.errorMessage || 'Time slot no longer available');
      }

      // If deposit is required, redirect to Stripe
      if (depositAmount > 0 && holdData.checkoutUrl) {
        window.location.href = holdData.checkoutUrl;
        return;
      }

      // If no deposit, booking is confirmed
      window.location.href = `/book/success?id=${holdData.bookingId}`;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step navigation
  const canProceed = {
    service: !!bookingData.serviceId,
    datetime: !!bookingData.slot,
    details: bookingData.name && bookingData.phone,
    confirm: true,
  };

  const goNext = () => {
    const steps: Step[] = ['service', 'datetime', 'details', 'confirm'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1 && canProceed[step]) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const goBack = () => {
    const steps: Step[] = ['service', 'datetime', 'details', 'confirm'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-4 mb-12">
        {['Service', 'Date & Time', 'Details', 'Confirm'].map((label, i) => {
          const steps: Step[] = ['service', 'datetime', 'details', 'confirm'];
          const isActive = steps.indexOf(step) >= i;
          return (
            <div key={label} className="flex items-center gap-4 flex-1">
              <div className={`w-8 h-8 flex items-center justify-center text-body-sm font-body transition-colors duration-600 ${
                isActive ? 'bg-botanical text-off-white' : 'bg-ink/10 text-ink/40'
              }`}>
                {i + 1}
              </div>
              <span className={`hidden sm:block text-body-sm font-body ${
                isActive ? 'text-ink' : 'text-ink/40'
              }`}>
                {label}
              </span>
              {i < 3 && <div className="flex-1 h-px bg-ink/10" />}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {/* Step 1: Service Selection */}
        {step === 'service' && (
          <div>
            <h2 className="font-display text-display-sm text-ink mb-8">
              Select a Service
            </h2>
            <div className="grid gap-4">
              {services.map(service => (
                <button
                  key={service.id}
                  onClick={() => setBookingData(prev => ({ ...prev, serviceId: service.id, date: '', slot: null }))}
                  className={`w-full text-left p-6 border transition-all duration-600 ${
                    bookingData.serviceId === service.id
                      ? 'border-botanical bg-botanical/5'
                      : 'border-ink/20 hover:border-ink/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display text-lg text-ink mb-1">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="text-ink/50 text-body-sm font-body mb-2">
                          {service.description}
                        </p>
                      )}
                      <p className="text-ink/40 text-body-sm font-body">
                        ~{service.duration_minutes} minutes
                      </p>
                    </div>
                    <span className="font-display text-lg text-botanical">
                      {formatPrice(service.price_cents)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 'datetime' && selectedService && (
          <div>
            <h2 className="font-display text-display-sm text-ink mb-2">
              Choose Date & Time
            </h2>
            <p className="text-ink/50 text-body-md font-body mb-8">
              {selectedService.name} • {selectedService.duration_minutes} minutes
            </p>

            {/* Date Selection */}
            <div className="mb-8">
              <label className="label-editorial mb-4 block">Select Date</label>
              <input
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value, slot: null }))}
                min={new Date().toISOString().split('T')[0]}
                max={new Date(Date.now() + settings.max_days_out * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                className="input-editorial"
              />
            </div>

            {/* Time Slots */}
            {bookingData.date && (
              <div>
                <label className="label-editorial mb-4 block">Select Time</label>
                {isLoadingSlots ? (
                  <div className="animate-pulse space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-12 bg-ink/5" />
                    ))}
                  </div>
                ) : availableSlots.length === 0 ? (
                  <p className="text-ink/50 text-body-md font-body py-8 text-center">
                    No available times on this date. Please try another date.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {availableSlots.map((slot, i) => (
                      <button
                        key={i}
                        onClick={() => setBookingData(prev => ({ ...prev, slot }))}
                        className={`py-3 px-4 text-body-sm font-body transition-all duration-600 ${
                          bookingData.slot?.formatted === slot.formatted
                            ? 'bg-botanical text-off-white'
                            : 'bg-off-white text-ink hover:bg-botanical/10'
                        }`}
                      >
                        {slot.formatted}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Contact Details */}
        {step === 'details' && (
          <div>
            <h2 className="font-display text-display-sm text-ink mb-8">
              Your Details
            </h2>
            <form className="space-y-6">
              <div>
                <label className="label-editorial">Name *</label>
                <input
                  type="text"
                  value={bookingData.name}
                  onChange={(e) => setBookingData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-editorial"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="label-editorial">Phone *</label>
                <input
                  type="tel"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData(prev => ({ ...prev, phone: e.target.value }))}
                  className="input-editorial"
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
              <div>
                <label className="label-editorial">Email (optional)</label>
                <input
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData(prev => ({ ...prev, email: e.target.value }))}
                  className="input-editorial"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="label-editorial">Notes (optional)</label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                  className="textarea-editorial"
                  placeholder="Any special requests or information..."
                  rows={3}
                />
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 'confirm' && selectedService && bookingData.slot && (
          <div>
            <h2 className="font-display text-display-sm text-ink mb-8">
              Confirm Your Booking
            </h2>

            <div className="bg-off-white/50 p-8 mb-8">
              <h3 className="font-display text-xl text-ink mb-4">
                {selectedService.name}
              </h3>

              <div className="space-y-3 text-body-md font-body">
                <div className="flex justify-between">
                  <span className="text-ink/60">Date</span>
                  <span className="text-ink">
                    {new Date(bookingData.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Time</span>
                  <span className="text-ink">{bookingData.slot.formatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Duration</span>
                  <span className="text-ink">~{selectedService.duration_minutes} min</span>
                </div>
                <div className="divider-hairline my-4" />
                <div className="flex justify-between">
                  <span className="text-ink/60">Service Price</span>
                  <span className="text-ink">{formatPrice(selectedService.price_cents)}</span>
                </div>
                {depositAmount > 0 && (
                  <div className="flex justify-between font-medium">
                    <span className="text-botanical">Deposit Due Now</span>
                    <span className="text-botanical">{formatPrice(depositAmount)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-off-white/50 p-8 mb-8">
              <h4 className="font-display text-lg text-ink mb-4">Contact Info</h4>
              <div className="space-y-2 text-body-md font-body">
                <p><span className="text-ink/60">Name:</span> {bookingData.name}</p>
                <p><span className="text-ink/60">Phone:</span> {bookingData.phone}</p>
                {bookingData.email && (
                  <p><span className="text-ink/60">Email:</span> {bookingData.email}</p>
                )}
                {bookingData.notes && (
                  <p><span className="text-ink/60">Notes:</span> {bookingData.notes}</p>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-clay/10 border border-clay/30 p-4 mb-8 text-clay text-body-sm font-body">
                {error}
              </div>
            )}

            <p className="text-ink/40 text-body-sm font-body mb-6">
              By confirming, you agree to our cancellation policy. Please provide at least 24 hours notice
              for cancellations.
            </p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8 pt-8 border-t border-ink/10">
        {step !== 'service' ? (
          <button onClick={goBack} className="cta-secondary">
            Back
          </button>
        ) : (
          <div />
        )}

        {step !== 'confirm' ? (
          <button
            onClick={goNext}
            disabled={!canProceed[step]}
            className="cta-primary disabled:opacity-50"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="cta-primary disabled:opacity-50"
          >
            {isSubmitting
              ? 'Processing...'
              : depositAmount > 0
                ? `Pay ${formatPrice(depositAmount)} Deposit`
                : 'Confirm Booking'}
          </button>
        )}
      </div>
    </div>
  );
}

// Helper to calculate deposit
function calculateDeposit(
  service: ServiceWithDeposit,
  settings: BookingSettings
): number {
  if (!settings.deposits_enabled) return 0;

  if (service.deposit) {
    if (service.deposit.deposit_type === 'flat') {
      return Math.round(service.deposit.deposit_value * 100);
    } else {
      return Math.round(service.price_cents * service.deposit.deposit_value / 100);
    }
  }

  if (settings.default_deposit_type === 'flat') {
    return Math.round(settings.default_deposit_value * 100);
  } else {
    return Math.round(service.price_cents * settings.default_deposit_value / 100);
  }
}
