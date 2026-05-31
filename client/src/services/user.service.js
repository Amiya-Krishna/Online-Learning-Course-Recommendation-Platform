import { api } from "./api";

export const userService = {
  async getDashboard() {
    const { data } = await api.get("/user/dashboard");
    return data;
  },
};
