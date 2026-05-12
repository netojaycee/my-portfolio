import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("Cleaning up database...");
  await prisma.tag.deleteMany();
  await prisma.bullet.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();
  await prisma.highlight.deleteMany();
  await prisma.stackItem.deleteMany();
  await prisma.projectImage.deleteMany();
  await prisma.project.deleteMany();

  console.log("Seeding projects...");

  // 1. XFinance
  const xfinance = await prisma.project.create({
    data: {
      slug: "xfinance",
      name: "XFinance",
      tagline: "Multi-Tenant Finance & Accounting SaaS",
      order: 1,
      featured: true,
      status: "LIVE",
      category: "SAAS",
      liveUrl: "https://xfinance.ng",
      description: "A production-grade financial management platform supporting both hosted SaaS and self-hosted standalone deployments. Covers general ledger, banking, payroll, inventory, and audit tracking across multiple business entities — with real-time updates via Socket.IO and a dual-mode architecture that serves enterprise clients and single installations from the same codebase.",
      caseStudy: `## The Problem

Nigerian businesses managing multiple entities — subsidiaries, departments, branch offices — had no affordable, locally-built accounting SaaS that understood their operating context. Enterprise tools were too expensive and foreign. Local tools were too simple.

## The Solution

XFinance is a multi-tenant Finance and Accounting SaaS with a dual deployment model. Businesses use the hosted SaaS at xfinance.ng with full multi-tenancy, or deploy the standalone Docker image for a single-client on-premise installation. Same codebase. Different runtime mode.

## The Architecture Decision That Defines It

The dual deployment mode was the core architectural challenge. A single environment variable — \`DEPLOYMENT_MODE\` — switches the entire application context. In SaaS mode, subdomain routing identifies the tenant group, the super admin panel is active, and subscription gating controls feature access. In standalone mode, a fixed \`DEFAULT_GROUP_ID\` is injected at startup. No subscription checks. No subdomain routing. No super admin overhead.

This means enterprise clients get a fully white-labelled, self-hosted installation while the SaaS product evolves from the same repository.

## Data Scoping

Every Prisma model carries a \`groupId\`. The request context sets it once on authentication — it is never re-queried from the database mid-request. Tenant isolation is enforced at the ORM layer, making it both fast and auditable. Any query missing a \`groupId\` scope would be caught immediately in review.

## Real-Time Updates

Finance dashboards need to reflect live data. Socket.IO powers a real-time sidebar that updates automatically when a payroll run completes, a bank reconciliation is confirmed, or inventory levels change. No polling. No manual refresh.

## CI/CD

GitHub Actions builds Docker images in parallel and pushes to GHCR on every push to main. The SaaS instance auto-deploys from the :latest tag. Standalone clients run Watchtower, which monitors the :stable tag and self-updates when a new image is promoted — zero manual intervention required for client upgrades.

## Key Features

- General Ledger with double-entry bookkeeping
- Bank reconciliation module  
- Payroll with deduction management
- Store inventory tracking
- Full audit logging with change history
- Per-tenant logo and colour theme branding
- Subscription management (SaaS mode only)
- Self-update via Watchtower (standalone mode)`,
      stack: {
        create: [
          { name: "NestJS", category: "BACKEND" },
          { name: "Next.js", category: "FRONTEND" },
          { name: "PostgreSQL", category: "DATABASE" },
          { name: "Prisma", category: "BACKEND" },
          { name: "Redis", category: "DATABASE" },
          { name: "Socket.IO", category: "BACKEND" },
          { name: "Docker", category: "DEVOPS" },
          { name: "GitHub Actions", category: "DEVOPS" },
          { name: "GHCR", category: "DEVOPS" },
          { name: "Watchtower", category: "DEVOPS" },
          { name: "Cloudinary", category: "INFRA" },
        ],
      },
      highlights: {
        create: [
          { text: "Dual deployment architecture — DEPLOYMENT_MODE=saas enables full multi-tenancy with subdomain routing and super admin; standalone mode bypasses subscription gates for single-client on-premise deployments", order: 1 },
          { text: "All data scoped by groupId on every Prisma model, sourced from request context — never re-queried from the database mid-request, keeping tenant isolation fast and auditable", order: 2 },
          { text: "Real-time sidebar updates via Socket.IO — balance sheets, payroll summaries, and audit logs update instantly across all connected clients", order: 3 },
          { text: "CI/CD runs parallel Docker image builds to GHCR on every push to main; standalone clients self-update via Watchtower watching a :stable tag — zero manual intervention for client upgrades", order: 4 },
          { text: "Per-group branding — each tenant configures their own logo and colour theme, served from their subdomain", order: 5 },
        ],
      },
    },
  });

  // 2. Fuelsgate
  const fuelsgate = await prisma.project.create({
    data: {
      slug: "fuelsgate",
      name: "Fuelsgate",
      tagline: "B2B Petroleum Marketplace & Station Management Platform",
      order: 2,
      featured: false,
      status: "LIVE",
      category: "MARKETPLACE",
      liveUrl: "https://fuelsgate.com",
      description: "A full-scale B2B fuel industry platform for Nigeria — covering marketplace trading between buyers, depot sellers, and transporters, plus a dedicated operational layer for retail station management with a FIFO-based P&L engine per delivery batch.",
      caseStudy: `## The Problem

Nigeria's downstream petroleum sector runs on informal networks. Fuel purchases, transport negotiations, and station accounting happen via phone calls, WhatsApp groups, and paper ledgers. Depot owners have no digital storefront. Station managers track profitability in spreadsheets. Transporters negotiate rates blind.

## The Solution

Fuelsgate is two products in one: a B2B petroleum marketplace connecting buyers, depot traders, and transporters — and a retail station management system with a FIFO P&L engine. Both share the same NestJS backend and auth system but serve completely different user workflows.

## The Marketplace

Buyers browse product listings posted by depot owners and traders. When interested, they send an RFQ. The seller responds with a counter-offer. This isn't just messaging — it's a structured negotiation UI where each party can see the current offer, submit a counter, or accept. The entire flow is WebSocket-powered, so responses appear in real time.

Once price is agreed, the buyer selects a transporter. The same negotiation pattern repeats for transport cost. A fare calculator uses Google Maps to compute distance between loading point and destination, then applies configurable cost parameters — giving both parties a data-backed starting point for negotiation.

## The FIFO P&L Engine

This is the technical core of the station management layer. A \`DeliveryLedger\` document is created per tank per delivery — not per truck. A single truck might deliver to four tanks. Four ledger documents are created, each carrying that tank's share of the delivery costs, calculated pro-rata by volume.

When a station manager records daily pump readings, the system attributes sales to the oldest ledger first (FIFO). When a ledger's stock is fully sold, the exact profit margin for that delivery batch is calculated and emailed to the station owner automatically — no manual computation, no spreadsheet.

## Supporting Infrastructure

- WebSocket-powered real-time notifications across all four user types
- Rating system between buyers, sellers, and transporters after completed transactions
- Full audit logging on all state-changing operations
- Nigerian DPR-compliant export reports for station records
- Cloudinary for waybill photo uploads
- Resend for all transactional emails`,
      stack: {
        create: [
          { name: "NestJS", category: "BACKEND" },
          { name: "Next.js", category: "FRONTEND" },
          { name: "MongoDB", category: "DATABASE" },
          { name: "TypeScript", category: "BACKEND" },
          { name: "Tailwind CSS", category: "FRONTEND" },
          { name: "shadcn/ui", category: "FRONTEND" },
          { name: "Socket.IO", category: "BACKEND" },
          { name: "Google Maps API", category: "INFRA" },
          { name: "Google OAuth", category: "BACKEND" },
          { name: "Cloudinary", category: "INFRA" },
          { name: "Resend", category: "INFRA" },
        ],
      },
      highlights: {
        create: [
          { text: "Four distinct user types — buyers, sellers (depot owners/traders), transporters, and station managers — each with a dedicated dashboard, workflow, and permission set", order: 1 },
          { text: "DeliveryLedger model: one document per tank per delivery enables granular FIFO cost attribution at tank level rather than truck level — costs distributed pro-rata by volume at ledger creation", order: 2 },
          { text: "Real-time counter-offer negotiation via WebSockets — structured price negotiation UI, not just a chat window", order: 3 },
          { text: "Transport fare calculator using Google Maps distance + configurable cost parameters (fuel consumption rate, maintenance, profit margin) — gives buyers a fair price baseline before negotiation", order: 4 },
          { text: "Automatic P&L emails sent to station owners when a delivery batch is fully sold through — fire-and-forget, non-blocking delivery ledger creation", order: 5 },
        ],
      },
    },
  });

  // 3. The Certified Christian
  const certifiedChristian = await prisma.project.create({
    data: {
      slug: "certified-christian",
      name: "The Certified Christian",
      tagline: "Print-on-Demand E-Commerce Platform",
      order: 3,
      featured: false,
      status: "LIVE",
      category: "ECOMMERCE",
      liveUrl: "https://thecertifiedchristian.com",
      description: "A full-stack e-commerce platform for custom branded merchandise — with a complete customer storefront, Stripe payments, order management, a Fabric.js product design tool, and a full admin panel covering products, orders, inventory, customers, and returns.",
      caseStudy: `## Overview

The Certified Christian is a full-stack print-on-demand e-commerce platform for custom branded merchandise. The platform handles the complete commerce lifecycle — browsing, cart, checkout, order management, and post-purchase returns — with a full admin panel and a post-MVP product design tool.

## State Management Architecture

The application uses a deliberate split: Zustand manages ephemeral client-side state (cart UI open/closed, modal states, filter selections). TanStack Query manages all server state (product data, orders, user profile). This separation prevents the common anti-pattern of stuffing server data into Zustand stores, which breaks React Query's caching and invalidation model.

## The Design Tool

Post-MVP, customers can customise products before ordering. The Fabric.js canvas lets users upload their own artwork, add styled text, and reposition elements. The final canvas state serialises to JSON and is stored alongside the order record — enabling print-ready output generation and accurate order reproduction.

## Payments and Returns

Stripe handles all payments with webhook confirmation before order state transitions. Returns are managed through the admin panel: when a return is approved, the Stripe Refunds API is called programmatically — the admin never needs to touch the Stripe dashboard.

## Auth and Email

Full authentication with credentials + Google OAuth. OTP-based email verification for new accounts. Resend powers all transactional emails built as React Email components — order confirmation, shipping updates, return status, promo codes.`,
      stack: {
        create: [
          { name: "Next.js 16", category: "FRONTEND" },
          { name: "React 19", category: "FRONTEND" },
          { name: "TypeScript", category: "BACKEND" },
          { name: "Prisma", category: "BACKEND" },
          { name: "PostgreSQL", category: "DATABASE" },
          { name: "Upstash Redis", category: "DATABASE" },
          { name: "Tailwind CSS v4", category: "FRONTEND" },
          { name: "shadcn/ui", category: "FRONTEND" },
          { name: "Stripe", category: "INFRA" },
          { name: "Cloudinary", category: "INFRA" },
          { name: "Fabric.js", category: "FRONTEND" },
          { name: "Zustand", category: "FRONTEND" },
          { name: "TanStack Query", category: "FRONTEND" },
          { name: "Resend", category: "INFRA" },
        ],
      },
      highlights: {
        create: [
          { text: "Zustand for ephemeral UI state + TanStack Query for server state — clean separation prevents the anti-pattern of storing server data in client stores", order: 1 },
          { text: "Fabric.js-powered product design tool — customers upload artwork, add text, and reposition elements on a canvas before ordering; canvas state serialises to JSON and is stored with the order", order: 2 },
          { text: "Full Stripe Refunds API integration — refunds triggered programmatically when a return request is approved in the admin panel, no manual Stripe dashboard interaction", order: 3 },
          { text: "Complete admin panel: product management, order tracking, inventory alerts, customer records, promo code engine, and returns management", order: 4 },
          { text: "OTP-based email verification via Resend + React Email templates — custom email components for every transactional event", order: 5 },
        ],
      },
    },
  });

  // 4. Place of Treasure
  const placeOfTreasure = await prisma.project.create({
    data: {
      slug: "place-of-treasure",
      name: "Place of Treasure",
      tagline: "Gift Shop E-Commerce with Configurable Gift Box Builder",
      order: 4,
      featured: false,
      status: "LIVE",
      category: "ECOMMERCE",
      liveUrl: "https://pot-new.vercel.app",
      description: "A full-featured e-commerce gift shop with a purpose-built gift box configurator, session-based guest cart that survives without login, Stripe payments with programmatic refunds, and a complete admin panel for a retail business selling physical items, food, and customisable gift products.",
      caseStudy: `## Overview

Place of Treasure is a retail gift shop platform selling physical items, food, and customisable gift boxes. The data model had to be flexible enough to handle both standard products and composed gift box products — a non-trivial e-commerce problem.

## The Gift Box Model

The standout technical decision is the \`GiftBoxItem\` join model. A gift box is not just a bundle — it's a configurable product where customers select which items to include, subject to constraints (minimum items, maximum items, category rules). The composed selection is stored as GiftBoxItem records linking the order to each selected product. This preserves the exact configuration for fulfilment, enables accurate inventory deduction per included item, and supports returns processing at the component level.

## Guest Cart

Carts are session-based from the first product added. A guest shopping session is tied to a session ID stored in Upstash Redis with a TTL. On login or registration, the guest cart merges with the user's persistent cart — no items lost, no friction at the critical conversion moment. This was built with a custom JWT/jose auth setup (no NextAuth) giving full control over session shape and merge logic.

## Auth Architecture

Rather than reaching for NextAuth, Place of Treasure implements custom JWT authentication using \`jose\`. This gave full control over token claims, refresh logic, and the guest-to-authenticated cart merge flow — a complexity that would have been awkward to express through NextAuth's session model.`,
      stack: {
        create: [
          { name: "Next.js 16", category: "FRONTEND" },
          { name: "React 19", category: "FRONTEND" },
          { name: "TypeScript", category: "BACKEND" },
          { name: "Prisma", category: "BACKEND" },
          { name: "PostgreSQL", category: "DATABASE" },
          { name: "Upstash Redis", category: "DATABASE" },
          { name: "Tailwind CSS v4", category: "FRONTEND" },
          { name: "shadcn/ui", category: "FRONTEND" },
          { name: "Stripe", category: "INFRA" },
          { name: "Cloudinary", category: "INFRA" },
          { name: "Zustand", category: "FRONTEND" },
          { name: "TanStack Query", category: "FRONTEND" },
          { name: "Resend", category: "INFRA" },
        ],
      },
      highlights: {
        create: [
          { text: "GiftBoxItem join model — products composed into configurable gift box products with item selection constraints; purpose-built data model for the gift shop use case", order: 1 },
          { text: "Session-based guest carts using Upstash Redis — carts persist across sessions without login and merge cleanly into the user's cart on authentication", order: 2 },
          { text: "Custom JWT/jose authentication alongside Google OAuth — no NextAuth dependency, full control over session shape and token claims", order: 3 },
          { text: "Stripe Refunds API integrated into the returns workflow — refunds triggered programmatically on admin approval", order: 4 },
          { text: "Subcategory product taxonomy with filtering, search, wishlist, and promo codes — complete commerce feature set", order: 5 },
        ],
      },
    },
  });

  // 5. Vendra
  const vendra = await prisma.project.create({
    data: {
      slug: "vendra",
      name: "Vendra",
      tagline: "Multi-Tenant SaaS E-Commerce for Nigerian Vendors",
      order: 5,
      featured: false,
      status: "IN_DEVELOPMENT",
      category: "SAAS",
      description: "A SaaS platform giving Nigerian small businesses — tailors, food vendors, artisans — their own storefront at {slug}.vendra.com, with Paystack-native payments via subaccount splitting, AI-powered marketing tools, BullMQ job queues, and real-time analytics. Built to replace WhatsApp Status as Nigeria's small business sales channel.",
      caseStudy: `## The Problem

Millions of Nigerian small business owners run their entire sales operation through WhatsApp Status. No storefront. No inventory. No payment tracking. No analytics. Just photos posted to a 24-hour disappearing feed with no discoverability, no cart, and no professional presence.

## The Solution

Vendra gives every vendor a proper storefront at their own subdomain (slug.vendra.com) with a full product catalogue, cart, Paystack-native checkout, and a vendor dashboard with analytics — set up in minutes, no technical knowledge required.

## Architecture

The platform is a Turborepo monorepo with pnpm workspaces. The Next.js storefront and NestJS API share TypeScript types and utility packages, ensuring zero drift between what the client expects and what the server returns. A FastAPI microservice handles AI features — accepting vendor photo uploads and returning marketing copy via vision model inference.

## Payments

Paystack subaccount splitting is central to the business model. Each vendor is onboarded as a Paystack subaccount. When a customer checks out, the full amount is charged, the platform fee is deducted at source by Paystack's split payment system, and the remainder goes directly to the vendor's account. No manual settlements, no escrow delays.

## Current Status

Core storefront, vendor dashboard, and payment flows are complete. AI marketing tools and advanced analytics are in active development.`,
      stack: {
        create: [
          { name: "Next.js 16", category: "FRONTEND" },
          { name: "NestJS 10", category: "BACKEND" },
          { name: "FastAPI", category: "BACKEND" },
          { name: "Prisma 7", category: "BACKEND" },
          { name: "PostgreSQL", category: "DATABASE" },
          { name: "Redis", category: "DATABASE" },
          { name: "BullMQ", category: "BACKEND" },
          { name: "Socket.IO", category: "BACKEND" },
          { name: "Docker", category: "DEVOPS" },
          { name: "Turborepo", category: "DEVOPS" },
          { name: "pnpm workspaces", category: "DEVOPS" },
          { name: "Paystack", category: "INFRA" },
          { name: "Cloudinary", category: "INFRA" },
        ],
      },
      highlights: {
        create: [
          { text: "Subdomain-per-vendor routing — {slug}.vendra.com gives each vendor a fully isolated storefront with their own domain, branding, and product catalogue", order: 1 },
          { text: "Paystack subaccount splitting — payments go directly to vendor subaccounts at transaction time; platform fee deducted at source with no manual settlement process", order: 2 },
          { text: "Turborepo monorepo with pnpm workspaces — shared TypeScript types and utilities between Next.js frontend and NestJS API, zero drift between client and server contracts", order: 3 },
          { text: "FastAPI microservice handles AI features — generating product descriptions and marketing copy from vendor photo uploads using vision models", order: 4 },
          { text: "BullMQ job queues for all async operations: order notifications, analytics rollups, AI generation jobs, and scheduled marketing nudges to vendors", order: 5 },
        ],
      },
    },
  });

  // 6. XPortal
  const xportal = await prisma.project.create({
    data: {
      slug: "xportal",
      name: "XPortal",
      tagline: "School Management System for Nigerian Schools",
      order: 6,
      featured: false,
      status: "LIVE",
      category: "MANAGEMENT",
      liveUrl: "https://www.xportal.ng",
      description: "A multi-tenant school management platform built for Nigerian schools — covering student records, attendance tracking, results management, and parent communication, with role-based access for school admins, teachers, parents, and students.",
      caseStudy: `## Overview

XPortal is a school management system built specifically for Nigerian schools — not a foreign SaaS adapted for local use, but a product designed around how Nigerian schools actually operate: term-based calendars, specific result sheet formats, parent communication patterns, and multi-branch school structures.

## Multi-Tenancy

A single deployment serves multiple schools. Each school has a fully isolated data environment — students, staff, results, and records are scoped by school ID at the database level. School admins configure their own term dates, subject lists, and class structures.

## Role-Based Access

Four distinct roles with different permissions and interfaces: school administrators manage the full platform, teachers handle attendance and results for their classes, parents view their children's records and receive notifications, and students access their own results and schedules. Each role sees only what they need.`,
      stack: {
        create: [
          { name: "NestJS", category: "BACKEND" },
          { name: "Next.js", category: "FRONTEND" },
          { name: "PostgreSQL", category: "DATABASE" },
          { name: "Prisma", category: "BACKEND" },
          { name: "TypeScript", category: "BACKEND" },
          { name: "Tailwind CSS", category: "FRONTEND" },
        ],
      },
      highlights: {
        create: [
          { text: "Multi-tenant architecture — a single deployment serves multiple schools with fully isolated data per school", order: 1 },
          { text: "Role-based access control across four roles: school admin, teachers, parents, and students — each with scoped permissions and tailored UI", order: 2 },
          { text: "Built for Nigerian school operations — term structures, result formats, and reporting patterns reflect local educational context", order: 3 },
          { text: "Attendance tracking, results computation, and parent notification in a single unified platform", order: 4 },
        ],
      },
    },
  });

  console.log("Seeding skills...");

  const skillCategories = [
    {
      title: "Cloud & Infrastructure",
      icon: "Cloud",
      description: "Production infrastructure management across major cloud platforms",
      order: 1,
      skills: [
        { name: "AWS EC2", level: "EXPERT", order: 1 },
        { name: "AWS S3", level: "EXPERT", order: 2 },
        { name: "AWS RDS", level: "EXPERT", order: 3 },
        { name: "AWS CloudFront", level: "EXPERT", order: 4 },
        { name: "AWS CloudWatch", level: "EXPERT", order: 5 },
        { name: "AWS IAM", level: "EXPERT", order: 6 },
        { name: "AWS WAF", level: "PROFICIENT", order: 7 },
        { name: "AWS Lambda", level: "PROFICIENT", order: 8 },
        { name: "Cloudflare", level: "EXPERT", order: 9 },
        { name: "Azure", level: "PROFICIENT", order: 10 },
        { name: "GCP", level: "FAMILIAR", order: 11 },
        { name: "Vercel", level: "EXPERT", order: 12 },
        { name: "Neon DB", level: "PROFICIENT", order: 13 },
      ],
    },
    {
      title: "CI/CD & DevOps",
      icon: "GitBranch",
      description: "Pipeline engineering, containerisation, and deployment automation",
      order: 2,
      skills: [
        { name: "GitHub Actions", level: "EXPERT", order: 1 },
        { name: "Docker", level: "EXPERT", order: 2 },
        { name: "Docker Compose", level: "EXPERT", order: 3 },
        { name: "Jenkins", level: "PROFICIENT", order: 4 },
        { name: "Azure DevOps", level: "PROFICIENT", order: 5 },
        { name: "Watchtower", level: "PROFICIENT", order: 6 },
        { name: "GHCR", level: "PROFICIENT", order: 7 },
        { name: "Nginx", level: "EXPERT", order: 8 },
        { name: "Linux / Ubuntu", level: "EXPERT", order: 9 },
        { name: "Terraform", level: "PROFICIENT", order: 10 },
        { name: "Bash Scripting", level: "PROFICIENT", order: 11 },
        { name: "Turborepo", level: "PROFICIENT", order: 12 },
      ],
    },
    {
      title: "Monitoring & Observability",
      icon: "Activity",
      description: "Production observability across logs, metrics, and alerts",
      order: 3,
      skills: [
        { name: "AWS CloudWatch", level: "EXPERT", order: 1 },
        { name: "Grafana", level: "PROFICIENT", order: 2 },
        { name: "Prometheus", level: "PROFICIENT", order: 3 },
        { name: "Datadog", level: "FAMILIAR", order: 4 },
        { name: "Nginx Logs", level: "EXPERT", order: 5 },
        { name: "Logrotate", level: "PROFICIENT", order: 6 },
      ],
    },
    {
      title: "Backend",
      icon: "Server",
      description: "API design, real-time systems, and server-side architecture",
      order: 4,
      skills: [
        { name: "NestJS", level: "EXPERT", order: 1 },
        { name: "Node.js", level: "EXPERT", order: 2 },
        { name: "Express", level: "EXPERT", order: 3 },
        { name: "FastAPI", level: "PROFICIENT", order: 4 },
        { name: "TypeScript", level: "EXPERT", order: 5 },
        { name: "Python", level: "PROFICIENT", order: 6 },
        { name: "Socket.IO", level: "EXPERT", order: 7 },
        { name: "BullMQ", level: "PROFICIENT", order: 8 },
        { name: "Prisma", level: "EXPERT", order: 9 },
        { name: "REST API Design", level: "EXPERT", order: 10 },
        { name: "JWT / OAuth", level: "EXPERT", order: 11 },
        { name: "NextAuth.js", level: "PROFICIENT", order: 12 },
      ],
    },
    {
      title: "Frontend",
      icon: "Monitor",
      description: "Full-stack React applications with modern tooling",
      order: 5,
      skills: [
        { name: "Next.js", level: "EXPERT", order: 1 },
        { name: "React", level: "EXPERT", order: 2 },
        { name: "Tailwind CSS", level: "EXPERT", order: 3 },
        { name: "shadcn/ui", level: "EXPERT", order: 4 },
        { name: "TypeScript", level: "EXPERT", order: 5 },
        { name: "Framer Motion", level: "PROFICIENT", order: 6 },
        { name: "Zustand", level: "EXPERT", order: 7 },
        { name: "TanStack Query", level: "EXPERT", order: 8 },
        { name: "Fabric.js", level: "PROFICIENT", order: 9 },
      ],
    },
    {
      title: "Databases & Storage",
      icon: "Database",
      description: "Relational and document databases, caching, and object storage",
      order: 6,
      skills: [
        { name: "PostgreSQL", level: "EXPERT", order: 1 },
        { name: "MongoDB", level: "PROFICIENT", order: 2 },
        { name: "MySQL", level: "PROFICIENT", order: 3 },
        { name: "Redis", level: "EXPERT", order: 4 },
        { name: "Upstash Redis", level: "PROFICIENT", order: 5 },
        { name: "Cloudinary", level: "EXPERT", order: 6 },
        { name: "AWS S3", level: "EXPERT", order: 7 },
      ],
    },
  ];

  for (const category of skillCategories) {
    await prisma.skillCategory.create({
      data: {
        title: category.title,
        icon: category.icon,
        description: category.description,
        order: category.order,
        skills: {
          create: category.skills.map((skill) => ({
            name: skill.name,
            level: skill.level as any,
            order: skill.order,
          })),
        },
      },
    });
  }

  console.log("Seeding experience...");

  const experiences = [
    {
      role: "Full Stack Web Developer",
      company: "The Punch Nigeria Ltd",
      location: "Lagos, Nigeria",
      period: "Nov 2024 – Present",
      current: true,
      order: 1,
      tags: ["AWS", "Nginx", "Redis", "CloudWatch", "PHP", "WordPress", "Cloudflare", "Linux"],
      bullets: [
        "Engineering and maintaining web infrastructure for Nigeria's #1 news publisher, serving millions of monthly readers on a WordPress/Nginx/Redis stack on AWS EC2 with RDS, S3, and CloudFront",
        "Installed and configured the AWS CloudWatch Agent with a custom IAM role (PunchNG-EC2-CloudWatch), routing EC2 and application metrics to a custom PunchNG/EC2 namespace for real-time alerting via SNS",
        "Resolved critical PHP 8.1 undefined variable errors across multiple theme files; reclaimed significant disk space from bloated Nginx logs and corrected a longstanding logrotate misconfiguration",
        "Tuned Nginx FastCGI buffer settings and PHP-FPM worker configuration to reduce origin response times and improve cache hit rate toward target",
        "Hardened server security: removed legacy TLS 1.0/1.1, configured Cloudflare WAF rules to restrict /wp-json/ traffic, and evaluated Bot Fight Mode settings for origin protection",
        "Configured persistent swap and optimised memory allocation across the production EC2 fleet",
      ],
    },
    {
      role: "Front-end / DevOps Engineer",
      company: "MHAPY",
      location: "Ontario, Canada (Remote)",
      period: "Jun 2023 – Aug 2024",
      current: false,
      order: 2,
      tags: ["AWS", "Jenkins", "GitHub Actions", "React", "EC2", "S3", "CloudFront"],
      bullets: [
        "Managed multi-domain AWS infrastructure for mhapy.com, portal.mhapy.com, and mhapy.ca — a mental health SaaS platform serving live users across Canada",
        "Deployed and maintained web applications on AWS including EC2, S3, and CloudFront — configuration, cache invalidation, and environment-specific deployments",
        "Designed and maintained CI/CD pipelines using Jenkins and GitHub Actions, reducing manual deployment steps and accelerating release cadence",
        "Built and maintained the therapists' dashboard (portal.mhapy.com) — a React-based platform integrated with a Ruby backend mental health chatbot",
      ],
    },
    {
      role: "DevOps Engineer",
      company: "NEWTONCORE",
      location: "Nigeria",
      period: "Aug 2023 – Oct 2023",
      current: false,
      order: 3,
      tags: ["AWS", "CI/CD", "Docker", "React"],
      bullets: [
        "Managed cloud infrastructure ensuring platform uptime and deployment consistency across environments",
        "Designed and implemented CI/CD pipelines automating build, test, and deployment workflows on AWS",
        "Deployed and maintained web applications on Amazon Web Services",
      ],
    },
    {
      role: "Front-end Developer",
      company: "Style Terrain",
      location: "Nigeria",
      period: "Mar 2024 – Jul 2024",
      current: false,
      order: 4,
      tags: ["React", "Next.js", "Paystack", "TypeScript"],
      bullets: [
        "Built responsive web interfaces and integrated Paystack payment gateway into the e-commerce platform",
        "Delivered pixel-accurate implementations from Figma designs using React and Tailwind CSS",
      ],
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({
      data: {
        role: exp.role,
        company: exp.company,
        location: exp.location,
        period: exp.period,
        current: exp.current,
        order: exp.order,
        tags: {
          create: exp.tags.map((tag) => ({ name: tag })),
        },
        bullets: {
          create: exp.bullets.map((bullet, index) => ({ text: bullet, order: index + 1 })),
        },
      },
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
