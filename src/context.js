import jwt from "jsonwebtoken";
import { users } from "./data/db.js";

export const context = ({ req }) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) return { user: null };

  try {
    const decoded = jwt.verify(token, "SECRET123");
    const user = users.find((u) => u.id == decoded.sub);
    return { user };
  } catch (e) {
    return { user: null };
  }
};
