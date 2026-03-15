import { create } from "zustand";

export const useStore = create((set, get) => ({
  // state
  data: {},

  // actions
  setData: (key, value) => {
    set(state => ({
      data: {
        ...state.data,
        [key]: value
      }
    }));
  },

  getData: (key) => {
    const state = get();
    return state.data[key];
  },

  clearData: () => set({ data: {} })
}));


export const useRefresh_class = create((set, get) => ({
  // state
  data: {},

  // actions
  setRefresh: (key, value) => {
    set(state => ({
      data: {
        ...state.data,
        [key]: value
      }
    }));
  },

  getRefresh: (key) => {
    const state = get();
    return state.data[key];
  },

  clearRefresh: () => set({ data: {} })
}));