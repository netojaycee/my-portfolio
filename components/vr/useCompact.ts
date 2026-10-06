"use client";

import { useEffect, useState } from "react";

export const COMPACT_QUERY = "(max-width: 1023px), (max-height: 520px)";

/** True on phones/small tablets and short (landscape-phone) viewports. */
export function useCompact() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY);
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return compact;
}
