import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * 🚗 STORE DE VEÍCULO SELECIONADO
 *
 * Armazena o veículo escolhido pelo usuário no seletor cascata.
 * Persiste no localStorage para manter após recarregar página.
 */

export interface SelectedVehicle {
  year: number | null;
  brand: string | null;
  model: string | null;
  version: string | null;
  vehicleId: string | null; // ID do veículo no banco
}

interface VehicleState {
  selectedVehicle: SelectedVehicle;
  setYear: (year: number | null) => void;
  setBrand: (brand: string | null) => void;
  setModel: (model: string | null) => void;
  setVersion: (version: string | null, vehicleId: string | null) => void;
  clearVehicle: () => void;
  hasVehicleSelected: () => boolean;
  getVehicleLabel: () => string;
}

const initialVehicle: SelectedVehicle = {
  year: null,
  brand: null,
  model: null,
  version: null,
  vehicleId: null,
};

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set, get) => ({
      selectedVehicle: initialVehicle,

      setYear: (year) =>
        set({
          selectedVehicle: {
            year,
            brand: null,
            model: null,
            version: null,
            vehicleId: null,
          },
        }),

      setBrand: (brand) =>
        set((state) => ({
          selectedVehicle: {
            ...state.selectedVehicle,
            brand,
            model: null,
            version: null,
            vehicleId: null,
          },
        })),

      setModel: (model) =>
        set((state) => ({
          selectedVehicle: {
            ...state.selectedVehicle,
            model,
            version: null,
            vehicleId: null,
          },
        })),

      setVersion: (version, vehicleId) =>
        set((state) => ({
          selectedVehicle: {
            ...state.selectedVehicle,
            version,
            vehicleId,
          },
        })),

      clearVehicle: () => set({ selectedVehicle: initialVehicle }),

      hasVehicleSelected: () => {
        const { selectedVehicle } = get();
        return !!(
          selectedVehicle.year &&
          selectedVehicle.brand &&
          selectedVehicle.model
        );
      },

      getVehicleLabel: () => {
        const { selectedVehicle } = get();
        if (!get().hasVehicleSelected()) return "Nenhum veículo selecionado";

        const parts = [
          selectedVehicle.brand,
          selectedVehicle.model,
          selectedVehicle.year,
          selectedVehicle.version,
        ].filter(Boolean);

        return parts.join(" ");
      },
    }),
    {
      name: "vehicle-storage", // Nome no localStorage
    },
  ),
);
