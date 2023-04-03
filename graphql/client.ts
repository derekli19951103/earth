import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient("http://localhost:8080/graphql", {
  method: "POST",
  headers: {
    Authorization: `${"fFrzwK+1QNKZcxeyHEaDazIsMjAyMy0wNC0xMCAwNTozMjoyNS4yMzE4MDMgLTA0MDAgRURU"}`,
  },
});
