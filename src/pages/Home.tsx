import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Scan,
  TrendingUp,
  CloudSun,
  ShieldCheck,
  ArrowRight,
  Database,
  Eye,
  AlertCircle,
  FileCheck,
  Send,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import BrandMark from "../components/common/BrandMark";

const FEATURES = [
  {
    icon: Scan,
    title: "AI-Powered Analysis",
    description: "Detects cracks and surface damage using advanced computer vision models.",
  },
  {
    icon: TrendingUp,
    title: "Risk Prediction",
    description: "Projects deterioration risk and structural vulnerability using ML forecasting.",
  },
  {
    icon: CloudSun,
    title: "Environmental Monitoring",
    description: "Fuses rainfall, humidity, AQI, and wind logs to map environmental pressure.",
  },
  {
    icon: ShieldCheck,
    title: "Conservation Insights",
    description: "Generates ranked intervention lists and concrete guidelines for site engineers.",
  },
];

const STEPS = [
  {
    num: "01",
    icon: Database,
    title: "Data Acquisition",
    description: "Telemetry logs, historic data, and smartphone inspect photographs are securely uploaded.",
  },
  {
    num: "02",
    icon: Eye,
    title: "Computer Vision Processing",
    description: "Neural network maps image pixels to identify fissures, discoloration, and organic weathering.",
  },
  {
    num: "03",
    icon: AlertCircle,
    title: "Risk Fusion Calculation",
    description: "Visual scores are cross-referenced with weather patterns to produce a composite risk index.",
  },
  {
    num: "04",
    icon: FileCheck,
    title: "Conservation Task Planning",
    description: "The engine outputs prioritized preservation steps, warning logs, and downloadable reports.",
  },
];

const IMPACTS = [
  {
    value: "94.2%",
    title: "Detection Precision",
    desc: "Average accuracy rate in mapping microscopic stone fractures and fissures.",
  },
  {
    value: "5x",
    title: "Inspection Acceleration",
    desc: "Reduction in typical inspect timelines compared to manual plotting.",
  },
  {
    value: "100%",
    title: "Proactive Protection",
    desc: "Actions mapped to prevent failure before irreversible decay occurs.",
  },
];

export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", message: "" });
      }, 3000);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0F0A06] text-[#FAF5EC] font-body selection:bg-brand-gold/30">
      {/* Sticky Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-brand-gold/10 bg-[#0F0A06]/95 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link to="/" className="transition-opacity hover:opacity-90">
            <BrandMark size="sm" theme="dark" />
          </Link>
          
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#hero" className="text-xs font-semibold text-[#DECBAE] transition-colors hover:text-white">
              Home
            </a>
            <a href="#about" className="text-xs font-semibold text-[#DECBAE] transition-colors hover:text-white">
              About Us
            </a>
            <a href="#features" className="text-xs font-semibold text-[#DECBAE] transition-colors hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="text-xs font-semibold text-[#DECBAE] transition-colors hover:text-white">
              How It Works
            </a>
            <a href="#benefits" className="text-xs font-semibold text-[#DECBAE] transition-colors hover:text-white">
              Impact
            </a>
            <a href="#contact" className="text-xs font-semibold text-[#DECBAE] transition-colors hover:text-white">
              Contact
            </a>
            <span className="h-4 w-px bg-brand-gold/20" />
            <Link to="/dashboard" className="text-xs font-semibold text-brand-gold transition-colors hover:text-white">
              Dashboard
            </Link>
          </nav>
          
          <Link
            to="/dashboard"
            className="rounded-lg bg-[#FAF5EC] px-5 py-2 text-xs font-bold text-[#0F0A06] shadow-md transition-all hover:bg-white"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative flex min-h-[90vh] flex-col justify-end overflow-hidden pt-8">
        {/* Full-bleed background image */}
        <div className="absolute inset-0">
          <img
            src="/hero/hero-temple-bg.jpg"
            alt="Ancient Indian temple at sunset"
            className="h-full w-full object-cover"
          />
          {/* Dark gradient overlays for text legibility, matching reference design */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A06] via-[#0F0A06]/55 to-[#0F0A06]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F0A06]/80 via-[#0F0A06]/20 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-24 lg:px-8">
          {/* Hero Text */}
          <div className="max-w-2xl space-y-6 animate-fade-up">
            <h1 className="font-display text-5xl font-medium leading-[1.1] text-white sm:text-6xl lg:text-7xl">
              Protecting <br />
              Our Heritage, <br />
              Preserving <span className="text-brand-gold">Our Future.</span>
            </h1>
            <p className="max-w-md text-sm text-[#DECBAE]/80 leading-relaxed">
              HeritageGuard uses AI and environmental analytics to monitor the health of heritage sites and predict deterioration risk.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 rounded-lg bg-brand-gold px-6 py-3 text-xs font-bold text-[#100B07] shadow-lg transition-all hover:brightness-110"
              >
                Explore Dashboard
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#about"
                className="group inline-flex items-center gap-2 rounded-lg border border-[#DECBAE]/30 px-6 py-3 text-xs font-bold text-white transition-all hover:bg-white/5 hover:border-white"
              >
                Learn More
                <ArrowRight size={14} className="opacity-70 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Features row strip directly integrated inside Hero */}
          <div className="mt-16 border-t border-white/10 pt-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(({ icon: Icon, title, description }, idx) => (
                <div key={idx} className="group flex flex-col gap-3 rounded-lg bg-[#18120D]/70 p-5 border border-white/10 backdrop-blur-sm transition-all hover:border-brand-gold/30 hover:bg-[#1E1711]/80">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold">
                    <Icon size={18} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-white text-xs">{title}</h3>
                    <p className="mt-1.5 text-[11px] text-[#DECBAE]/70 leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="relative border-t border-brand-gold/10 py-24 bg-[#140E0A]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            
            {/* Title & Introduction */}
            <div className="space-y-4 lg:col-span-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block">About Us</span>
              <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">Preserving History via Intelligence</h2>
              <p className="text-sm text-[#DECBAE]/80 leading-relaxed">
                HeritageGuard bridges the gap between historical architecture preservation and modern computing. Cultural monuments are subjected to worsening climate extremes, acid pollution, and heavy visitor traffic.
              </p>
              <p className="text-sm text-[#DECBAE]/80 leading-relaxed">
                Our technology leverages state-of-the-art computer vision to analyze visual decay automatically, predicting structural vulnerabilities years before physical failures materialize.
              </p>
            </div>

            {/* Statistics details */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="rounded-xl border border-brand-gold/10 bg-[#1A130E] p-6 sm:p-8 space-y-6">
                <h3 className="text-sm font-semibold text-brand-gold uppercase tracking-wider">The Threats We Address</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-[#0F0A06] p-4 border border-brand-gold/5">
                    <h4 className="font-semibold text-white text-xs">Micro-crack Progression</h4>
                    <p className="mt-1 text-[11px] text-[#DECBAE]/70 leading-relaxed">Hairline cracks grow over monsoons as moisture freezes and expands inside stone carvings.</p>
                  </div>
                  <div className="rounded-lg bg-[#0F0A06] p-4 border border-brand-gold/5">
                    <h4 className="font-semibold text-white text-xs">Environmental Hazards</h4>
                    <p className="mt-1 text-[11px] text-[#DECBAE]/70 leading-relaxed">Acid deposition and smog chemically dissolve red sandstone and marble monuments.</p>
                  </div>
                  <div className="rounded-lg bg-[#0F0A06] p-4 border border-brand-gold/5">
                    <h4 className="font-semibold text-white text-xs">Visitor Stress</h4>
                    <p className="mt-1 text-[11px] text-[#DECBAE]/70 leading-relaxed">Heavy human footfall accelerates friction wear on sensitive pathways and stone bas-reliefs.</p>
                  </div>
                  <div className="rounded-lg bg-[#0F0A06] p-4 border border-brand-gold/5">
                    <h4 className="font-semibold text-white text-xs">Delayed Intervention</h4>
                    <p className="mt-1 text-[11px] text-[#DECBAE]/70 leading-relaxed">Manual inspection takes months, leaving monuments vulnerable during rapid climate shocks.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative border-t border-brand-gold/10 py-24 bg-[#0F0A06]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block">Platform Capabilities</span>
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">System Features</h2>
            <p className="text-xs text-[#DECBAE]/80">Modular architecture engineered to ingest multi-source telemetry and supply actionable priorities.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, description }, idx) => (
              <div key={idx} className="group flex flex-col justify-between rounded-xl bg-[#18120D] p-6 border border-brand-gold/5 hover:border-brand-gold/25 hover:bg-[#1E1711] transition-all duration-300 shadow-sm">
                <div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold group-hover:scale-105 transition-transform duration-300">
                    <Icon size={20} />
                  </span>
                  <h3 className="font-semibold text-white text-sm mt-5">{title}</h3>
                  <p className="mt-2 text-xs text-[#DECBAE]/70 leading-relaxed">{description}</p>
                </div>
                <div className="pt-6 border-t border-brand-gold/5 mt-6">
                  <Link to="/dashboard" className="text-[10px] font-bold uppercase tracking-wider text-brand-gold hover:text-white flex items-center gap-1">
                    Explore module <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative border-t border-brand-gold/10 py-24 bg-[#140E0A]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block">Workflows</span>
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">How It Works</h2>
            <p className="text-xs text-[#DECBAE]/80">Four key stages that convert raw sensor feeds into active structural preservation guidelines.</p>
          </div>

          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Visual connector line for timeline desktop */}
            <div className="absolute top-[48px] left-[5%] right-[5%] h-0.5 bg-brand-gold/10 hidden md:block" />

            {STEPS.map(({ num, icon: Icon, title, description }, idx) => (
              <div key={idx} className="relative group space-y-4">
                {/* Node connector dot */}
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold bg-[#140E0A] font-mono text-xs font-bold text-brand-gold group-hover:bg-brand-gold group-hover:text-[#100B07] transition-all duration-300">
                  {num}
                </div>
                <div className="rounded-xl border border-brand-gold/5 bg-[#18120D] p-5 hover:border-brand-gold/20 hover:bg-[#1E1711] transition-all duration-300">
                  <span className="inline-flex text-brand-gold mb-3">
                    <Icon size={18} />
                  </span>
                  <h3 className="font-semibold text-white text-xs">{title}</h3>
                  <p className="mt-1.5 text-[11px] text-[#DECBAE]/70 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits / Impact Section */}
      <section id="benefits" className="relative border-t border-brand-gold/10 py-24 bg-[#0F0A06]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block">Outcomes</span>
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">System Impact</h2>
            <p className="text-xs text-[#DECBAE]/80">Quantifiable enhancements achieved by moving conservation tasks to data-driven forecasting.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {IMPACTS.map(({ value, title, desc }, idx) => (
              <div key={idx} className="group rounded-xl border border-brand-gold/5 bg-[#18120D] p-8 text-center hover:border-brand-gold/20 hover:bg-[#1E1711] transition-all duration-300">
                <span className="font-display text-5xl font-bold text-white block mb-2">{value}</span>
                <h3 className="font-semibold text-brand-gold text-xs uppercase tracking-wider mb-2">{title}</h3>
                <p className="text-xs text-[#DECBAE]/75 leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative border-t border-brand-gold/10 py-24 bg-[#140E0A]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            
            {/* Contact Info Card */}
            <div className="space-y-6 lg:col-span-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block">Get In Touch</span>
                <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl mt-1">Contact Us</h2>
                <p className="text-xs text-[#DECBAE]/80 mt-2">Connect with our conservation software division for custom integrations.</p>
              </div>

              <div className="space-y-4 text-xs text-[#DECBAE]/90">
                <div className="flex items-center gap-3.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold shrink-0">
                    <Mail size={14} />
                  </span>
                  <span>support@heritageguard.org</span>
                </div>
                <div className="flex items-center gap-3.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold shrink-0">
                    <MapPin size={14} />
                  </span>
                  <span>National Archeological Bureau, New Delhi, India</span>
                </div>
                <div className="flex items-center gap-3.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold shrink-0">
                    <Phone size={14} />
                  </span>
                  <span>+91 11 2301-5244</span>
                </div>
              </div>
            </div>

            {/* Message Form panel */}
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-brand-gold/10 bg-[#18120D] p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5 text-xs text-[#DECBAE]/80" htmlFor="contact-name">
                      Full Name
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="rounded-lg border border-brand-gold/15 bg-[#0F0A06] px-3 py-2.5 text-xs font-semibold text-white placeholder:text-gray-500 focus:border-brand-gold focus:outline-none transition-all shadow-sm"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-xs text-[#DECBAE]/80" htmlFor="contact-email">
                      Email Address
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="rounded-lg border border-brand-gold/15 bg-[#0F0A06] px-3 py-2.5 text-xs font-semibold text-white placeholder:text-gray-500 focus:border-brand-gold focus:outline-none transition-all shadow-sm"
                      />
                    </label>
                  </div>
                  <label className="flex flex-col gap-1.5 text-xs text-[#DECBAE]/80" htmlFor="contact-message">
                    Message Details
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      placeholder="Write your query here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="rounded-lg border border-brand-gold/15 bg-[#0F0A06] px-3 py-2.5 text-xs font-semibold text-white placeholder:text-gray-500 focus:border-brand-gold focus:outline-none transition-all shadow-sm resize-none"
                    />
                  </label>
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-gold px-4 py-2.5 text-xs font-bold text-[#100B07] shadow-md hover:brightness-110 transition-all"
                  >
                    <Send size={12} />
                    <span>Send Message</span>
                  </button>
                </form>
                {submitted && (
                  <p className="mt-3 text-center text-xs font-semibold text-brand-gold animate-pulse">
                    Thank you! Your message has been sent successfully.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section id="cta" className="relative border-t border-brand-gold/10 py-20 bg-[#0F0A06] flex items-center justify-center text-center overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute inset-0 h-40 w-40 bg-brand-gold/5 blur-3xl mx-auto top-10" />
        
        <div className="relative z-10 max-w-2xl px-6 space-y-6">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl leading-tight">Ready to Protect Our Shared History?</h2>
          <p className="text-xs text-[#DECBAE]/80 max-w-md mx-auto leading-relaxed">
            Gain immediate access to predictive intelligence models, image analytics logs, and ranked conservation intervention reports.
          </p>
          <div className="pt-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-gold px-8 py-3 text-xs font-bold text-[#100B07] shadow-lg transition-all hover:brightness-110"
            >
              Get Started
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative border-t border-brand-gold/10 py-12 bg-[#0C0805]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <BrandMark size="sm" theme="dark" />
              <p className="text-[10px] text-[#DECBAE]/50 max-w-xs leading-relaxed">
                Conservation intelligence platform powered by computer vision and climate telemetry metrics.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-[#DECBAE]/60 font-semibold">
              <a href="#hero" className="hover:text-white transition-colors">Home</a>
              <a href="#about" className="hover:text-white transition-colors">About Us</a>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#benefits" className="hover:text-white transition-colors">Impact</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-brand-gold/5 pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-[10px] text-[#DECBAE]/40 font-semibold">
            <p>&copy; {new Date().getFullYear()} HeritageGuard. All rights reserved.</p>
            <p>Demo build running on mock data mode.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
