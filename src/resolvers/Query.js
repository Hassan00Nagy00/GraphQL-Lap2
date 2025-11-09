import { students, courses } from "../data/db.js";

const safeCopy = (arr) => [...arr];

const applySort = (list, sortBy, sortOrder) => {
  if (!sortBy) return list;
  const order = sortOrder === "DESC" ? -1 : 1;

  list.sort((a, b) => {
    const va = a[sortBy];
    const vb = b[sortBy];

    if (typeof va === "string" && typeof vb === "string") {
      return va.localeCompare(vb) * order;
    }

    if (va < vb) return -1 * order;
    if (va > vb) return 1 * order;
    return 0;
  });

  return list;
};

export const Query = {
  getAllStudents: (_, { filter, options }) => {
    let list = safeCopy(students);

    if (filter?.major) {
      list = list.filter((s) => s.major === filter.major);
    }

    if (filter?.nameContains) {
      const q = filter.nameContains.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }

    if (filter?.emailContains) {
      const q = filter.emailContains.toLowerCase();
      list = list.filter((s) => s.email.toLowerCase().includes(q));
    }

    if (typeof filter?.minAge !== "undefined") {
      list = list.filter((s) => s.age >= filter.minAge);
    }

    if (typeof filter?.maxAge !== "undefined") {
      list = list.filter((s) => s.age <= filter.maxAge);
    }

    if (options?.sortBy) {
      list = applySort(list, options.sortBy, options.sortOrder);
    }

    const offset = options?.offset ?? 0;
    let limit = options?.limit ?? 10;
    if (limit > 50) limit = 50;

    return list.slice(offset, offset + limit);
  },

  getAllCourses: (_, { filter, options }) => {
    let list = safeCopy(courses);

    if (filter?.codePrefix) {
      const prefix = filter.codePrefix.toLowerCase();
      list = list.filter((c) => c.code.toLowerCase().startsWith(prefix));
    }

    if (filter?.titleContains) {
      const q = filter.titleContains.toLowerCase();
      list = list.filter((c) => c.title.toLowerCase().includes(q));
    }

    if (filter?.instructor) {
      list = list.filter((c) => c.instructor === filter.instructor);
    }

    if (typeof filter?.minCredits !== "undefined") {
      list = list.filter((c) => c.credits >= filter.minCredits);
    }

    if (typeof filter?.maxCredits !== "undefined") {
      list = list.filter((c) => c.credits <= filter.maxCredits);
    }

    if (options?.sortBy) {
      list = applySort(list, options.sortBy, options.sortOrder);
    }

    const offset = options?.offset ?? 0;
    let limit = options?.limit ?? 10;
    if (limit > 50) limit = 50;

    return list.slice(offset, offset + limit);
  },
};
