// Static copy for the 3D landing page. Mirrors the "STATIC COPY" section of
// docs/ARCHITECTURE.md — headline metrics are keyed by the order of the Punch
// bullets in the database; the long-form detail text always comes from the DB.

export const CONTACT = {
  email: "netojaycee@gmail.com",
  linkedin: "https://linkedin.com/in/jc-edeh",
  github: "https://github.com/netojaycee",
  cv: "/john-edeh-cv.pdf",
  punch: "https://punchng.com",
} as const;

export const HERO = {
  badge: "Running infra for 23M+ pageviews/mo at Punch Nigeria",
  name: "John Edeh",
  role: "Full-Stack & DevOps Engineer — Lagos, Nigeria",
  pitch:
    "I fix production, then build the next thing. Root-caused a full-site 504 outage and fixed it live in 15 minutes. Cut editor publish latency from 40s+ to normal. Closed a production XSS. Ship SaaS products end to end on the side.",
  stats: [
    { value: "23M+", label: "pageviews / month run" },
    { value: "15 min", label: "to fix a full-site 504" },
    { value: "7", label: "SaaS products shipped" },
  ],
} as const;

type IncidentMeta = {
  metric: string;
  metricLabel: string;
  title: string;
  summary: string;
  /** indexes into the Punch bullets that make up this incident's detail text */
  bullets: number[];
};

export const INCIDENT_META: IncidentMeta[] = [
  { metric: "150 → 23", metricLabel: "load average", title: "Full-site 504 outage", summary: "Fixed live over SSH in ~15 min", bullets: [0] },
  { metric: "12.5×", metricLabel: "worker oversubscription", title: "PHP-FPM tuning", summary: "CPU pinned 84–99.6% for 24h+", bullets: [1] },
  { metric: "40s+ → normal", metricLabel: "editor publish latency", title: "Three hidden blockers", summary: "Traced through New Relic", bullets: [2] },
  { metric: "99.98%", metricLabel: "of tag pages erroring", title: "Four-bug outage chain", summary: "Each fix unmasked the next", bullets: [3] },
  { metric: "15,000+ → 0", metricLabel: "504s from one scraper", title: "Sitemap stampede", summary: "1,100+ rotating IPs, nginx caps", bullets: [4] },
  { metric: "XSS closed", metricLabel: "+ TLS, WAF, alerting", title: "Security hardening", summary: "Found, fixed and monitored in prod", bullets: [5, 6] },
];

/** Camera azimuth (radians) that faces each wall from the room centre. */
export const WALLS = [
  { key: "proof", label: "Punch proof", angle: 0 },
  { key: "projects", label: "Projects", angle: -Math.PI / 2 },
  { key: "skills", label: "Skills", angle: Math.PI / 2 },
  { key: "career", label: "Career + contact", angle: Math.PI },
] as const;
