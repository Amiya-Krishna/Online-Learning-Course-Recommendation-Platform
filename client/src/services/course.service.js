import { api } from "./api";

export const courseService = {
  async getCourses() {
    const { data } = await api.get("/courses");
    return data;
  },

  async enrollCourse(courseId) {
    const { data } = await api.post(`/courses/${courseId}/enroll`);
    return data;
  },

  async createCourse(payload) {
    const { data } = await api.post("/courses", payload);
    return data;
  },
};
