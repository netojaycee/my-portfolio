import type { DetailItem, VRData } from "./types";

/** Full-length detail content for every card; renderers clip it as their medium needs. */
export function buildItems(data: VRData): Map<string, DetailItem> {
  const m = new Map<string, DetailItem>();
  for (const inc of data.incidents) {
    m.set(inc.id, {
      id: inc.id,
      title: inc.title,
      subtitle: `${inc.metric} — ${inc.metricLabel}`,
      body: inc.detail,
      bullets: [],
      footer: "The Punch Nigeria Ltd · production infrastructure",
      url: null,
    });
  }
  for (const p of data.projects) {
    m.set(`p-${p.id}`, {
      id: `p-${p.id}`,
      title: p.name,
      subtitle: p.tagline,
      body: p.description,
      bullets: p.highlights,
      footer: p.stack.join(" · "),
      url: p.liveUrl,
    });
  }
  for (const c of data.skills) {
    const by = (lvl: string) => c.skills.filter((k) => k.level === lvl).map((k) => k.name).join(" · ");
    const body = [
      ["Expert", by("EXPERT")],
      ["Proficient", by("PROFICIENT")],
      ["Familiar", by("FAMILIAR")],
    ]
      .filter(([, names]) => names)
      .map(([label, names]) => `${label} — ${names}`)
      .join("\n\n");
    m.set(`s-${c.id}`, {
      id: `s-${c.id}`,
      title: c.title,
      subtitle: `${c.skills.length} skills`,
      body,
      bullets: [],
      footer: "",
      url: null,
    });
  }
  for (const e of data.experience) {
    m.set(`e-${e.id}`, {
      id: `e-${e.id}`,
      title: e.role,
      subtitle: `${e.company} · ${e.period}`,
      body: e.bullets[0] ?? "",
      bullets: e.bullets.slice(1),
      footer: e.current ? "Current role" : "",
      url: null,
    });
  }
  return m;
}
