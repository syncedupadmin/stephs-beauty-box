import Link from 'next/link';
import Image from 'next/image';
import { brand, contact, hours, social, navigation } from '@/lib/config/brand';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-soft border-t border-gold/10">
      {/* Main Footer Content */}
      <div className="container-luxury py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6 transition-transform duration-300 hover:scale-105">
              <Image
                src={brand.logo.main}
                alt={brand.name}
                width={120}
                height={120}
                className="h-24 w-auto object-contain rounded-full border-2 border-gold/20"
              />
            </Link>
            <h3 className="text-xl font-serif text-gold mb-2">{brand.name}</h3>
            <p className="text-ivory/60 text-sm leading-relaxed mb-4">
              {brand.description}
            </p>
            <p className="text-rose font-serif italic text-sm">
              {brand.motto}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              {social.instagram && (
                <a
                  href={social.instagram.url}
                  className="p-2 text-ivory/40 hover:text-rose transition-colors duration-200"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              )}
              {social.threads && (
                <a
                  href={social.threads.url}
                  className="p-2 text-ivory/40 hover:text-rose transition-colors duration-200"
                  aria-label="Threads"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.88-.73 2.088-1.146 3.6-1.242 1.02-.064 1.973-.013 2.86.152-.1-.628-.314-1.14-.652-1.55-.47-.57-1.18-.859-2.107-.859h-.045c-.767.007-1.512.234-2.036.622l-1.23-1.63c.89-.674 2.04-1.038 3.318-1.053 1.5.013 2.71.524 3.6 1.523.783.875 1.24 2.005 1.364 3.362.435.199.84.44 1.206.72 1.044.8 1.792 1.86 2.165 3.065.493 1.59.388 3.603-1.09 5.49-1.848 2.36-4.71 3.212-8.187 3.212zm-.09-5.894c1.143-.066 1.96-.47 2.43-1.202.478-.745.67-1.77.573-3.05l-.028-.016c-.78-.167-1.636-.236-2.572-.181-1.104.069-1.96.358-2.478.837-.476.44-.683.977-.648 1.598.045.793.396 1.4 1.015 1.752.588.336 1.308.33 1.708.262z"/>
                  </svg>
                </a>
              )}
              {social.youtube && (
                <a
                  href={social.youtube.url}
                  className="p-2 text-ivory/40 hover:text-rose transition-colors duration-200"
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-gold text-sm font-medium uppercase tracking-wider mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {navigation.main.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ivory/60 hover:text-gold text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {navigation.footer.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ivory/60 hover:text-gold text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-gold text-sm font-medium uppercase tracking-wider mb-6">
              Studio Hours
            </h3>
            <ul className="space-y-2">
              {hours.schedule.map((day) => (
                <li key={day.day} className="flex justify-between text-sm">
                  <span className={day.isOpen ? 'text-ivory/80' : 'text-ivory/40'}>
                    {day.day}
                  </span>
                  <span className={day.isOpen ? 'text-gold' : 'text-ivory/40'}>
                    {day.hours}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gold text-sm font-medium uppercase tracking-wider mb-6">
              Visit Us
            </h3>
            <address className="not-italic text-sm text-ivory/60 space-y-3">
              <p>
                <a
                  href={contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  {contact.address.street}<br />
                  {contact.address.unit}<br />
                  {contact.address.city}, {contact.address.state} {contact.address.zip}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${contact.phoneClean}`}
                  className="hover:text-gold transition-colors"
                >
                  {contact.phoneFormatted}
                </a>
              </p>
              {contact.email && (
                <p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-gold transition-colors"
                  >
                    {contact.email}
                  </a>
                </p>
              )}
            </address>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold/5">
        <div className="container-luxury py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-ivory/40 text-xs">
              &copy; {currentYear} {brand.name}. All rights reserved.
            </p>
            <p className="text-ivory/30 text-xs">
              Powered by{' '}
              <a
                href="https://syncedup.io"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                SyncedUp
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
