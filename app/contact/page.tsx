'use client';

import { useState } from 'react';
import { brand, contact, hours, services } from '@/lib/config/brand';

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
      {/* Hero Section */}
      <section className="section-padding-sm bg-ivory">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center">
            <p className="eyebrow mb-4">Get In Touch</p>
            <h1 className="headline-display text-ink mb-6">
              Contact Us
            </h1>
            <p className="body-large text-ink/70 max-w-xl mx-auto">
              Have questions or ready to start your beauty journey?
              We&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Inquiry Form */}
            <div>
              <h2 className="headline-subsection text-ink mb-2">
                Send an Inquiry
              </h2>
              <p className="text-ink/60 mb-8">
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </p>

              {formState === 'success' ? (
                <div className="p-8 bg-sage/10 rounded-subtle text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="font-editorial text-2xl text-ink mb-2">Thank You!</h3>
                  <p className="text-ink/60">
                    We&apos;ve received your inquiry and will be in touch soon.
                  </p>
                  <button
                    onClick={() => setFormState('idle')}
                    className="mt-6 text-sage hover:text-sage-dark transition-colors underline underline-offset-4"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="label-field">
                      Name <span className="text-sage">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Phone & Email */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="label-field">
                        Phone <span className="text-sage">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="label-field">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  {/* Service Interest */}
                  <div>
                    <label htmlFor="service" className="label-field">
                      Service Interest
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="input-field"
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
                    <label htmlFor="message" className="label-field">
                      Message <span className="text-sage">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="textarea-field"
                      placeholder="Tell us what you're looking for..."
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={formState === 'submitting'}
                    className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formState === 'submitting' ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Inquiry'
                    )}
                  </button>

                  {formState === 'error' && (
                    <p className="text-red-600 text-sm">
                      Something went wrong. Please try again or contact us directly.
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="lg:pl-8">
              <h2 className="headline-subsection text-ink mb-2">
                Other Ways to Reach Us
              </h2>
              <p className="text-ink/60 mb-8">
                Prefer to reach out directly? We&apos;re here to help.
              </p>

              {/* Contact Cards */}
              <div className="space-y-4">
                {/* Call */}
                <a
                  href={`tel:${contact.phoneClean}`}
                  className="flex items-center gap-4 p-5 bg-ivory rounded-subtle hover:bg-blush/30 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center text-sage group-hover:bg-sage group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-ink">Call or Text</p>
                    <p className="text-sage">{contact.phoneFormatted}</p>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={contact.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 bg-ivory rounded-subtle hover:bg-blush/30 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center text-sage group-hover:bg-sage group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-ink">WhatsApp</p>
                    <p className="text-sage">Message us anytime</p>
                  </div>
                </a>

                {/* Location */}
                <a
                  href={contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 bg-ivory rounded-subtle hover:bg-blush/30 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center text-sage group-hover:bg-sage group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-ink">Visit Us</p>
                    <p className="text-ink/60 text-sm">
                      {contact.address.street}, {contact.address.unit}<br />
                      {contact.address.city}, {contact.address.state} {contact.address.zip}
                    </p>
                  </div>
                </a>
              </div>

              {/* Hours */}
              <div className="mt-8 p-6 bg-sage/5 rounded-subtle">
                <h3 className="font-editorial text-xl text-ink mb-4">Hours</h3>
                <ul className="space-y-2 text-sm">
                  {hours.schedule.map((day) => (
                    <li key={day.day} className="flex justify-between">
                      <span className={day.isOpen ? 'text-ink' : 'text-ink/40'}>
                        {day.day}
                      </span>
                      <span className={day.isOpen ? 'text-sage font-medium' : 'text-ink/40'}>
                        {day.hours}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-ivory py-8">
        <div className="container-editorial">
          <div className="aspect-video md:aspect-[21/9] bg-blush/20 rounded-subtle overflow-hidden">
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
