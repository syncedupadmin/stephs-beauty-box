'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatPrice } from '@/lib/store/cart';
import { BOOKING_POLICIES, DEPOSIT_DISPLAY } from '@/lib/config/policies';
import { getImage } from '@/lib/config/images';
import type { ServiceWithDeposit, BookingSettings, AvailableSlot } from '@/types/database';

// Step images - using unused gallery images (6, 9, 11, 13, 14)
const STEP_IMAGES = {
  service: getImage(6),
  datetime: getImage(9),
  details: getImage(11),
  policies: getImage(13),
  confirm: getImage(14),
} as const;

interface BookingWizardProps {
  services: ServiceWithDeposit[];
  settings: BookingSettings;
}

type Step = 'service' | 'datetime' | 'details' | 'policies' | 'confirm';

interface BookingData {
  serviceId: string;
  date: string;
  slot: AvailableSlot | null;
  name: string;
  phone: string;
  email: string;
  notes: string;
  acceptedPolicies: boolean;
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
    acceptedPolicies: false,
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

  // Step configuration
  const allSteps: Step[] = ['service', 'datetime', 'details', 'policies', 'confirm'];
  const stepLabels = ['Service', 'Date & Time', 'Details', 'Policies', 'Confirm'];

  // Step navigation
  const canProceed = {
    service: !!bookingData.serviceId,
    datetime: !!bookingData.slot,
    details: !!(bookingData.name && bookingData.phone),
    policies: bookingData.acceptedPolicies,
    confirm: true,
  };

  const goNext = () => {
    const currentIndex = allSteps.indexOf(step);
    if (currentIndex < allSteps.length - 1 && canProceed[step]) {
      setStep(allSteps[currentIndex + 1]);
    }
  };

  const goBack = () => {
    const currentIndex = allSteps.indexOf(step);
    if (currentIndex > 0) {
      setStep(allSteps[currentIndex - 1]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress with Images */}
      <div className="flex items-center gap-2 sm:gap-3 mb-12 overflow-x-auto pb-2">
        {stepLabels.map((label, i) => {
          const stepKey = allSteps[i];
          const isActive = allSteps.indexOf(step) >= i;
          const isCurrent = step === stepKey;
          return (
            <div key={label} className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className={`relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-full overflow-hidden transition-all duration-600 ${
                isCurrent ? 'ring-2 ring-botanical ring-offset-2' : ''
              } ${isActive ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                <Image
                  src={STEP_IMAGES[stepKey]}
                  alt={label}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
                {/* Step Number Overlay */}
                <div className={`absolute inset-0 flex items-center justify-center text-body-sm font-body font-medium transition-colors duration-600 ${
                  isActive ? 'bg-botanical/60 text-off-white' : 'bg-ink/40 text-off-white'
                }`}>
                  {i + 1}
                </div>
              </div>
              <span className={`hidden lg:block text-body-sm font-body whitespace-nowrap ${
                isActive ? 'text-ink' : 'text-ink/40'
              }`}>
                {label}
              </span>
              {i < 4 && <div className="flex-1 h-px bg-ink/10 min-w-2 sm:min-w-4" />}
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

        {/* Step 4: Booking Policies */}
        {step === 'policies' && (
          <div>
            <h2 className="font-display text-display-sm text-ink mb-4">
              Booking Agreement
            </h2>
            <p className="text-ink/60 text-body-md font-body mb-8">
              Please review and accept our booking policies before proceeding.
            </p>

            <div className="bg-off-white/50 p-6 sm:p-8 mb-8 max-h-[400px] overflow-y-auto">
              <div className="space-y-6">
                {BOOKING_POLICIES.map((policy, index) => (
                  <div key={policy.id}>
                    <h4 className="font-display text-lg text-ink mb-2">
                      {index + 1}. {policy.title}
                    </h4>
                    <p className="text-ink/70 text-body-sm font-body leading-relaxed">
                      {policy.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Agreement Checkbox */}
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={bookingData.acceptedPolicies}
                  onChange={(e) => setBookingData(prev => ({ ...prev, acceptedPolicies: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-6 h-6 border-2 border-ink/30 peer-checked:border-botanical peer-checked:bg-botanical transition-colors duration-300 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-off-white opacity-0 peer-checked:opacity-100 transition-opacity duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {/* Checkmark - positioned absolutely to show when checked */}
                {bookingData.acceptedPolicies && (
                  <svg
                    className="absolute inset-0 w-6 h-6 text-off-white p-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-body-md font-body text-ink/80 group-hover:text-ink transition-colors">
                I have read and agree to the booking policies. I understand that a{' '}
                <span className="font-medium text-botanical">{DEPOSIT_DISPLAY} non-refundable deposit</span>{' '}
                is required to secure my appointment.
              </span>
            </label>
          </div>
        )}

        {/* Step 5: Confirmation */}
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

            <div className="bg-botanical/5 border border-botanical/20 p-4 text-body-sm font-body">
              <p className="text-botanical font-medium mb-1">Booking Policy Accepted</p>
              <p className="text-ink/60">
                You have agreed to our booking policies including the {DEPOSIT_DISPLAY} non-refundable deposit.
              </p>
            </div>
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
