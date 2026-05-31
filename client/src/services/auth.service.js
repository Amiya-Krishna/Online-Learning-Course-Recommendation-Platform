import { api } from "./api";

export const authService = {
  async login(payload) {
    const { data } = await api.post("/auth/login", payload);
    return data;
  },

  async register(payload) {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },

  async getCurrentUser(token) {
    const { data } = await api.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },
};
