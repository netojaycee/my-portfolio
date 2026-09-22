"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "../ui/SectionHeader";
import { Code2, Server, Globe, ShieldCheck } from "lucide-react";

const stats = [
  { label: "Monthly Pageviews Managed", value: "23M+", icon: Globe },
  { label: "SaaS Products Shipped Solo", value: "7", icon: Server },
  { label: "Years Experience", value: "5+", icon: Code2 },
  { label: "504 Outage: Diagnosed & Fixed", value: "15min", icon: ShieldCheck },
];

export function About() {
  return (
    <section id="about" className="py-28 md:py-36 bg-bg">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-28 items-start">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            <SectionHeader
              title="I fix production, then I build the next thing."
              subtitle="Mechanical engineering graduate turned production infrastructure and SaaS builder — I run the servers and write the code that runs on them."
            />

            <div className="space-y-5 text-muted font-lora text-[1.05rem] leading-[1.85]">
              <p>
                John Chinonso Edeh is a Full-Stack and DevOps Engineer in Lagos,
                Nigeria.
              </p>
              <p>
                He runs production infrastructure for{" "}
                <strong className="text-text font-semibold">The Punch Nigeria Ltd</strong>,
                the country&apos;s largest news publisher — a self-managed Docker /
                Nginx / PHP-FPM / MySQL / Redis stack on AWS serving{" "}
                <strong className="text-text font-semibold">23M+ pageviews a month</strong>.
                Recent work: root-caused a full-site 504 outage down to a
                memory-limit conflict between two unrelated commits and fixed it
                live in 15 minutes; found and closed a reflected XSS
                vulnerability; cut editor publish latency from 40+ seconds to
                normal by tracing three blocking calls through New Relic; stopped
                a 15,000-request sitemap-scraper stampede that was taking the
                site down nightly.
              </p>
              <p>
                In parallel he ships his own products end to end — architecture,
                backend, frontend, and the infrastructure they run on. Multi-tenant
                SaaS with dual deployment modes, marketplace platforms with
                real-time negotiation and FIFO cost engines, e-commerce with live
                Stripe payments. Production systems used by real businesses, not
                tutorials.
              </p>
            </div>
          </motion.div>

          {/* Right: Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 lg:pt-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                className="p-7 rounded-2xl bg-surface border border-border group hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-5 group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-3xl md:text-4xl font-syne font-bold text-text mb-1.5 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[10px] font-mono text-muted uppercase tracking-[0.18em]">
                  {stat.label}
                </div>
              </motion.div>
            ))}

            {/* CTA Banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="sm:col-span-2 relative p-7 rounded-2xl bg-accent flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden"
            >
              <div className="relative z-10">
                <h4 className="text-xl font-syne font-bold text-white mb-1">
                  Available for collaborations
                </h4>
                <p className="text-white/75 font-lora text-sm">
                  Looking for a DevOps-savvy Full-Stack engineer?
                </p>
              </div>
              <a
                href="#contact"
                className="relative z-10 shrink-0 h-11 px-7 bg-white text-accent font-syne font-bold text-sm uppercase tracking-[0.15em] rounded-lg hover:bg-white/90 transition-all flex items-center justify-center"
              >
                Let&apos;s Talk
              </a>
              <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -left-4 -bottom-8 w-24 h-24 bg-black/10 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
