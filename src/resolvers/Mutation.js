import { users, students, courses, enrollments } from "../data/db.js";
import { signToken } from "../utils/token.js";
import { requireAuth } from "../utils/auth.js";

const nextIdFor = (collection) => {
  if (!collection || collection.length === 0) return 1;
  const nums = collection
    .map((it) => Number(it.id))
    .filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return max + 1;
};

export const Mutation = {
  signup: (_, { email, password }) => {
    const exists = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) throw new Error("Email already exists");

    if (!email.includes("@")) throw new Error("Invalid email");
    if (password.length < 6) throw new Error("Weak password");

    const newUser = {
      id: nextIdFor(users),
      email,
      password,
    };
    users.push(newUser);

    const token = signToken(newUser);
    return { token, user: newUser };
  },

  login: (_, { email, password }) => {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!user || user.password !== password)
      throw new Error("Invalid credentials");

    const token = signToken(user);
    return { token, user };
  },

  addStudent: (_, { name, email, age, major }, { user }) => {
    requireAuth(user);

    if (students.some((s) => s.email.toLowerCase() === email.toLowerCase()))
      throw new Error("Email must be unique");

    if (!email.includes("@")) throw new Error("Invalid email");
    if (age < 16) throw new Error("Age must be >= 16");

    const newStu = {
      id: nextIdFor(students),
      name,
      email,
      age,
      major,
    };

    students.push(newStu);
    return newStu;
  },

  updateStudent: (_, { id, input }, { user }) => {
    requireAuth(user);

    const stu = students.find((s) => s.id == id);
    if (!stu) throw new Error("Student not found");

    if (input.email) {
      if (!input.email.includes("@")) throw new Error("Invalid email");
      if (
        students.some(
          (s) =>
            s.email.toLowerCase() === input.email.toLowerCase() && s.id != id
        )
      )
        throw new Error("Email must be unique");
    }

    Object.assign(stu, input);
    return stu;
  },

  deleteStudent: (_, { id }, { user }) => {
    requireAuth(user);

    const idx = students.findIndex((s) => s.id == id);
    if (idx === -1) return false;

    students.splice(idx, 1);
    delete enrollments[id];
    return true;
  },

  addCourse: (_, { title, code, credits, instructor }, { user }) => {
    requireAuth(user);

    if (courses.some((c) => c.code.toLowerCase() === code.toLowerCase()))
      throw new Error("Code must be unique");

    if (credits < 1 || credits > 6) throw new Error("Credits must be 1..6");

    const newC = {
      id: nextIdFor(courses),
      title,
      code,
      credits,
      instructor,
    };

    courses.push(newC);
    return newC;
  },

  updateCourse: (_, { id, input }, { user }) => {
    requireAuth(user);

    const course = courses.find((c) => c.id == id);
    if (!course) throw new Error("Course not found");

    if (input.code) {
      if (
        courses.some(
          (c) => c.code.toLowerCase() === input.code.toLowerCase() && c.id != id
        )
      )
        throw new Error("Code must be unique");
    }

    if (typeof input.credits !== "undefined") {
      if (input.credits < 1 || input.credits > 6)
        throw new Error("Credits must be 1..6");
    }

    Object.assign(course, input);
    return course;
  },

  deleteCourse: (_, { id }, { user }) => {
    requireAuth(user);

    const idx = courses.findIndex((c) => c.id == id);
    if (idx === -1) return false;

    courses.splice(idx, 1);

    for (const stId in enrollments) {
      enrollments[stId] = enrollments[stId].filter((cid) => cid != id);
    }

    return true;
  },

  enrollStudent: (_, { studentId, courseId }, { user }) => {
    requireAuth(user);

    const stu = students.find((s) => s.id == studentId);
    const crs = courses.find((c) => c.id == courseId);

    if (!stu) throw new Error("Student not found");
    if (!crs) throw new Error("Course not found");

    if (!enrollments[studentId]) enrollments[studentId] = [];

    if (!enrollments[studentId].includes(courseId))
      enrollments[studentId].push(courseId);

    return stu;
  },

  unenrollStudent: (_, { studentId, courseId }, { user }) => {
    requireAuth(user);

    const stu = students.find((s) => s.id == studentId);
    if (!stu) throw new Error("Student not found");

    enrollments[studentId] = (enrollments[studentId] ?? []).filter(
      (cid) => cid != courseId
    );
    return stu;
  },
};
