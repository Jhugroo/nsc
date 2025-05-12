import { create } from "zustand";

export type departmentType = {
  id: string;
  code: string;
  label: string;
};

interface departmentState {
  departments: departmentType[];
  setDepartments: (departments: departmentType[]) => void;
}
export const useDepartmentsStore = create<departmentState>()((set) => ({
  departments: [] as departmentType[],
  setDepartments: (departments) => set({ departments: departments }),
}));
