import jwt from "jsonwebtoken";

export const signToken = (user) =>
  jwt.sign({ sub: user.id, email: user.email }, "SECRET123");
