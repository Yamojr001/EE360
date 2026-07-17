import React, { useEffect, useMemo, useState } from 'react';
import './eefarm.css';

const services = [
  {
    title: 'Farm Management',
    description: 'End-to-end farm management: planning, staffing, record keeping and operational oversight for landowners.',
    image: '/farm-management.jpg'
  },
  {
    title: 'Fingerlings (Catfish)',
    description: 'Healthy fingerlings raised in controlled conditions for pond stocking and farm expansion.',
    image: '/catfish-fingerlings.jpg'
  },
  {
    title: 'Rabbit Production',
    description: 'Hutch-managed batches for consistent lean rabbit meat and breeder stock.',
    image: '/rabbit.jpg'
  },
  {
    title: 'Poultry (Chicken & Chicks)',
    description: 'Table birds and day-old chicks supplied with brooding and rearing guidance on request.',
    image: '/chicken.jpg'
  },
  {
    title: 'Dry & Smoked Fish',
    description: 'Fresh catch smoked and dried for longer shelf life — suitable for retail and wholesale distribution.',
    image: '/smoked-fish.jpg'
  },
  {
    title: 'Pigeon & Small Stock',
    description: 'Breeder and meat pigeons kept to our health and feeding standards for reliable supply.',
    image: '/pigeon.jpg'
  },
  {
    title: 'Egg Supply',
    description: 'Daily-collected eggs supplied to households, retailers and wholesale buyers across Dutse.',
    image: '/eggs.jpg'
  },
  {
    title: 'Catfish (Market Supply)',
    description: 'Catfish grown for market supply and on-site processing into fresh or smoked product.',
    image: '/catfish-market.jpg'
  }
];

const facts = [
  {
    title: 'Documented operating standards',
    sub: 'Feeding, health and sanitation logged across every line.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2 3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7l-9-5z" />
      </svg>
    )
  },
  {
    title: 'Standing supply & bulk orders',
    sub: 'Regular delivery schedules for households, hotels and traders.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="16" y1="2" x2="16" y2="6" />
      </svg>
    )
  },
  {
    title: 'Local employment',
    sub: 'Staffed and supplied from the Sharifai / Dutse community first.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87M9 4.13a4 4 0 0 1 0 7.75M15 4.13a4 4 0 0 1 0 7.75" />
        <circle cx="12" cy="8" r="3" />
      </svg>
    )
  }
];

const managementSteps = [
  { num: '01', title: 'Production planning', text: 'Each line follows a documented production calendar with feed and health targets.' },
  { num: '02', title: 'Site management', text: 'The farm is supervised daily to maintain water quality, sanitation and stock welfare.' },
  { num: '03', title: 'Partner reporting', text: 'Owners and buyers receive clear updates on stock movement, output and delivery plans.' }
];

const whyUs = [
  { title: 'Food security', text: 'We produce across multiple value chains so households and traders can rely on steady supply.', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 12c1-4 5-6 8-7 4 1 7 3 8 7-1 4-5 6-8 7-3-1-7-3-8-7Z" /></svg> },
  { title: 'Sustainable operations', text: 'Our methods are designed to protect the environment while increasing output.', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 13c1-6 5-9 8-9 1.5 0 2.7.6 4 1.7 1.3 1.1 2.2 2.8 2.6 4.8-1.2 1-2.5 1.5-4 1.5-2.2 0-3.9-.8-5.2-2.2C7.8 8.9 6 9 4 13Z" /></svg> },
  { title: 'Trusted quality', text: 'We hold ourselves to strict standards from feed to bottling and final delivery.', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2 3 7v5c0 5 4 8 9 10 5-2 9-5 9-10V7l-9-5Z" /></svg> },
  { title: 'Community impact', text: 'Our work supports jobs, enterprise and food access in Sharifai and Dutse.', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 20v-3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3M12 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" /></svg> }
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const galleryImages = useMemo(() => Array.from({ length: 32 }, (_, i) => ({ src: `/${i + 1}.jpeg`, alt: `EEFarm360 farm scene ${i + 1}` })), []);
  const activeImage = galleryImages[activeSlide] || galleryImages[0];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % galleryImages.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [galleryImages.length]);

  return (
    <div className="landing-page">
      <header>
        <nav className="nav">
          <a href="#top" className="logo" onClick={() => setMenuOpen(false)}>
            <div className="logo-mark">
              <img src="/FarmLogo.png" alt="EEFarm360 logo" />
            </div>
            <div>
              <span className="logo-text">EEFarm360</span>
            </div>
          </a>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`} id="navLinks">
            <li><a href="#stock" onClick={() => setMenuOpen(false)}>Services</a></li>
            <li><a href="#yateem" onClick={() => setMenuOpen(false)}>Yateem Water</a></li>
            <li><a href="#why" onClick={() => setMenuOpen(false)}>Why Us</a></li>
            <li><a href="#contact" className="btn btn-outline-light" onClick={() => setMenuOpen(false)}>Get in Touch</a></li>
          </ul>
          <button 
            className={`burger ${menuOpen ? 'active' : ''}`} 
            aria-label="Toggle menu" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <p style={{ color: '#fff', fontSize: '18px', fontStyle: 'italic', marginBottom: '16px', opacity: 0.9 }}>Growing Value, Feeding the Future</p>
              <h1>Welcome to Excellent Entreprenuership Farm and Ranch Ltd.</h1>
              <p className="lead">EEFarm360 raises catfish and poultry, rabbit, pig, pigeon and livestock, manages farms on behalf of other landowners, and bottles its own Yateem Table Water all from one site in Sharifai Community.</p>
              <div className="hero-cta">
                <a href="#stock" className="btn btn-gold">View Our Services</a>
              </div>
            </div>
          </div>
        </section>

        <section className="about">
          <div className="wrap about-grid">
            <div className="about-copy">
              <span className="label">Who We Are</span>
              <p>Excellent Entrepreneurship Farm and Ranch Limited is a leading multi-faceted agribusiness enterprise based in Dutse, Jigawa State. We operate across diverse agricultural sectors including crop production, aquaculture, poultry, livestock rearing, and niche farming.</p>
              <p>Each line is run to the same operating standard — documented feeding schedules, consistent water and sanitation practice, and stock records that a buyer or partner can actually review before placing an order.</p>
            </div>
            <div className="fact-panel">
              {facts.map((fact) => (
                <div className="fact-row" key={fact.title}>
                  {fact.icon}
                  <div>
                    <div className="f-title">{fact.title}</div>
                    <div className="f-sub">{fact.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="services" id="stock">
          <div className="wrap">
            <div className="section-head">
              <span className="label">Our Services</span>
              <h2>Every service the farm offers, now clearly listed.</h2>
              <p>These services reflect our farm operation from farm management and catfish fingerlings to rabbit, chicken, dry fish, chicks, pigeon and eggs.</p>
            </div>
            <div className="service-grid">
              {services.map((service) => (
                <div className="service-card" key={service.title}>
                  <div className="service-image-wrap">
                    <img src={service.image} alt={service.title} />
                  </div>
                  <h3>{service.title}</h3>
                  <p className="service-desc">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="gallery" id="gallery">
          <div className="wrap">
            <div className="section-head">
              <span className="label">Farm Gallery</span>
              <h2>Photos from around our farm</h2>
              <p>Browse photos of our ponds, pens, processing areas and staff at work. Click any image to view full size.</p>
            </div>
            <div className="gallery-grid">
              <div className="gallery-item featured">
                <div className="gallery-featured-wrap">
                  {activeImage && (
                    <img
                      key={activeImage.src}
                      className="gallery-main-image"
                      src={activeImage.src}
                      alt={activeImage.alt}
                    />
                  )}
                  <button className="carousel-prev" aria-label="Previous" onClick={() => setActiveSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}>&#10094;</button>
                  <button className="carousel-next" aria-label="Next" onClick={() => setActiveSlide((prev) => (prev + 1) % galleryImages.length)}>&#10095;</button>
                  <div className="carousel-dots" role="tablist">
                    {galleryImages.map((image, index) => (
                      <button
                        key={image.src}
                        type="button"
                        aria-label={`Go to slide ${index + 1}`}
                        className={activeSlide === index ? 'active' : ''}
                        onClick={() => setActiveSlide(index)}
                      />
                    ))}
                  </div>
                  <div className="gallery-caption">{activeImage?.alt}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="water" id="yateem">
          <div className="wrap water-grid">
            <div className="water-product">
              <img src="/yateem.png" alt="Yateem table water bottle" />
            </div>
            <div>
              <span className="label">Our Own Bottled Water Brand</span>
              <h2 style={{ marginTop: '12px' }}>Yateem Table Water</h2>
              <p style={{ color: 'var(--ink-700)', fontSize: '16px', maxWidth: '50ch', marginTop: '14px' }}>Sourced, treated and bottled on the same premises as everything else we raise. Yateem applies the same standard we hold ourselves to on feed and animal welfare — to the water people put on their own table.</p>
              <ul className="water-check-list">
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="20 6 9 17 4 12" /></svg>Treated and bottled on site in Sharifai</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="20 6 9 17 4 12" /></svg>Sealed and batch-dated for traceability</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="20 6 9 17 4 12" /></svg>Available by the pack or on wholesale terms</li>
              </ul>
              <a href="#contact" className="btn btn-outline-light">Request Wholesale Pricing</a>
            </div>
          </div>
        </section>

        <section className="why" id="why">
          <div className="wrap">
            <div className="section-head">
              <span className="label">Why Choose Us</span>
              <h2>Built on resilience, quality and consistency.</h2>
            </div>
            <div className="why-grid">
              {whyUs.map((item) => (
                <div className="why-card" key={item.title}>
                  {item.icon}
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap footer-top">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>OUR VALUES</h4>
              <p>Excellence, Integrity and Sustainability are at the heart of everything we do. The synergy between these values is the essence of EEFarm360.</p>
            </div>
            <div className="footer-col">
              <h4>LOCATION</h4>
              <p>Madobi Road<br />Sharifai Community, Dutse<br />Jigawa State, Nigeria</p>
            </div>
            <div className="footer-col">
              <h4>CONTACT US</h4>
              <ul>
                <li>07061444050</li>
                <li>09077640697</li>
                <li>eefarmandranch@gmail.com</li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>GET UPDATES</h4>
              <form className="footer-email-form">
                <input type="email" placeholder="Enter your email..." required />
                <button type="submit">OK</button>
              </form>
              <div className="social-row" style={{ marginTop: '14px' }}>
                <a href="#" aria-label="Facebook" title="Facebook">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="#" aria-label="Instagram" title="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" />
                  </svg>
                </a>
                <a href="#" aria-label="WhatsApp" title="WhatsApp">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 20l1.1-5.4A8.5 8.5 0 1 1 21 11.5z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="wrap footer-bottom">
          <span>© 2026 Excellent Entrepreneurship Farm & Ranch Agro Ltd (RC 1812360). All rights reserved.</span>
          <ul className="footer-bottom-links">
            <li><a href="#top">Back to Top</a></li>
            <li><a href="#stock">Services</a></li>
            <li><a href="#yateem">Yateem Water</a></li>
            <li><a href="#why">Why Us</a></li>
            <li><a href="/login">Login</a></li>
          </ul>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON - STICKY ON SCROLL */}
      <a
        href="https://wa.me/2347061444050"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Chat on WhatsApp"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 20l1.1-5.4A8.5 8.5 0 1 1 21 11.5z" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="8" y1="16" x2="13" y2="16" />
        </svg>
      </a>
    </div>
  );
}
