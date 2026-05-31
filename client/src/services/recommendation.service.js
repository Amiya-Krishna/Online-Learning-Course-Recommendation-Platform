import { api } from "./api";

export const recommendationService = {
  async getRecommendations(userId) {
    const { data } = await api.get(`/recommendations/${userId}`);
    return data;
  },
};
