import { enrollments, students } from "../data/db.js";
// import db from "../data/db.js";

export const Course = {
  students: (parent) => {
    return students.filter((s) =>
      (enrollments[s.id] ?? []).includes(parent.id)
    );
  },

  studentsCount: (parent) => {
    return students.filter((s) => (enrollments[s.id] ?? []).includes(parent.id))
      .length;
  },
};
