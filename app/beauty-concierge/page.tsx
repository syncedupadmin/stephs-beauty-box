'use client';

import { useState } from 'react';
import Link from 'next/link';
import { brand, services, booking, contact } from '@/lib/config/brand';

// Service recommendation based on answers
type SkinType = 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
type Occasion = 'everyday' | 'special' | 'bridal' | 'professional';
type LashPreference = 'natural' | 'glam' | 'dramatic' | 'unsure';

interface FormData {
  occasion: Occasion | null;
  skinType: SkinType | null;
  lashPreference: LashPreference | null;
  services: string[];
}

export default function BeautyConciergePage() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    occasion: null,
    skinType: null,
    lashPreference: null,
    services: [],
  });
  const [showResults, setShowResults] = useState(false);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const getRecommendations = () => {
    const recommendations: string[] = [];

    // Based on occasion
    if (formData.occasion === 'bridal') {
      recommendations.push('Bridal Makeup', 'Classic Full Set Lashes');
    } else if (formData.occasion === 'special') {
      recommendations.push('Full Glam Makeup', 'Volume Lashes');
    } else if (formData.occasion === 'professional') {
      recommendations.push('Soft Glam / Natural Makeup', 'Classic Lashes');
    } else {
      recommendations.push('Natural Makeup', 'Lash Lift & Tint');
    }

    // Based on lash preference
    if (formData.lashPreference === 'dramatic') {
      recommendations.push('Mega Volume Full Set');
    } else if (formData.lashPreference === 'glam') {
      recommendations.push('Volume Full Set');
    }

    return Array.from(new Set(recommendations));
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-glam">
        <div className="container-luxury">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gold">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
              </svg>
              <span className="text-sm text-gold font-medium">AI-Powered</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-medium text-ivory mb-4">
              Beauty <span className="font-serif italic text-gold">Concierge</span>
            </h1>
            <p className="text-lg text-ivory/60">
              Answer a few questions and we&apos;ll recommend the perfect services for you.
            </p>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-16 md:py-24 bg-bg">
        <div className="container-luxury">
          <div className="max-w-2xl mx-auto">
            {!showResults ? (
              <>
                {/* Progress */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                          s < step
                            ? 'bg-gold text-bg'
                            : s === step
                            ? 'bg-gold/20 text-gold border border-gold'
                            : 'bg-ivory/10 text-ivory/40'
                        }`}
                      >
                        {s < step ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          s
                        )}
                      </div>
                      {s < 4 && <div className={`w-8 h-0.5 ${s < step ? 'bg-gold' : 'bg-ivory/20'}`} />}
                    </div>
                  ))}
                </div>

                {/* Step 1: Occasion */}
                {step === 1 && (
                  <div className="text-center">
                    <h2 className="text-2xl font-medium text-ivory mb-2">What&apos;s the occasion?</h2>
                    <p className="text-ivory/60 mb-8">This helps us recommend the perfect look</p>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: 'everyday', label: 'Everyday Glam', desc: 'Natural, polished look' },
                        { value: 'special', label: 'Special Event', desc: 'Party, date night, photoshoot' },
                        { value: 'bridal', label: 'Bridal', desc: 'Wedding or engagement' },
                        { value: 'professional', label: 'Professional', desc: 'Work or interview' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setFormData({ ...formData, occasion: option.value as Occasion })}
                          className={`p-6 rounded-xl border-2 text-left transition-all ${
                            formData.occasion === option.value
                              ? 'border-gold bg-gold/10'
                              : 'border-ivory/20 hover:border-ivory/40'
                          }`}
                        >
                          <span className="block text-ivory font-medium">{option.label}</span>
                          <span className="block text-sm text-ivory/50 mt-1">{option.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Skin Type */}
                {step === 2 && (
                  <div className="text-center">
                    <h2 className="text-2xl font-medium text-ivory mb-2">What&apos;s your skin type?</h2>
                    <p className="text-ivory/60 mb-8">We&apos;ll use the best products for you</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { value: 'oily', label: 'Oily' },
                        { value: 'dry', label: 'Dry' },
                        { value: 'combination', label: 'Combination' },
                        { value: 'normal', label: 'Normal' },
                        { value: 'sensitive', label: 'Sensitive' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setFormData({ ...formData, skinType: option.value as SkinType })}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            formData.skinType === option.value
                              ? 'border-gold bg-gold/10 text-gold'
                              : 'border-ivory/20 text-ivory hover:border-ivory/40'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Lash Preference */}
                {step === 3 && (
                  <div className="text-center">
                    <h2 className="text-2xl font-medium text-ivory mb-2">How do you like your lashes?</h2>
                    <p className="text-ivory/60 mb-8">From subtle to statement</p>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: 'natural', label: 'Natural', desc: 'Subtle enhancement' },
                        { value: 'glam', label: 'Glam', desc: 'Fuller, fluffier' },
                        { value: 'dramatic', label: 'Dramatic', desc: 'Bold statement' },
                        { value: 'unsure', label: 'Not Sure', desc: 'Help me decide!' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setFormData({ ...formData, lashPreference: option.value as LashPreference })}
                          className={`p-6 rounded-xl border-2 text-left transition-all ${
                            formData.lashPreference === option.value
                              ? 'border-gold bg-gold/10'
                              : 'border-ivory/20 hover:border-ivory/40'
                          }`}
                        >
                          <span className="block text-ivory font-medium">{option.label}</span>
                          <span className="block text-sm text-ivory/50 mt-1">{option.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Services Interest */}
                {step === 4 && (
                  <div className="text-center">
                    <h2 className="text-2xl font-medium text-ivory mb-2">What services interest you?</h2>
                    <p className="text-ivory/60 mb-8">Select all that apply</p>
                    <div className="grid grid-cols-2 gap-4">
                      {services.categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            const updated = formData.services.includes(category.id)
                              ? formData.services.filter((s) => s !== category.id)
                              : [...formData.services, category.id];
                            setFormData({ ...formData, services: updated });
                          }}
                          className={`p-6 rounded-xl border-2 text-left transition-all ${
                            formData.services.includes(category.id)
                              ? 'border-gold bg-gold/10'
                              : 'border-ivory/20 hover:border-ivory/40'
                          }`}
                        >
                          <span className="block text-ivory font-medium">{category.name}</span>
                          <span className="block text-sm text-ivory/50 mt-1">{category.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handleBack}
                    disabled={step === 1}
                    className={`px-6 py-3 rounded-lg ${
                      step === 1 ? 'text-ivory/30' : 'text-ivory hover:text-gold'
                    }`}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-gold text-bg font-medium rounded-lg hover:bg-gold-soft transition-colors"
                  >
                    {step === 4 ? 'Get Recommendations' : 'Continue'}
                  </button>
                </div>
              </>
            ) : (
              /* Results */
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gold">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-medium text-ivory mb-4">
                  Your Perfect <span className="text-gold">Beauty Match</span>
                </h2>
                <p className="text-ivory/60 mb-8">
                  Based on your answers, we recommend these services:
                </p>

                <div className="grid gap-4 mb-8">
                  {getRecommendations().map((rec) => (
                    <div key={rec} className="p-4 bg-bg-card rounded-xl border border-gold/20 text-left flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      <span className="text-ivory font-medium">{rec}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href={booking.primaryUrl || '/book'}
                    className="px-8 py-4 bg-gold text-bg font-medium rounded-lg hover:bg-gold-soft transition-colors"
                  >
                    Book These Services
                  </Link>
                  <a
                    href={`tel:${contact.phoneClean}`}
                    className="px-8 py-4 border border-gold/50 text-gold font-medium rounded-lg hover:bg-gold/10 transition-colors"
                  >
                    Call to Discuss
                  </a>
                </div>

                <button
                  onClick={() => {
                    setShowResults(false);
                    setStep(1);
                    setFormData({ occasion: null, skinType: null, lashPreference: null, services: [] });
                  }}
                  className="mt-6 text-ivory/50 hover:text-ivory transition-colors text-sm"
                >
                  Start Over
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
