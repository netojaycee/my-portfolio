import { create } from "zustand";

export type PanelPose = { position: [number, number, number]; rotationY: number };

type VRState = {
  selectedId: string | null;
  panelPose: PanelPose;
  select: (id: string | null, pose?: PanelPose) => void;
  origin: [number, number, number];
  setOrigin: (p: [number, number, number]) => void;
  /** Ask the flat-screen camera to fly to a pose (nonce forces repeat requests). */
  focus: { pos: [number, number, number]; azimuth: number; nonce: number } | null;
  focusOn: (pos: [number, number, number], azimuth: number) => void;
  /** Current stop of the guided tour used on small screens (-1 = not started). */
  inVR: boolean;
  setInVR: (v: boolean) => void;
  tourIndex: number;
  setTourIndex: (i: number) => void;
};

// Zustand keeps scene state out of the React render path of the 60fps loop.
export const useVRStore = create<VRState>((set) => ({
  selectedId: null,
  panelPose: { position: [0, 2.15, -3.2], rotationY: 0 },
  select: (id, pose) => set((s) => ({ selectedId: id, panelPose: pose ?? s.panelPose })),
  origin: [0, 0, 0],
  setOrigin: (origin) => set({ origin }),
  focus: null,
  focusOn: (pos, azimuth) => set((s) => ({ focus: { pos, azimuth, nonce: (s.focus?.nonce ?? 0) + 1 } })),
  inVR: false,
  setInVR: (inVR) => set({ inVR }),
  tourIndex: -1,
  setTourIndex: (tourIndex) => set({ tourIndex }),
}));
