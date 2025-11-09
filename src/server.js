import { ApolloServer } from "apollo-server";

import typeDefs from "./schema/index.js";
import { resolvers } from "./resolvers/index.js";
import { context } from "./context.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

server.listen(4000).then(() => console.log("✅ Server running at 4000"));
