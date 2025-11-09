import { gql } from "apollo-server";

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Student {
    id: ID!
    name: String!
    email: String!
    age: Int!
    major: String!
    courses: [Course!]!
    coursesCount: Int!
  }

  type Course {
    id: ID!
    title: String!
    code: String!
    credits: Int!
    instructor: String!
    students: [Student!]!
    studentsCount: Int!
  }

  input StudentUpdateInput {
    name: String
    email: String
    age: Int
    major: String
  }

  input CourseUpdateInput {
    title: String
    code: String
    credits: Int
    instructor: String
  }

  input ListOptions {
    limit: Int
    offset: Int
    sortBy: String
    sortOrder: String
  }

  input StudentFilter {
    major: String
    nameContains: String
    emailContains: String
    minAge: Int
    maxAge: Int
  }

  input CourseFilter {
    codePrefix: String
    titleContains: String
    instructor: String
    minCredits: Int
    maxCredits: Int
  }

  type Query {
    getAllStudents(filter: StudentFilter, options: ListOptions): [Student!]!
    getAllCourses(filter: CourseFilter, options: ListOptions): [Course!]!
  }

  type Mutation {
    signup(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!

    addStudent(
      name: String!
      email: String!
      age: Int!
      major: String!
    ): Student!
    updateStudent(id: ID!, input: StudentUpdateInput!): Student!
    deleteStudent(id: ID!): Boolean!

    addCourse(
      title: String!
      code: String!
      credits: Int!
      instructor: String!
    ): Course!
    updateCourse(id: ID!, input: CourseUpdateInput!): Course!
    deleteCourse(id: ID!): Boolean!

    enrollStudent(studentId: ID!, courseId: ID!): Student!
    unenrollStudent(studentId: ID!, courseId: ID!): Student!
  }
`;
export default typeDefs;
