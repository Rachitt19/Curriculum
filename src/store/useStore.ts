import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Navigation
  currentView: 'home' | 'galaxy' | 'world' | 'graph';
  activeWorldId: number | null;
  scrollProgress: number;

  // UI
  isLoaded: boolean;
  showSearch: boolean;
  showNavbar: boolean;
  qualitySetting: 'high' | 'medium' | 'low';

  // Progress (persisted)
  completedWorlds: number[];
  bookmarkedDomains: string[];
  currentEvolutionLevel: number;

  // Setters
  setCurrentView: (view: AppState['currentView']) => void;
  setActiveWorldId: (id: number | null) => void;
  setScrollProgress: (progress: number) => void;
  setIsLoaded: (loaded: boolean) => void;
  setShowSearch: (show: boolean) => void;
  setShowNavbar: (show: boolean) => void;
  setQualitySetting: (setting: AppState['qualitySetting']) => void;
  toggleWorldComplete: (worldId: number) => void;
  toggleBookmark: (domainId: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Navigation
      currentView: 'home',
      activeWorldId: null,
      scrollProgress: 0,

      // UI
      isLoaded: false,
      showSearch: false,
      showNavbar: false,
      qualitySetting: 'high',

      // Progress
      completedWorlds: [],
      bookmarkedDomains: [],
      currentEvolutionLevel: 0,

      // Setters
      setCurrentView: (view) => set({ currentView: view }),
      setActiveWorldId: (id) => set({ activeWorldId: id }),
      setScrollProgress: (progress) => set({ scrollProgress: progress }),
      setIsLoaded: (loaded) => set({ isLoaded: loaded }),
      setShowSearch: (show) => set({ showSearch: show }),
      setShowNavbar: (show) => set({ showNavbar: show }),
      setQualitySetting: (setting) => set({ qualitySetting: setting }),
      toggleWorldComplete: (worldId) =>
        set((state) => ({
          completedWorlds: state.completedWorlds.includes(worldId)
            ? state.completedWorlds.filter((id) => id !== worldId)
            : [...state.completedWorlds, worldId],
        })),
      toggleBookmark: (domainId) =>
        set((state) => ({
          bookmarkedDomains: state.bookmarkedDomains.includes(domainId)
            ? state.bookmarkedDomains.filter((id) => id !== domainId)
            : [...state.bookmarkedDomains, domainId],
        })),
    }),
    {
      name: 'airis-progress',
      partialize: (state) => ({
        completedWorlds: state.completedWorlds,
        bookmarkedDomains: state.bookmarkedDomains,
        currentEvolutionLevel: state.currentEvolutionLevel,
        qualitySetting: state.qualitySetting,
      }),
    }
  )
);
