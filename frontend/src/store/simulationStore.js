import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSimulationStore = create(
  persist(
    (set, get) => ({
      // Simulation parameters
      origin: null,
      destination: null,
      algorithm: 'dijkstra',
      userProfile: 'balanced',
      batteryCapacity: 75,
      currentBattery: 100,
      
      // Simulation results
      routes: [],
      selectedRoute: null,
      isLoading: false,
      error: null,
      aiProvider: null,
      
      // UI state
      isDarkMode: true,
      sidebarOpen: true,
      
      // Actions
      setOrigin: (origin) => set({ origin }),
      setDestination: (destination) => set({ destination }),
      setAlgorithm: (algorithm) => set({ algorithm }),
      setUserProfile: (profile) => set({ userProfile: profile }),
      setBatteryCapacity: (capacity) => set({ batteryCapacity: capacity }),
      setCurrentBattery: (battery) => set({ currentBattery: battery }),
      
      setRoutes: (routes) => set({ routes }),
      setSelectedRoute: (route) => set({ selectedRoute: route }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setAIProvider: (provider) => set({ aiProvider: provider }),
      
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      // Reset simulation
      resetSimulation: () => set({
        routes: [],
        selectedRoute: null,
        isLoading: false,
        error: null,
        aiProvider: null
      }),
      
      // Clear all data
      clearAll: () => set({
        origin: null,
        destination: null,
        routes: [],
        selectedRoute: null,
        isLoading: false,
        error: null,
        aiProvider: null
      })
    }),
    {
      name: 'ev-simulation-storage',
      partialize: (state) => ({
        origin: state.origin,
        destination: state.destination,
        algorithm: state.algorithm,
        userProfile: state.userProfile,
        batteryCapacity: state.batteryCapacity,
        currentBattery: state.currentBattery,
        isDarkMode: state.isDarkMode,
        sidebarOpen: state.sidebarOpen
      })
    }
  )
) 