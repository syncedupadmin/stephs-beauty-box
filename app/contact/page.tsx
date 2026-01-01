'use client';

import { useState } from 'react';
import { brand, contact, hours, services } from '@/lib/config/brand';

/**
 * CONTACT PAGE - EDITORIAL INQUIRY
 * =================================
 * Design: Asymmetric layout with editorial forms
 * - No icons, no cards
 * - Editorial form inputs
 * - Vast negative space
 */

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');

    // Simulate form submission (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For now, just show success (implement actual email sending later)
    setFormState('success');
    setFormData({ name: '', phone: '', email: '', service: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      {/* Hero Section - Editorial */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="overline mb-6">Get in Touch</p>
            <h1 className="font-display text-display-hero text-ink leading-[0.9] mb-8">
              Contact<br />
              <span className="font-editorial-italic">Us</span>
            </h1>
            <p className="text-ink/70 text-body-lg font-body leading-relaxed max-w-md">
              Have questions or ready to start your beauty journey?
              We&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Hairline Divider */}
      <div className="container-editorial">
        <div className="divider-hairline" />
      </div>

      {/* Contact Section - Editorial */}
      <section className="section-editorial">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Inquiry Form */}
            <div>
              <h2 className="font-display text-display-sm text-ink mb-4">
                Send an Inquiry
              </h2>
              <p className="text-ink/60 text-body-md font-body mb-10">
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </p>

              {formState === 'success' ? (
                <div className="py-16 text-center">
                  <h3 className="font-display text-display-sm text-ink mb-4">Thank You</h3>
                  <p className="text-ink/60 text-body-md font-body mb-8">
                    We&apos;ve received your inquiry and will be in touch soon.
                  </p>
                  <button
                    onClick={() => setFormState('idle')}
                    className="editorial-link text-body-md"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="label-editorial">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-editorial"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Phone & Email */}
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="phone" className="label-editorial">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="input-editorial"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="label-editorial">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-editorial"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  {/* Service Interest */}
                  <div>
                    <label htmlFor="service" className="label-editorial">
                      Service Interest
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="input-editorial"
                    >
                      <option value="">Select a service (optional)</option>
                      {services.categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                      <option value="other">Other / General Inquiry</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="label-editorial">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="textarea-editorial"
                      placeholder="Tell us what you're looking for..."
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={formState === 'submitting'}
                    className="cta-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formState === 'submitting' ? 'Sending...' : 'Send Inquiry'}
                  </button>

                  {formState === 'error' && (
                    <p className="text-clay text-body-sm font-body">
                      Something went wrong. Please try again or contact us directly.
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Contact Info - Editorial */}
            <div className="lg:pt-12">
              <h2 className="font-display text-display-sm text-ink mb-4">
                Other Ways to Reach Us
              </h2>
              <p className="text-ink/60 text-body-md font-body mb-10">
                Prefer to reach out directly? We&apos;re here to help.
              </p>

              {/* Contact Links - Editorial */}
              <div className="space-y-8 mb-12">
                <div>
                  <p className="overline mb-2">Call or Text</p>
                  <a
                    href={`tel:${contact.phoneClean}`}
                    className="font-display text-xl text-botanical hover:opacity-70 transition-opacity duration-600"
                  >
                    {contact.phoneFormatted}
                  </a>
                </div>

                <div>
                  <p className="overline mb-2">WhatsApp</p>
                  <a
                    href={contact.whatsapp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-link text-body-md"
                  >
                    Message us anytime
                  </a>
                </div>

                <div>
                  <p className="overline mb-2">Visit Us</p>
                  <a
                    href={contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink/70 text-body-md font-body hover:text-botanical transition-colors duration-600"
                  >
                    {contact.address.street}, {contact.address.unit}<br />
                    {contact.address.city}, {contact.address.state} {contact.address.zip}
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="divider-hairline mb-8" />
              <h3 className="font-display text-xl text-ink mb-6">Hours</h3>
              <ul className="space-y-3">
                {hours.schedule.map((day) => (
                  <li key={day.day} className="flex justify-between text-body-sm font-body">
                    <span className={day.isOpen ? 'text-ink' : 'text-ink/40'}>
                      {day.day}
                    </span>
                    <span className={day.isOpen ? 'text-botanical' : 'text-ink/40'}>
                      {day.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8">
        <div className="container-editorial">
          <div className="aspect-video md:aspect-[21/9] overflow-hidden">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(contact.address.full)}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Studio Location"
            />
          </div>
        </div>
      </section>
    </>
  );
}
