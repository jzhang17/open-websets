import { Auth } from "@langchain/langgraph-sdk/auth";

export const auth = new Auth()
  // Accept every request, no header required
  .authenticate(async () => ({
    identity: "anon",          // everyone shares this user id
    permissions: [],
  }))
  // Authorize everything those anon calls try to do
  .on("*", () => true);        // you can tighten this later