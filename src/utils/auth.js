export const requireAuth = (user) => {
  if (!user) throw new Error("UNAUTHENTICATED");
};
