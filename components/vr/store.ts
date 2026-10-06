import { create } from "zustand";

export type PanelPose = { position: [number, number, number]; rotationY: number };

type VRState = {
  selectedId: string | null;
  panelPose: PanelPose;
  select: (id: string | null, pose?: PanelPose) => void;
  origin: [number, number, number];
  setOrigin: (p: [number, number, number]) => void;
  /** Request the desktop camera to turn to a wall (nonce forces repeat requests). */
  goto: { angle: number; nonce: number } | null;
  gotoWall: (angle: number) => void;
};

// Zustand keeps scene state out of the React render path of the 60fps loop.
export const useVRStore = create<VRState>((set) => ({
  selectedId: null,
  panelPose: { position: [0, 2.15, -3.2], rotationY: 0 },
  select: (id, pose) => set((s) => ({ selectedId: id, panelPose: pose ?? s.panelPose })),
  origin: [0, 0, 0],
  setOrigin: (origin) => set({ origin }),
  goto: null,
  gotoWall: (angle) => set((s) => ({ goto: { angle, nonce: (s.goto?.nonce ?? 0) + 1 } })),
}));
