'use client';

import Link from 'next/link';
import Image from 'next/image';
import { brand, contact, hours, services, social, booking } from '@/lib/config/brand';
import { AnimatedSection, StaggerContainer, StaggerItem, AnimatedCounter } from '@/components/ui/AnimatedSection';
import { ParticleField, SparkleField } from '@/components/ui/ParticleField';
import { GlassCard, ServiceCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { TestimonialCarousel } from '@/components/ui/TestimonialCarousel';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Enhanced with particles */}
      <section className="relative min-h-[100vh] flex items-center bg-bg overflow-hidden">
        {/* Particle background - hidden on mobile for performance */}
        <div className="absolute inset-0 hidden md:block">
          <ParticleField particleCount={40} color="#D4AF37" />
        </div>

        {/* Mobile sparkles - lighter effect */}
        <div className="absolute inset-0 md:hidden">
          <SparkleField />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 z-[1]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] md:w-[800px] md:h-[800px] bg-gradient-radial from-gold/8 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-gradient-radial from-rose/8 via-transparent to-transparent opacity-70" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-radial from-accent/5 via-transparent to-transparent opacity-50" />
        </div>

        {/* Vignette effect */}
        <div className="absolute inset-0 vignette z-[2]" />

        <div className="container-luxury relative z-10 py-20 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="max-w-xl">
              {/* Overline */}
              <AnimatedSection delay={0}>
                <p className="text-sm tracking-[0.25em] uppercase mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-gradient-to-r from-rose to-transparent" />
                  <span className="text-rose">West Park, FL</span>
                  <span className="text-ivory/20">|</span>
                  <span className="text-gold">Luxury Beauty Studio</span>
                </p>
              </AnimatedSection>

              {/* Main Heading */}
              <AnimatedSection delay={0.1}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-ivory leading-[1.1] mb-6">
                  {brand.name.split("'")[0]}&apos;s{' '}
                  <span className="block font-serif italic text-gradient-gold-rose">Beauty Box</span>
                </h1>
              </AnimatedSection>

              {/* Tagline */}
              <AnimatedSection delay={0.2}>
                <p className="text-xl md:text-2xl text-rose/90 font-serif italic mb-6">
                  {brand.tagline}
                </p>
              </AnimatedSection>

              {/* Description */}
              <AnimatedSection delay={0.3}>
                <p className="text-lg text-ivory/60 leading-relaxed mb-10 max-w-md">
                  {brand.description} Experience beauty services that make you feel confident, radiant, and blessed.
                </p>
              </AnimatedSection>

              {/* CTAs */}
              <AnimatedSection delay={0.4}>
                <div className="flex flex-wrap gap-4 mb-12">
                  <Button
                    href={booking.primaryUrl || '/book'}
                    variant="primary"
                    size="lg"
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    }
                  >
                    Book Now
                  </Button>
                  <Button href="/services" variant="secondary" size="lg">
                    View Services
                  </Button>
                </div>
              </AnimatedSection>

              {/* Motto */}
              <AnimatedSection delay={0.5}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-px bg-gradient-to-r from-accent/50 to-transparent" />
                  <p className="text-accent/80 font-serif italic text-lg">
                    &ldquo;{brand.motto}&rdquo;
                  </p>
                </div>
              </AnimatedSection>
            </div>

            {/* Right Content - Logo Display */}
            <AnimatedSection delay={0.3} direction="right" className="relative hidden lg:flex items-center justify-center">
              <div className="relative">
                {/* Outer glow */}
                <motion.div
                  className="absolute inset-[-60px] bg-gradient-radial from-gold/15 via-transparent to-transparent blur-3xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Logo container */}
                <motion.div
                  className="relative w-[340px] h-[340px] rounded-full"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {/* Animated border ring */}
                  <div className="absolute inset-[-4px] rounded-full animate-border-flow p-[2px]">
                    <div className="w-full h-full rounded-full bg-bg" />
                  </div>

                  {/* Logo */}
                  <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-gold/20">
                    <Image
                      src={brand.logo.main}
                      alt={brand.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </motion.div>

                {/* Decorative rings */}
                <div className="absolute inset-[-30px] rounded-full border border-rose/10 animate-pulse" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-[-60px] rounded-full border border-gold/5" />
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-xs text-ivory/40 uppercase tracking-widest">Scroll</span>
          <motion.div
            className="w-6 h-10 rounded-full border border-ivory/20 flex items-start justify-center p-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-2 bg-gold rounded-full"
              animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Services Preview Section */}
      <section className="py-24 md:py-32 bg-bg relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        <div className="container-luxury">
          {/* Section Header */}
          <AnimatedSection className="text-center mb-16 md:mb-20">
            <p className="text-rose text-sm tracking-[0.25em] uppercase mb-4 flex items-center justify-center gap-3">
              <span className="w-8 h-px bg-gradient-to-r from-transparent to-rose/50" />
              What We Offer
              <span className="w-8 h-px bg-gradient-to-l from-transparent to-rose/50" />
            </p>
            <h2 className="text-4xl md:text-5xl font-medium text-ivory mb-6">
              Our <span className="font-serif italic text-gradient-gold">Services</span>
            </h2>
            <p className="text-ivory/50 max-w-2xl mx-auto text-lg leading-relaxed">
              From stunning hair transformations to flawless makeup artistry, we offer premium beauty services to enhance your natural radiance.
            </p>
          </AnimatedSection>

          {/* Services Grid */}
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8" staggerDelay={0.1}>
            {services.categories.map((category) => (
              <StaggerItem key={category.id}>
                <Link href={`/services#${category.id}`} className="block h-full">
                  <ServiceCard
                    icon={<ServiceIcon icon={category.icon} />}
                    title={category.name}
                    description={category.description}
                    items={category.services.slice(0, 3).map(s => s.name)}
                    className="h-full"
                  />
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* View All CTA */}
          <AnimatedSection delay={0.4} className="text-center mt-12">
            <Button href="/services" variant="ghost" icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            }>
              See All Services
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-bg-soft border-y border-gold/10">
        <div className="container-luxury">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8" staggerDelay={0.1}>
            <StaggerItem>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-serif text-gold mb-2">
                  <AnimatedCounter value={500} suffix="+" />
                </div>
                <p className="text-sm text-ivory/50 uppercase tracking-wider">Happy Clients</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-serif text-gold mb-2">
                  <AnimatedCounter value={5} suffix="+" />
                </div>
                <p className="text-sm text-ivory/50 uppercase tracking-wider">Years Experience</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-serif text-gold mb-2">
                  <AnimatedCounter value={15} suffix="+" />
                </div>
                <p className="text-sm text-ivory/50 uppercase tracking-wider">Services Offered</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-serif text-gold mb-2">5.0</div>
                <div className="flex justify-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-ivory/50 uppercase tracking-wider">Rating</p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 md:py-32 bg-bg relative overflow-hidden">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Features */}
            <div>
              <AnimatedSection>
                <p className="text-rose text-sm tracking-[0.25em] uppercase mb-4 flex items-center gap-3">
                  <span className="w-8 h-px bg-gradient-to-r from-rose/50 to-transparent" />
                  Why Choose Us
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <h2 className="text-4xl md:text-5xl font-medium text-ivory mb-10">
                  Beauty with <span className="font-serif italic text-gradient-gold">Purpose</span>
                </h2>
              </AnimatedSection>

              <StaggerContainer className="space-y-6" staggerDelay={0.15}>
                <StaggerItem>
                  <div className="flex gap-5 group">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-bg transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-ivory mb-2 group-hover:text-gold transition-colors">Faith-Forward Service</h3>
                      <p className="text-ivory/50 leading-relaxed">We believe in serving with love, grace, and excellence in everything we do. Your experience matters to us.</p>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex gap-5 group">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-rose/10 flex items-center justify-center text-rose group-hover:bg-rose group-hover:text-ivory transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-ivory mb-2 group-hover:text-rose transition-colors">Personalized Experience</h3>
                      <p className="text-ivory/50 leading-relaxed">Every client is unique. We tailor our services to enhance your natural beauty and make you feel your best.</p>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex gap-5 group">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-ivory transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-ivory mb-2 group-hover:text-accent transition-colors">Premium Quality</h3>
                      <p className="text-ivory/50 leading-relaxed">We use only the highest quality products and techniques to ensure stunning, long-lasting results.</p>
                    </div>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>

            {/* Right - Hours Card */}
            <AnimatedSection delay={0.2} direction="right">
              <GlassCard className="p-8 md:p-10">
                <h3 className="text-2xl font-medium text-ivory mb-8 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Studio <span className="text-gold">Hours</span>
                </h3>

                <div className="space-y-3 mb-8">
                  {hours.schedule.map((day, index) => (
                    <motion.div
                      key={day.day}
                      className="flex justify-between items-center py-3 border-b border-ivory/5 last:border-0"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <span className={`text-sm ${day.isOpen ? 'text-ivory' : 'text-ivory/30'}`}>
                        {day.day}
                      </span>
                      <span className={`text-sm font-medium ${day.isOpen ? 'text-gold' : 'text-ivory/30'}`}>
                        {day.hours}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Button
                    href={`tel:${contact.phoneClean}`}
                    variant="primary"
                    fullWidth
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    }
                    iconPosition="left"
                  >
                    Call {contact.phoneFormatted}
                  </Button>

                  <Button
                    href={contact.mapsUrl}
                    variant="secondary"
                    fullWidth
                    external
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    }
                    iconPosition="left"
                  >
                    Get Directions
                  </Button>
                </div>
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 md:py-32 bg-bg-soft relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-rose/5 rounded-full blur-3xl" />
        </div>

        <div className="container-luxury relative z-10">
          <AnimatedSection className="text-center mb-16">
            <p className="text-rose text-sm tracking-[0.25em] uppercase mb-4 flex items-center justify-center gap-3">
              <span className="w-8 h-px bg-gradient-to-r from-transparent to-rose/50" />
              Client Love
              <span className="w-8 h-px bg-gradient-to-l from-transparent to-rose/50" />
            </p>
            <h2 className="text-4xl md:text-5xl font-medium text-ivory mb-4">
              What Our <span className="font-serif italic text-gradient-gold">Clients</span> Say
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <TestimonialCarousel />
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-bg relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-rose/5 rounded-full blur-3xl" />
        </div>

        <div className="container-luxury relative z-10">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-gold/20 to-rose/20 flex items-center justify-center"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <svg className="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                </svg>
              </motion.div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-ivory mb-6">
                Ready to Feel{' '}
                <span className="font-serif italic text-gradient-gold-rose">Beautiful?</span>
              </h2>
              <p className="text-xl text-ivory/50 mb-10 max-w-xl mx-auto leading-relaxed">
                Book your appointment today and experience the {brand.name} difference. Your transformation awaits.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  href={booking.primaryUrl || '/book'}
                  variant="primary"
                  size="lg"
                  className="animate-glow-pulse"
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  }
                >
                  Book Your Appointment
                </Button>
                <Button href="/beauty-concierge" variant="secondary" size="lg">
                  Find Your Look
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="py-16 bg-bg border-t border-gold/10">
        <div className="container-luxury">
          <AnimatedSection className="text-center">
            <p className="text-ivory/40 mb-4 text-sm uppercase tracking-widest">Follow the Journey</p>
            <a
              href={social.instagram?.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-rose hover:text-rose-soft transition-colors text-xl group"
            >
              <motion.span
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </motion.span>
              <span className="font-medium">{social.instagram?.handle || '@stephsbeautybox_'}</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

// Service icon component
function ServiceIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    sparkle: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    scissors: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.331 4.331 0 0010.607 12m3.736 0l7.794 4.5-.802.215a4.5 4.5 0 01-2.48-.043l-5.326-1.629a4.324 4.324 0 01-2.068-1.379M14.343 12l-2.882 1.664" />
      </svg>
    ),
    lipstick: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    eyebrow: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  };

  return icons[icon] || icons.sparkle;
}
