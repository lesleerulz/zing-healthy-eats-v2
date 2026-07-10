import { createClient } from "@libsql/client";

try {
  const client = createClient({ url: "file:./dev.db" });
  console.log("file:./dev.db works!");
} catch (e) {
  console.error("file:./dev.db failed:", e.message);
}

try {
  const client2 = createClient({ url: "file:dev.db" });
  console.log("file:dev.db works!");
} catch (e) {
  console.error("file:dev.db failed:", e.message);
}
