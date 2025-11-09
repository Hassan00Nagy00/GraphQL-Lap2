import { enrollments, courses } from "../data/db.js";

export const Student = {
  courses: (parent) => {
    const ids = enrollments[parent.id] ?? [];
    return courses.filter((c) => ids.includes(c.id));
  },

  coursesCount: (parent) => {
    return (enrollments[parent.id] ?? []).length;
  },
};
