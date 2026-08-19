"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { images } from "@/config/images";
import { Section } from "@/components/sections/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { fadeUp, staggerContainer, fadeUpViewport } from "@/lib/animations";


export default function ContactPage() {
  return (
    <>
      <PageHero
        heading="LET'S PLAN YOUR ADVENTURE"
        subtitle="Reach out and our team will design your perfect journey."
        image={images.travel}
      />

      <Section background="default" spacing="small">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Contact" },
            ]}
          />
        </Container>
      </Section>

      {/* Contact Cards */}
      <Section background="default" spacing="large">
        <SectionHeading
          eyebrow="Contact"
          title="Get In Touch"
          align="center"
        />

        <motion.div
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          {...fadeUpViewport}
        >
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center rounded-md border border-gold/20 bg-coal/50 p-8 text-center"
          >
            <Mail className="h-8 w-8 text-gold" aria-hidden="true" />
            <h3 className="mt-4 font-display text-lg text-ivory">Email</h3>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="mt-2 text-sm text-muted transition-colors hover:text-gold"
            >
              {siteConfig.contact.email}
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center rounded-md border border-gold/20 bg-coal/50 p-8 text-center"
          >
            <Phone className="h-8 w-8 text-gold" aria-hidden="true" />
            <h3 className="mt-4 font-display text-lg text-ivory">Phone</h3>
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="mt-2 text-sm text-muted transition-colors hover:text-gold"
            >
              {siteConfig.contact.phone}
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center rounded-md border border-gold/20 bg-coal/50 p-8 text-center"
          >
            <MessageCircle className="h-8 w-8 text-gold" aria-hidden="true" />
            <h3 className="mt-4 font-display text-lg text-ivory">Bookings</h3>
            <a
              href={`mailto:${siteConfig.contact.bookingsEmail}`}
              className="mt-2 text-sm text-muted transition-colors hover:text-gold"
            >
              {siteConfig.contact.bookingsEmail}
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center rounded-md border border-gold/20 bg-coal/50 p-8 text-center"
          >
            <MapPin className="h-8 w-8 text-gold" aria-hidden="true" />
            <h3 className="mt-4 font-display text-lg text-ivory">Location</h3>
            <p className="mt-2 text-sm text-muted">{siteConfig.contact.address}</p>
          </motion.div>
        </motion.div>
      </Section>

      {/* Contact Form */}
      <Section background="dark" spacing="large">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl text-ivory">Send Us a Message</h2>
            <p className="mt-4 text-muted">
              Fill out the form and our team will get back to you within 24 hours.
            </p>
          </div>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Message sent! We will contact you soon.");
            }}
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-gold">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-sm border border-gold/30 bg-void/50 px-4 py-3 text-sm text-ivory outline-none transition-colors focus:border-gold"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-gold">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full rounded-sm border border-gold/30 bg-void/50 px-4 py-3 text-sm text-ivory outline-none transition-colors focus:border-gold"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-gold">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full rounded-sm border border-gold/30 bg-void/50 px-4 py-3 text-sm text-ivory outline-none transition-colors focus:border-gold"
                  placeholder="+1 234 567 890"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-gold">
                  Adventure Interest
                </label>
                <select className="w-full rounded-sm border border-gold/30 bg-void/50 px-4 py-3 text-sm text-ivory outline-none transition-colors focus:border-gold">
                  <option value="">Select an adventure</option>
                  <option value="skydiving">Skydiving</option>
                  <option value="jet-skiing">Jet Skiing</option>
                  <option value="hot-air-balloon">Hot Air Balloon</option>
                  <option value="helicopter">Helicopter Ride</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-gold">
                Message
              </label>
              <textarea
                required
                rows={6}
                className="w-full rounded-sm border border-gold/30 bg-void/50 px-4 py-3 text-sm text-ivory outline-none transition-colors focus:border-gold"
                placeholder="Tell us about your dream adventure..."
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright hover:shadow-[0_0_25px_rgba(212,175,55,0.35)] sm:w-auto"
            >
              Send Message
            </button>
          </form>
        </div>
      </Section>
    </>
  );
}
