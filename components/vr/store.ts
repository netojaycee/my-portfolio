import { create } from "zustand";

type VRState = {
  selectedId: string | null;
  select: (id: string | null) => void;
  origin: [number, number, number];
  setOrigin: (p: [number, number, number]) => void;
};

// Zustand keeps scene state out of the React render path of the 60fps loop.
export const useVRStore = create<VRState>((set) => ({
  selectedId: null,
  select: (id) => set({ selectedId: id }),
  origin: [0, 0, 0],
  setOrigin: (origin) => set({ origin }),
}));
