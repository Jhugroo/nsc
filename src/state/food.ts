import { create } from 'zustand'

export type menuItemType = {
    menuItemId?: number,
    id: string,
    count: number,
    paid: number
};
export type foodCountType = Record<string, menuItemType>
export const iniFoodCount: foodCountType = [] as unknown as foodCountType

interface foodCountState {
    foodCount: foodCountType,
    setFoodCount: (foodCount: foodCountType) => void
}
export const useFoodCountStore = create<foodCountState>()((set) => ({
    foodCount: [] as unknown as foodCountType,
    setFoodCount: (foodCount) => set({ foodCount: foodCount }),
}))